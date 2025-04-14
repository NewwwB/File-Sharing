// src/contexts/AppContext.tsx
import React, { createContext, useContext, useEffect } from "react";
import { webSocketService } from "../services/WebSocketService";
import { useStateContext } from "./StateContext";
import { createWebSocketHandlers } from "../handlers/webSocketHandlers";
import { Action, GlobalState } from "../types/stateContextTypes";

const AppContext = createContext(null);

const useAppContext = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used within AppProvider");
  return ctx;
};

const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const { dispatch, state } = useStateContext();

  useEffect(() => {
    setupWebSocket(dispatch, state);
    return () => {
      webSocketService.disconnect();
    };
  }, []);

  return <AppContext.Provider value={null}>{children}</AppContext.Provider>;
};

export { AppProvider, useAppContext };

const setupWebSocket = (
  dispatch: React.Dispatch<Action>,
  state: GlobalState
) => {
  const storedId = localStorage.getItem("userId");
  webSocketService.connect(
    `${window.location.origin.replace(/^http/, "ws")}/ws?${
      storedId ? "id=" + storedId : ""
    }`
  );

  createWebSocketHandlers(dispatch, state).forEach((handler) =>
    webSocketService.registerHandler(handler.type, handler.func)
  );
  webSocketService.resgisterMessageListener();
};
