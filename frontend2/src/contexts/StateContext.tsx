import { createContext, useContext, useEffect, useReducer } from "react";
import { GlobalState, Action } from "../types/stateContextTypes";

const initialState: GlobalState = {
  clients: [],
  user: null,
  remoteUser: null,
  approvalRequest: null,
  connectionStatus: "disconnected",
  fileTransfers: [],
};

function stateReducer(state: GlobalState, action: Action): GlobalState {
  switch (action.type) {
    case "SET_CLIENTS":
      return { ...state, clients: action.payload };
    case "CLEAR_CLIENTS":
      return { ...state, clients: [] };
    case "SET_USER":
      return { ...state, user: action.payload };
    case "CLEAR_USER":
      return { ...state, user: null };
    case "SET_REMOTE_USER":
      return { ...state, remoteUser: action.payload };
    case "CLEAR_REMOTE_USER":
      return { ...state, remoteUser: null };
    case "SET_APPROVAL_REQUEST":
      return { ...state, approvalRequest: action.payload };
    case "UPDATE_CONNECTION_STATUS":
      return { ...state, connectionStatus: action.payload };
    case "ADD_FILE_TRANSFER":
      return {
        ...state,
        fileTransfers: [...state.fileTransfers, action.payload],
      };

    case "UPDATE_FILE_TRANSFER":
      return {
        ...state,
        fileTransfers: state.fileTransfers.map((transfer) =>
          transfer.id === action.payload.id
            ? {
                ...transfer,
                progress: action.payload.progress,
                status: action.payload.status,
              }
            : transfer
        ),
      };

    case "REMOVE_FILE_TRANSFER":
      return {
        ...state,
        fileTransfers: state.fileTransfers.filter(
          (transfer) => transfer.id !== action.payload
        ),
      };
    default:
      return state;
  }
}

const StateContext = createContext<{
  state: GlobalState;
  dispatch: React.Dispatch<Action>;
} | null>(null);

export const StateProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(stateReducer, initialState);

  useEffect(() => {
    state.fileTransfers.forEach((e) => console.log(e.name, ": ", e.status));
  }, [state.fileTransfers]);

  return (
    <StateContext.Provider value={{ state, dispatch }}>
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => {
  const context = useContext(StateContext);
  if (!context) {
    throw new Error("useStateContext must be used within a StateProvider");
  }
  return context;
};
