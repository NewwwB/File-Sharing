import { createContext, useContext, useEffect, useRef, useState } from "react";
import {
  Message,
  OfferMessage,
  AnswerMessage,
  CandidateMessage,
  ConnectedMessage,
  ClientUpdateMessage,
  isOfferMessage,
  isAnswerMessage,
  isCandidateMessage,
  isConnectedMessage,
  isClientUpdateMessage,
  User,
} from "../types/webrtcMessages"; // Adjust the path if needed
import { createAnswer } from "./handlers/createAnswer";
import { helpConnect } from "./handlers/helpConnect";

interface WebRTCContextType {
  handleConnect: (connectTo: User) => Promise<void>;
  previousConnections: User[] | null;
  handleAnswer: (answer: RTCSessionDescriptionInit) => Promise<void>;
  remoteId: string | null;
  setRemoteId: (id: string | null) => void;
  isConnecting: boolean;
  isConnected: boolean;
  incomingConnection: IncomingConnection | null;
  setIncomingConnection: React.Dispatch<
    React.SetStateAction<IncomingConnection | null>
  >;
}

interface IncomingConnection {
  client: User;
  approve: boolean | null;
  offer: RTCSessionDescriptionInit;
}

const WebRTCContext = createContext<WebRTCContextType | null>(null);

export const WebRTCProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const ws = useRef<WebSocket | null>(null);
  const pc = useRef<RTCPeerConnection | null>(null);
  const dataChannel = useRef<RTCDataChannel | null>(null);
  const [user, setUser] = useState<User | null>(null); // just meta data to render user id for connection
  const [outgoingConnection, setOutgoingConnection] = useState<{
    client: User;
    offer: RTCSessionDescriptionInit;
  } | null>(null); // to render connecting request and trigger the generation and transmission of offer
  const [incomingConnection, setIncomingConnection] =
    useState<IncomingConnection | null>(null); // use to render incoming connection req

  const [isConnecting, setIsConnecting] = useState<boolean>(false); // to render state of connection
  const [isConnected, setIsConnected] = useState<boolean>(false); // to render connected or not
  const [previousConnections, setPreviousConnections] = useState<User[] | null>(
    null
  ); // to render connection available though purpose is to render previous connections

  const [remoteId, setRemoteId] = useState<string | null>(null); // used to set the field of connecting client id

  /**
   * how would it work ?
   * 1) 1st User click connect , offer is generated
   * 2) 2nd User recieve message over ws
   * 3) we need to update few things like incoming connection approval
   * 4) for that we need to update some states
   * 5) IncomingConnection
   */

  /**
   * States:
   * 1) user
   * 2) outgoingConnection
   * 3) incomingConnection
   * 4) isConnecting
   * 5) isConnected
   * 6) previousConnections
   *
   * Event Handlers
   * 1) handleConnect ( used by previous connection section and connect button)
   * 2)
   */

  useEffect(() => {
    //getting id stored locally from previous interaction
    const storedId = localStorage.getItem("userId");

    //new instance of websocket
    ws.current = new WebSocket(
      `${window.location.origin.replace(/^http/, "ws")}/ws?${
        storedId ? "id=" + storedId : ""
      }`
    );

    ws.current.onopen = () => {
      console.log("connected");
    };

    // instance RTC peer connection
    pc.current = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    pc.current.ondatachannel = (event) => {
      console.log("DataChannel received!");
      dataChannel.current = event.channel;

      dataChannel.current.onopen = () => console.log("DataChannel Opened!");
      dataChannel.current.onmessage = (event) =>
        console.log("Message:", event.data);
      dataChannel.current.onclose = () => console.log("DataChannel Closed!");
    };

    // event handlers of web socket
    ws.current.onmessage = async ({ data }) => {
      if (typeof data !== "string") {
        console.error("recieved message is not string");
        return;
      }
      const message = JSON.parse(data);
      switch (message.type) {
        case "availableClient":
          if (isClientUpdateMessage(message)) {
            setPreviousConnections(message.data.clients);
          }
          break;
        case "connected":
          if (isConnectedMessage(message)) {
            localStorage.setItem("userId", message.data.id);
            localStorage.setItem("userName", message.data.name);
            localStorage.setItem("userAvatar", message.data.profilePic);

            setUser(message.data);
          }
          break;
        case "offer":
          if (isOfferMessage(message)) {
            // approve or deny
            // create answer
            // send answer

            setIncomingConnection({
              client: message.data.from,
              approve: null,
              offer: message.data.offer,
            });
          }
          break;
        case "answer":
          if (isAnswerMessage(message)) {
            // set remote description
            if (!message.data.answer) return;
            handleAnswer(message.data.answer);
          }
          break;
      }
    };

    return () => {
      ws.current?.close(); // Cleanup WebSocket on unmount
      pc.current?.close();
    };
  }, []);

  //used in previous connection section to initiate connecection
  const handleConnect = async (connectTo: User) => {
    if (!user || !ws.current || !pc.current) {
      console.error("user or websocket or peerconnection not defined");
      return;
    }
    await helpConnect(
      connectTo,
      user,
      ws.current,
      pc.current,
      dataChannel,
      setOutgoingConnection,
      setIsConnecting
    );
  };

  // React to incoming connection updates
  useEffect(() => {
    if (incomingConnection?.approve === true) {
      handleApprove();
    }
  }, [incomingConnection?.approve]); // Runs when incomingConnection changes

  const handleApprove = async () => {
    setIsConnecting(true);
    if (!pc.current || !incomingConnection?.offer) return;

    const answer = await createAnswer(incomingConnection.offer, pc.current);
    if (!answer || !user) return;

    const answerMessage: AnswerMessage = {
      type: "answer",
      data: {
        status: true,
        answer,
        from: user,
        to: incomingConnection.client,
      },
    };

    ws.current?.send(JSON.stringify(answerMessage));
  };

  const handleAnswer = async (
    answer: RTCSessionDescriptionInit
  ): Promise<void> => {
    if (!pc.current) return;
    await pc.current.setRemoteDescription(answer);
    setIsConnected(true);
    setIsConnecting(false);
  };

  return (
    <WebRTCContext.Provider
      value={{
        handleConnect,
        previousConnections,
        // dataChannel,
        handleAnswer,
        remoteId,
        setRemoteId,
        incomingConnection,
        isConnected,
        isConnecting,
        setIncomingConnection,
      }}
    >
      {children}
    </WebRTCContext.Provider>
  );
};

export const useWebRTC = (): WebRTCContextType => {
  const context = useContext(WebRTCContext);
  if (!context) {
    throw new Error("useWebRTC must be used within a WebRTCProvider");
  }
  return context;
};
