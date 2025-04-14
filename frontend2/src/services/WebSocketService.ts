import { Action } from "../types/stateContextTypes";
import { Message } from "../types/webRTCMessages";

type MessageHandler = (message: Message) => void;

class WebSocketService {
  private socket: WebSocket | null = null;
  private handlers: Partial<Record<Message["type"], MessageHandler>> = {};

  //connect
  //disconnect
  //registerHandler
  //unregisterHandler

  connect(url: string) {
    if (this.socket) this.disconnect();

    this.socket = new WebSocket(url);

    this.socket.onclose = () => {
      console.log("WS closed");
    };
    this.socket.onopen = () => {
      console.log("WS opened");
    };
    this.socket.onerror = (e) => {
      console.error("WS error:", e);
    };
  }

  resgisterMessageListener() {
    if (!this.socket) {
      console.warn("WS not found");
      return;
    }
    this.socket.onmessage = (event) => {
      const msg: Message = JSON.parse(event.data);

      console.log("WS message: ", msg);

      const handler = this.handlers[msg.type];

      if (handler) handler(msg);
      else console.warn("WS handler for type: ", msg.type, " not found.");
    };
  }

  disconnect() {
    this.socket?.close();
  }

  send(message: Message) {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      console.warn("WS not connected and cannot send message: ", message);
      return;
    }
    this.socket.send(JSON.stringify(message));
  }

  registerHandler<T extends Message["type"]>(
    type: T,
    handler: (msg: Extract<Message, { type: T }>) => void
  ) {
    this.handlers[type] = handler as MessageHandler;
  }
  unregisterHandler(type: Message["type"]) {
    delete this.handlers[type];
  }
}
export const webSocketService = new WebSocketService();
