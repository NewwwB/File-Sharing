import { User } from "./webRTCMessages";

export interface GlobalState {
  clients: User[];
  user: User | null;
  remoteUser: User | null;
  approvalRequest: User | null;
  connectionStatus: string;
}

export type Action =
  | { type: "SET_CLIENTS"; payload: User[] }
  | { type: "CLEAR_CLIENTS" }
  | { type: "SET_USER"; payload: User }
  | { type: "SET_REMOTE_USER"; payload: User }
  | { type: "CLEAR_USER" }
  | { type: "CLEAR_REMOTE_USER" }
  | { type: "SET_APPROVAL_REQUEST"; payload: User | null }
  | { type: "UPDATE_CONNECTION_STATUS"; payload: string };
