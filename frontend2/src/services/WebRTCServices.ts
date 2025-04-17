import { Action, GlobalState } from "../types/stateContextTypes";
import { CandidateMessage, User } from "../types/webRTCMessages";
import { webSocketService } from "./WebSocketService";

class WebRTCServices {
  private pc: RTCPeerConnection | null = null;

  constructor() {}

  setupConnection(
    user: User,
    remoteUser: User,
    dispatch: React.Dispatch<Action>
  ) {
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
            payload: status, // "connected", "disconnected", "failed", etc.
          });
        }
      };
      this.pc.onicecandidate = (event) => {
        if (event.candidate) {
          console.log(
            "iceCandidate fired with state fields",
            user?.name,
            remoteUser?.name
          );
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
    } else {
      console.warn("Cannot initialize PeerConnection - missing user data");
      return;
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
