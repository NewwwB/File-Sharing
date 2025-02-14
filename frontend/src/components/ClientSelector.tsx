import { useEffect, useRef, useState } from "react";
import {
  Button,
  MenuItem,
  Select,
  Typography,
  Card,
  CardContent,
  Divider,
} from "@mui/material";

interface Message {
  type: "offer" | "answer" | "iceCandidate" | "availableClient" | "connected";
}

interface OfferMessage extends Message {
  type: "offer";
  data: {
    offer: RTCSessionDescriptionInit;
    from: string;
    to: string;
  };
}

interface AnswerMessage extends Message {
  type: "answer";
  data: {
    answer: RTCSessionDescriptionInit;
    from: string;
    to: string;
  };
}

interface CandidateMessage extends Message {
  type: "iceCandidate";
  data: {
    iceCandidate: RTCIceCandidate;
    from: string;
    to: string;
  };
}

interface ConnectedMessage extends Message {
  type: "connected";
  data: {
    id: string;
    name: string;
  };
}

interface ClientUpdateMessage extends Message {
  type: "availableClient";
  data: {
    time: string;
    clients: {
      key: string;
      name: string;
    }[];
  };
}
function isOfferMessage(message: Message): message is OfferMessage {
  return message.type === "offer";
}

function isAnswerMessage(message: Message): message is AnswerMessage {
  return message.type === "answer";
}

function isCandidateMessage(message: Message): message is CandidateMessage {
  return message.type === "iceCandidate";
}

function isConnectedMessage(message: Message): message is ConnectedMessage {
  return message.type === "connected";
}

function isClientUpdateMessage(
  message: Message
): message is ClientUpdateMessage {
  return message.type === "availableClient";
}

function dataChannelSetup(
  dataChannel: RTCDataChannel,
  connectionRef: React.MutableRefObject<{
    webSocket: WebSocket;
    peerConnection: RTCPeerConnection | null;
    dataChannel: RTCDataChannel | null;
    id: string | null;
  } | null>,
  receivedChunkRef: React.MutableRefObject<{
    buffer: Uint8Array[];
    remoteFileName: string;
  }>
) {
  const { current } = connectionRef;

  if (current?.dataChannel) {
    current.dataChannel.close();
  }
  if (current) {
    current.dataChannel = dataChannel;
  }
  dataChannel.onopen = () => {
    console.log("Data channel opened");
    dataChannel.onmessage = (event) => {
      // If message is a string, assume it's JSON with metadata or control info.
      if (typeof event.data === "string") {
        try {
          const msg = JSON.parse(event.data);
          if (msg.type === "metadata") {
            // Save incoming file metadata and reset buffers.
            receivedChunkRef.current.remoteFileName = msg.fileName;
            receivedChunkRef.current.buffer = [];
            console.log("webRTC: Received metadata");
            console.log(msg);
          } else if (msg.type === "EOF") {
            // Reassemble received chunks into a Blob and trigger download.
            const blob = new Blob(receivedChunkRef.current.buffer);
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = receivedChunkRef.current.remoteFileName;
            document.body.appendChild(a);
            a.click();
            URL.revokeObjectURL(url);
            console.log("File transfer complete.");
          }
        } catch (err) {
          console.error("Error parsing control message:", err);
        }
      } else {
        // Otherwise, assume binary data (a Uint8Array chunk) and store it.
        if (receivedChunkRef.current.buffer) {
          receivedChunkRef.current.buffer.push(event.data);
        }
      }
    };
  };
}

