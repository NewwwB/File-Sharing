import { User } from "./webRTCMessages";

export interface FileTransfer {
  id: string;
  name: string;
  size: number;
  progress: number;
  status:
    | "uploading"
    | "downloading"
    | "paused"
    | "completed"
    | "incoming"
    | "error";
  direction: "incoming" | "outgoing";
}

export interface GlobalState {
  clients: User[];
  user: User | null;
  remoteUser: User | null;
  approvalRequest: User | null;
  connectionStatus: string;
  fileTransfers: FileTransfer[];
}

export type Action =
  | { type: "SET_CLIENTS"; payload: User[] }
  | { type: "CLEAR_CLIENTS" }
  | { type: "SET_USER"; payload: User }
  | { type: "SET_REMOTE_USER"; payload: User }
  | { type: "CLEAR_USER" }
  | { type: "CLEAR_REMOTE_USER" }
  | { type: "SET_APPROVAL_REQUEST"; payload: User | null }
  | { type: "UPDATE_CONNECTION_STATUS"; payload: string }
  | { type: "ADD_FILE_TRANSFER"; payload: FileTransfer }
  | {
      type: "UPDATE_FILE_TRANSFER";
      payload: { id: string; progress: number; status: FileTransfer["status"] };
    }
  | { type: "REMOVE_FILE_TRANSFER"; payload: string };
