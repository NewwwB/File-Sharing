import { useAppContext } from "../contexts/AppContext";
import { ClientUpdateMessage, Message } from "../types/webRTCMessages";

interface Handler {
  type: Message["type"];
  func: (msg: Message) => void;
}

export const createWebSocketHandlers = () => {
  const { setClients } = useAppContext();

  const handlers: Handler[] = [
    {
      type: "availableClient",
      func: (msg) => {
        setClients((msg as ClientUpdateMessage).data.clients);
      },
    },
  ];
  return handlers;
};
