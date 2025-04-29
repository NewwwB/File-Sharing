import { createAvatar } from "@dicebear/core";
import { adventurer, micah, identicon } from "@dicebear/collection";
import { WebSocketServer, WebSocket } from "ws";
import { IncomingMessage } from "http";
import { nanoid } from "nanoid";
import { faker } from "@faker-js/faker";
import { handleWebSocketMessage } from "./handlers";
import { WebSocketWithUserData, ConnectedMessage } from "./types";
import { updateClientList } from "./utils";

// Create WebSocket server
const wss = new WebSocketServer({ port: 8080 });
const clients = new Map<string, WebSocketWithUserData>();

wss.on("connection", (ws: WebSocket, req: IncomingMessage) => {
  console.log("new connection with header:", typeof req.url, req.url);

  const reqUrl = new URL(req.url || "", `http://${req.headers.host}`);
  const params = reqUrl.searchParams;

  let id: string | undefined = params.get("id") ?? undefined; // Ensure type safety
  let name: string | undefined;

  if (id && clients.has(id)) {
    name = clients.get(id)?.user?.name;
  } else {
    id = undefined;
  }

  // Generate an avatar using DiceBear
  const uniqueSeed = `${id}-${Date.now()}-${Math.random()}`;
  const avatar = createAvatar(adventurer, { seed: uniqueSeed }).toDataUri();

  if (!id || !name) {
    id = nanoid();
    name = faker.internet.username();
  }

  (ws as WebSocketWithUserData).user = { name, id, profilePic: avatar };
  clients.set(id, ws);

  const message: ConnectedMessage = {
    type: "connected",
    data: { id, name, profilePic: avatar, online: true },
  };
  ws.send(JSON.stringify(message));

  updateClientList(clients);

  ws.on("message", (msg) => handleWebSocketMessage(ws, msg, clients));
  ws.on("close", () => {
    clients.delete(id);
    updateClientList(clients);
  });

  ws.onerror = (e) => console.error(e);
});