export default function ClientSelector() {
  const connectionRef = useRef<{
    webSocket: WebSocket;
    peerConnection: RTCPeerConnection | null;
    dataChannel: RTCDataChannel | null;
    id: string | null;
  } | null>(null);

  const receivedChunkRef = useRef<{
    buffer: Uint8Array[];
    remoteFileName: string;
  }>({ buffer: [], remoteFileName: "file_download" });

  const [selectedClient, setSelectedClient] = useState<{
    key: string;
    name: string;
  } | null>(null);

  const [clients, setClients] = useState<{ key: string; name: string }[]>([]);

  const [selectedFile, setSelectedFile] = useState<File>();

  // const [remoteFileName, setRemoteFileName] = useState<string>("file_download");

  const sendIceCandidateToPeer = (candidate: RTCIceCandidate, toId: string) => {
    const current = connectionRef.current;
    if (!current?.id) {
      console.error("ID not defined");
      return;
    }
    const message: CandidateMessage = {
      type: "iceCandidate",
      data: {
        iceCandidate: candidate,
        from: current.id,
        to: toId,
      },
    };
    current.webSocket.send(JSON.stringify(message));
  };

  useEffect(() => {
    if (selectedClient && !clients.find((c) => c.key === selectedClient.key)) {
      setSelectedClient(null);
    }
  }, [clients, selectedClient]);

  useEffect(() => {
    if (connectionRef.current) return;

    const webSocket = new WebSocket(
      `${window.location.origin.replace(/^http/, "ws")}/ws`
    );

    connectionRef.current = {
      webSocket,
      peerConnection: null,
      dataChannel: null,
      id: null,
    };

    webSocket.onmessage = async (messageEvent) => {
      const msgData = messageEvent.data;
      if (typeof msgData !== "string") return;

      const message = JSON.parse(msgData);
      console.log(`webSocket: Received message`);
      console.log(message);

      switch (message.type) {
        case "availableClient":
          if (isClientUpdateMessage(message)) {
            setClients(message.data.clients);
          }
          break;

        case "connected":
          if (isConnectedMessage(message)) {
            const { data } = message;
            if (connectionRef.current) {
              connectionRef.current.id = data.id;
            }
            document.title = data.name;
          }
          break;

        case "offer":
          if (isOfferMessage(message)) {
            const { data } = message;
            const configuration = {
              iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
            };
            const peerConnection = new RTCPeerConnection(configuration);
            if (connectionRef.current) {
              if (connectionRef.current.peerConnection) {
                connectionRef.current.peerConnection.close();
              }
              connectionRef.current.peerConnection = peerConnection;
            }

            peerConnection.ondatachannel = (event) => {
              const dataChannel = event.channel;

              dataChannelSetup(dataChannel, connectionRef, receivedChunkRef);
            };

            peerConnection.addEventListener("icecandidate", (event) => {
              if (event.candidate) {
                sendIceCandidateToPeer(event.candidate, data.from);
              }
            });

            await peerConnection.setRemoteDescription(
              new RTCSessionDescription(data.offer)
            );
            const answer = await peerConnection.createAnswer();
            await peerConnection.setLocalDescription(answer);
            const id = connectionRef.current?.id;
            if (!id) return;

            const answerMessage: AnswerMessage = {
              type: "answer",
              data: {
                answer: answer,
                from: id,
                to: data.from,
              },
            };
            webSocket.send(JSON.stringify(answerMessage));
          }
          break;

        case "answer":
          if (isAnswerMessage(message)) {
            const peerConnection = connectionRef.current?.peerConnection;
            if (!peerConnection) return;
            await peerConnection.setRemoteDescription(
              new RTCSessionDescription(message.data.answer)
            );
          }
          break;

        case "iceCandidate":
          if (isCandidateMessage(message)) {
            const peerConnection = connectionRef.current?.peerConnection;
            if (!peerConnection) return;
            try {
              await peerConnection.addIceCandidate(message.data.iceCandidate);
            } catch (e) {
              console.error("Error adding ice candidate", e);
            }
          }
          break;
      }
    };

    webSocket.onopen = () => {
      webSocket.send(
        JSON.stringify({ type: "hello", data: { message: "Hello World" } })
      );
    };

    return () => {
      webSocket.close();
      if (connectionRef.current?.peerConnection) {
        connectionRef.current.peerConnection.close();
      }
      connectionRef.current = null;
    };
  }, []);

  const handleConnectRequest = async () => {
    const current = connectionRef.current;
    if (!current?.id || !selectedClient?.key) {
      console.error("Connection not initialized or client not selected");
      return;
    }

    if (current.peerConnection) {
      current.peerConnection.close();
    }

    const configuration = {
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    };
    const peerConnection = new RTCPeerConnection(configuration);
    current.peerConnection = peerConnection;

    const dataChannel = peerConnection.createDataChannel("data", {
      ordered: true,
    });

    //setup data channel

    dataChannelSetup(dataChannel, connectionRef, receivedChunkRef);

    peerConnection.addEventListener("icecandidate", (event) => {
      if (event.candidate) {
        sendIceCandidateToPeer(event.candidate, selectedClient.key);
      }
    });

    try {
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);
      const message: OfferMessage = {
        type: "offer",
        data: {
          offer,
          to: selectedClient.key,
          from: current.id,
        },
      };
      current.webSocket.send(JSON.stringify(message));
    } catch (error) {
      console.error("Error creating offer:", error);
    }
  };

  // function handleFileChange(event: ChangeEvent<HTMLInputElement>): void {
  //   throw new Error("Function not implemented.");
  // }

  async function handleSendFile() {
    if (connectionRef.current) {
      const { dataChannel } = connectionRef.current;
      if (selectedFile && dataChannel && dataChannel.readyState === "open") {
        const stream = selectedFile.stream();
        const reader = stream.getReader();

        //first send meta data

        const metaMessage = {
          type: "metadata",
          fileName: selectedFile.name,
          fileSize: selectedFile.size,
        };

        dataChannel.send(JSON.stringify(metaMessage));

        // second send data
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          dataChannel.send(value);
        }

        // third send end of message
        const eof = {
          type: "EOF",
        };
        dataChannel?.send(JSON.stringify(eof));
        console.log("file sent");
      } else {
        if (!selectedFile) {
          console.warn("file not selected");
        } else {
          console.warn("data channel not opened");
        }
      }
    }
  }

  return (
    <>
      <Card
        sx={{ maxWidth: 400, mx: "auto", mt: 5, p: 2, textAlign: "center" }}
      >
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Select a Client
          </Typography>
          <Select
            value={selectedClient?.key || ""}
            onChange={(e) => {
              const client = clients.find((c) => c.key === e.target.value);
              setSelectedClient(client || null);
            }}
            displayEmpty
            fullWidth
          >
            <MenuItem value="" disabled>
              Select a client
            </MenuItem>
            {clients.map((client) => (
              <MenuItem key={client.key} value={client.key}>
                {client.name}
              </MenuItem>
            ))}
          </Select>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
            onClick={handleConnectRequest}
            disabled={!selectedClient}
          >
            Connect Request
          </Button>

          {/* Divider to separate sections */}
          <Divider sx={{ my: 2 }} />

          {/* File Upload Section */}
          <Typography variant="h6" gutterBottom>
            Upload File
          </Typography>
          <Button variant="outlined" component="label" fullWidth sx={{ mt: 1 }}>
            Choose File
            <input
              type="file"
              hidden
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setSelectedFile(e.target.files[0]);
                }
              }}
            />
          </Button>
          <Button
            variant="contained"
            color="secondary"
            fullWidth
            sx={{ mt: 2 }}
            onClick={handleSendFile}
            disabled={!selectedFile}
          >
            Send
          </Button>
        </CardContent>
      </Card>
    </>
  );
}
