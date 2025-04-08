import { WebSocketWithUserData, Message, OfferMessage } from "./types";

export function handleWebSocketMessage(
  ws: WebSocketWithUserData,
  msg: any,
  clients: Map<string, WebSocketWithUserData>
) {
  let msgString: string;
  if (typeof msg === "string") {
    msgString = msg;
  } else if (msg instanceof Buffer) {
    msgString = msg.toString();
  } else {
    console.error("Received unexpected message type:", typeof msg);
    return;
  }

  try {
    const message: Message = JSON.parse(msgString);
    const name = ws.user?.name || "Unknown";

    console.log(`Received message from ${name}:\n${msgString}`);

    switch (message.type) {
      case "offer":
      case "answer":
      case "iceCandidate": {
        const { to } = (message as OfferMessage).data;
        const recipient = clients.get(to.id);
        if (recipient) {
          recipient.send(JSON.stringify(message));
        } else {
          console.error(`Recipient with ID ${to} not found.`);
        }
        break;
      }

      case "availableClient":
        for (const client of clients.values()) {
          client.send(JSON.stringify(message));
        }
        break;

      default:
        console.warn("Unknown message type received:", message);
        break;
    }
  } catch (error) {
    console.error("Error parsing incoming message:", error);
  }
}
