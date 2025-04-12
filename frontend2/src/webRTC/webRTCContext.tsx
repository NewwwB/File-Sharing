import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
} from "react";
import {
  isClientUpdateMessage,
  isConnectedMessage,
  isOfferMessage,
  isAnswerMessage,
  User,
} from "../types/webRTCMessages";

type WebRTCContextType = {
  nearBy: User[] | null;
  peer: RTCPeerConnection | null;
  createPeer: () => RTCPeerConnection;
  closePeer: () => void;
  user: User | null;
};

const WebRTCContext = createContext<WebRTCContextType | undefined>(undefined);

export const WebRTCProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [peer, setPeer] = useState<RTCPeerConnection | null>(null);
  const peerRef = useRef<RTCPeerConnection | null>(null);
  const ws = useRef<WebSocket | null>(null);
  const [nearBy, setNearBy] = useState<User[] | null>(null);
  const [user, setUser] = useState<User | null>(null);

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
    ws.current.onerror = (err) => {
      console.error("WebSocket error:", err);
    };

    ws.current.onclose = (e) => {
      console.warn("WebSocket closed:", e.code, e.reason);
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
            setNearBy(message.data.clients);
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
            // setIncomingConnection({
            //   client: message.data.from,
            //   approve: null,
            //   offer: message.data.offer,
            // }
            // );
          }
          break;
        case "answer":
          if (isAnswerMessage(message)) {
            // set remote description
            if (!message.data.answer) return;
            // handleAnswer(message.data.answer);
          }
          break;
      }
    };

    return () => {
      ws.current?.close(); // Cleanup WebSocket on unmount
    };
  }, []);

  const createPeer = (): RTCPeerConnection => {
    if (peerRef.current) {
      peerRef.current.close();
    }

    const newPeer = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    peerRef.current = newPeer;
    setPeer(newPeer);

    return newPeer;
  };

  const closePeer = () => {
    if (peerRef.current) {
      peerRef.current.close();
      peerRef.current = null;
      setPeer(null);
    }
  };

  return (
    <WebRTCContext.Provider
      value={{ peer, createPeer, closePeer, nearBy, user }}
    >
      {children}
    </WebRTCContext.Provider>
  );
};

// Custom hook for easier usage
export const useWebRTC = (): WebRTCContextType => {
  const context = useContext(WebRTCContext);
  if (!context) {
    throw new Error("useWebRTC must be used within a WebRTCProvider");
  }
  return context;
};
