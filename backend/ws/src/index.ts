import { WebSocket, WebSocketServer } from "ws";
import { v4 as uuidv4 } from "uuid";
import { faker } from "@faker-js/faker";

const wss = new WebSocketServer({ port: 8080 });
const clients = new Map<string, Client>();
const now = new Date();

interface Client {
  name: string;
  ws: WebSocket;
}

wss.on("connection", (ws: WebSocket) => {
  const id = uuidv4();
  const name = faker.internet.username();
  clients.set(id, { name, ws });
  console.log(`Client connected with ID: ${id}`);

  //send connected message
  const message: ConnectedMessage = {
    type: "connected",
    data: {
      id,
      name,
    },
  };
  ws.send(JSON.stringify(message));

  updateClient2();

  ws.on("message", (msg) => {
    const msgString = msg.toString();
    console.log(`recieved message from ${name}: \n ${msgString}`);
    const { type, data } = JSON.parse(msgString);
    if (type === "offer" || type === "answer" || type === "iceCandidate") {
      if (clients.has(data.to)) {
        clients.get(data.to)?.ws.send(msgString);
        console.log(`message forward to ${data.to}`);
      } else console.error(`client not found with id: ${data.to}`);
    } else if (type === "hello") {
    }
  });

  ws.on("close", () => {
    clients.delete(id);
    updateClient2();
  });
  ws.onerror = (e) => console.error(e);
});

wss.on("error", console.error);

const updateClient2 = () => {
  const clientEntries = Array.from(clients);

  clientEntries.forEach(([id, client]) => {
    const clientsList = clientEntries
      .filter(([otherId]) => otherId !== id)
      .map(([otherId, otherClient]) => ({
        key: otherId,
        name: otherClient.name,
      }));

    const message: ClientUpdateMessage = {
      type: "availableClient",
      data: {
        time: new Date().toLocaleTimeString(),
        clients: clientsList,
      },
    };

    client.ws.send(JSON.stringify(message));
  });
};

interface Message {
  type: "offer" | "answer" | "iceCandidate" | "availableClient" | "connected";
}

interface ClientUpdateMessage extends Message {
  type: "availableClient";
  data: {
    time: string;
    clients: {
      key: string;
      name: string;
    }[];
  };
}

interface OfferMessage extends Message {
  type: "offer";
  data: {
    offer: RTCSessionDescriptionInit;
    from: string;
    to: string;
  };
}

interface ConnectedMessage extends Message {
  type: "connected";
  data: {
    id: string;
    name: string;
  };
}
