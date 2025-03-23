import { WebSocket } from "ws";

export type WebSocketWithUserData = WebSocket & { user?: User };

// src/webrtcMessages.ts

export interface Message {
  type: "offer" | "answer" | "iceCandidate" | "availableClient" | "connected";
}

export interface OfferMessage extends Message {
  type: "offer";
  data: {
    offer: RTCSessionDescriptionInit;
    from: User;
    to: User;
  };
}

export interface AnswerMessage extends Message {
  type: "answer";
  data: {
    status: boolean;
    answer?: RTCSessionDescriptionInit;
    from: User;
    to: User;
  };
}

export interface CandidateMessage extends Message {
  type: "iceCandidate";
  data: {
    iceCandidate: RTCIceCandidate;
    from: User;
    to: User;
  };
}

export interface User {
  id: string;
  name: string;
  profilePic: string;
  online?: boolean;
}

export interface ConnectedMessage extends Message {
  type: "connected";
  data: User;
}

export interface ClientUpdateMessage extends Message {
  type: "availableClient";
  data: {
    time: string;
    clients: User[];
  };
}

// Type guard functions
export function isOfferMessage(message: Message): message is OfferMessage {
  return message.type === "offer";
}

export function isAnswerMessage(message: Message): message is AnswerMessage {
  return message.type === "answer";
}

export function isCandidateMessage(
  message: Message
): message is CandidateMessage {
  return message.type === "iceCandidate";
}

export function isConnectedMessage(
  message: Message
): message is ConnectedMessage {
  return message.type === "connected";
}

export function isClientUpdateMessage(
  message: Message
): message is ClientUpdateMessage {
  return message.type === "availableClient";
}
