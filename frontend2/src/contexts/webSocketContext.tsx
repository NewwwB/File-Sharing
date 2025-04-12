import { createContext, useContext, useEffect } from "react";
import { webSocketService } from "../services/webSocketService";
import { createWebSocketHandlers } from "../handlers/webSocketHandlers";

interface WebSocketContext {}

const webSocketContext = createContext({});

const webSocketProvider = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    const storedId = localStorage.getItem("userId");
    webSocketService.connect(
      `${window.location.origin.replace(/^http/, "ws")}/ws?${
        storedId ? "id=" + storedId : ""
      }`
    );

    createWebSocketHandlers().forEach((handler) =>
      webSocketService.registerHandler(handler.type, handler.func)
    );
  }, []);
};
