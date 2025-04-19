import { Action, GlobalState } from "../types/stateContextTypes";
import { CandidateMessage, User } from "../types/webRTCMessages";
import { webSocketService } from "./WebSocketService";

type FileTransferChannel = {
  receiveBuffer: Uint8Array[];
  receivedSize: number;
  fileSize: any;
  fileType: string | undefined;
  fileName: string;
  channel: RTCDataChannel;
  file?: File;
  progress: number;
  reader?: FileReader;
  offset: number;
};

class WebRTCServices {
  private pc: RTCPeerConnection | null = null;
  private dataChannels = new Map<string, FileTransferChannel>();
  private dispatch: React.Dispatch<Action> | null = null;

  setDispatch(dispatch: React.Dispatch<Action>) {
    this.dispatch = dispatch;
  }
  createFileDataChannel(
    transferId: string,
    file?: File
  ): RTCDataChannel | null {
    if (!this.pc) return null;

    const channel = this.pc.createDataChannel(`file-${transferId}`);
    channel.binaryType = "arraybuffer";

    this.dataChannels.set(transferId, {
      channel,
      file,
      progress: 0,
      offset: 0,
      receiveBuffer: [],
      receivedSize: 0,
      fileSize: 0,
      fileType: undefined,
      fileName: "",
    });

    channel.onopen = () => {
      if (file) {
        this.sendFileMetadata(transferId, file);
        this.sendFileChunk(transferId);
      }
    };

    channel.onmessage = (event) =>
      this.handleDataChannelMessage(transferId, event);
    channel.onclose = () => this.cleanupDataChannel(transferId);

    return channel;
  }

  private sendFileMetadata(transferId: string, file: File) {
    const channelInfo = this.dataChannels.get(transferId);
    if (!channelInfo) return;

    const metadata = {
      type: "metadata",
      data: {
        name: file.name,
        size: file.size,
        type: file.type,
        transferId,
      },
    };
    channelInfo.channel.send(JSON.stringify(metadata));
  }

  private sendFileChunk(transferId: string) {
    const channelInfo = this.dataChannels.get(transferId);
    if (!channelInfo || !channelInfo.file) return;

    const CHUNK_SIZE = 16384;
    const file = channelInfo.file;
    const slice = file.slice(
      channelInfo.offset,
      channelInfo.offset + CHUNK_SIZE
    );

    const reader = new FileReader();
    reader.onload = (e) => {
      if (
        e.target?.result instanceof ArrayBuffer &&
        channelInfo.channel.readyState === "open"
      ) {
        channelInfo.channel.send(e.target.result);
        channelInfo.offset += e.target.result.byteLength;
        const progress = Math.trunc((channelInfo.offset / file.size) * 100);

        this.dispatch?.({
          type: "UPDATE_FILE_TRANSFER",
          payload: { id: transferId, progress, status: "uploading" },
        });

        if (channelInfo.offset < file.size) {
          this.sendFileChunk(transferId);
        }
      }
    };
    reader.readAsArrayBuffer(slice);
  }

  private handleDataChannelMessage(transferId: string, event: MessageEvent) {
    const channelInfo = this.dataChannels.get(transferId);
    if (!channelInfo) return;

    if (typeof event.data === "string") {
      const message = JSON.parse(event.data);
      if (message.type === "metadata") {
        const data = message.data;
        // Update the channel info with metadata
        channelInfo.fileName = data.name;
        channelInfo.fileSize = data.size;
        channelInfo.fileType = data.type;

        this.dispatch?.({
          type: "ADD_FILE_TRANSFER",
          payload: {
            id: transferId,
            name: data.name,
            size: data.size,
            progress: 0,
            status: "downloading",
            direction: "incoming",
          },
        });
      }
    } else {
      this.handleFileChunk(transferId, event.data);
    }
  }

  private handleFileChunk(transferId: string, chunk: ArrayBuffer) {
    const channelInfo = this.dataChannels.get(transferId);
    if (!channelInfo) return;

    if (!channelInfo.receiveBuffer) {
      channelInfo.receiveBuffer = [];
      channelInfo.receivedSize = 0;
    }

    channelInfo.receiveBuffer.push(new Uint8Array(chunk));
    channelInfo.receivedSize += chunk.byteLength;

    const progress = Math.trunc(
      (channelInfo.receivedSize / channelInfo.fileSize) * 100
    );
    this.dispatch?.({
      type: "UPDATE_FILE_TRANSFER",
      payload: { id: transferId, progress, status: "downloading" },
    });

    if (channelInfo.receivedSize >= channelInfo.fileSize) {
      this.finalizeFileTransfer(transferId);
    }
  }

  private finalizeFileTransfer(transferId: string) {
    const channelInfo = this.dataChannels.get(transferId);
    if (!channelInfo || !channelInfo.receiveBuffer) return;

    const totalSize = channelInfo.receiveBuffer.reduce(
      (acc, chunk) => acc + chunk.length,
      0
    );
    const fileBuffer = new Uint8Array(totalSize);
    let offset = 0;

    channelInfo.receiveBuffer.forEach((chunk) => {
      fileBuffer.set(chunk, offset);
      offset += chunk.length;
    });

    const blob = new Blob([fileBuffer], { type: channelInfo.fileType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = channelInfo.fileName;
    a.click();
    URL.revokeObjectURL(url);

    this.dispatch?.({
      type: "UPDATE_FILE_TRANSFER",
      payload: {
        id: transferId,
        progress: 100,
        status: "completed",
      },
    });

    setTimeout(() => this.cleanupDataChannel(transferId), 2000);
  }

  private cleanupDataChannel(transferId: string) {
    this.dataChannels.delete(transferId);
    this.dispatch?.({
      type: "REMOVE_FILE_TRANSFER",
      payload: transferId,
    });
  }

  setupConnection(
    user: User,
    remoteUser: User,
    dispatch: React.Dispatch<Action>
  ) {
    this.dispatch = dispatch;
    if (user && remoteUser) {
      if (this.pc) {
        console.warn("PeerConnection already exists");
        return;
      }
      this.pc = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      });
      this.pc.onconnectionstatechange = () => {
        const status = this.pc?.connectionState;
        if (status) {
          dispatch({
            type: "UPDATE_CONNECTION_STATUS",
            payload: status,
          });
        }
      };
      this.pc.onicecandidate = (event) => {
        if (event.candidate) {
          if (user && remoteUser) {
            const candidateMsg: CandidateMessage = {
              type: "iceCandidate",
              data: {
                iceCandidate: event.candidate,
                from: user,
                to: remoteUser,
              },
            };
            webSocketService.send(candidateMsg);
          }
        }
      };
      // Handle incoming data channels
      this.pc.ondatachannel = (event) => {
        const channel = event.channel;
        if (channel.label.startsWith("file-")) {
          const transferId = channel.label.split("-")[1];
          channel.binaryType = "arraybuffer";

          this.dataChannels.set(transferId, {
            channel,
            receiveBuffer: [],
            receivedSize: 0,
            fileSize: 0,
            fileName: "",
            fileType: undefined,
            progress: 0,
            offset: 0,
          });

          channel.onmessage = (e) =>
            this.handleDataChannelMessage(transferId, e);
          channel.onclose = () => this.cleanupDataChannel(transferId);
        }
      };
    } else {
      console.warn("Cannot initialize PeerConnection - missing user data");
    }
  }

  cleanup() {
    if (this.pc) {
      // Remove all event listeners
      this.pc.onicecandidate = null;
      this.pc.onconnectionstatechange = null;
      this.pc.close();
      this.pc = null;
    }
  }

  createDummyDataChannel() {
    if (!this.pc) {
      console.warn("PC not available while creating dummy data channel");
      return;
    }

    this.pc.createDataChannel("dummy");
  }

  async createOffer(): Promise<RTCSessionDescriptionInit | null> {
    if (!this.pc) {
      console.warn("PC not available while creating offer");
      return null;
    }

    try {
      const offer = await this.pc.createOffer();
      await this.pc.setLocalDescription(offer);
      return offer;
    } catch (e) {
      console.error("Error creating offer: ", e);
      return null;
    }
  }

  async registerOffer(offer: RTCSessionDescriptionInit): Promise<void> {
    if (!this.pc) {
      console.warn("PC not available while registering offer");
      return;
    }
    try {
      await this.pc.setRemoteDescription(new RTCSessionDescription(offer));
    } catch (e) {
      console.error("Error setting remote description: ", e);
    }
  }

  async createAnswer(): Promise<RTCSessionDescriptionInit | null> {
    if (!this.pc) {
      console.warn("PC not available while creating answer");
      return null;
    }
    if (!this.pc?.remoteDescription) {
      console.warn("remote description not found while creating answer");
      return null;
    }

    try {
      const answer = await this.pc.createAnswer();
      await this.pc.setLocalDescription(answer);
      return answer;
    } catch (e) {
      console.error("Error creating answer: ", e);
      return null;
    }
  }

  async registerAnswer(answer: RTCSessionDescriptionInit): Promise<void> {
    if (!this.pc) {
      console.warn("PC not available while registering answer");
      return;
    }
    try {
      await this.pc.setRemoteDescription(answer);
    } catch (e) {
      console.error("Error setting remote description: ", e);
    }
  }

  async addIceCandidate(candidate: RTCIceCandidateInit) {
    if (!this.pc) {
      console.warn("PC not available while adding ice candidate");
      return;
    }
    try {
      await this.pc.addIceCandidate(new RTCIceCandidate(candidate));
    } catch (e) {
      console.error("Error adding ICE candidate: ", e);
    }
  }
}

export const webRTCService = new WebRTCServices();
