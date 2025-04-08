import { WebSocketWithUserData, ClientUpdateMessage, User } from "./types";

export function updateClientList(clients: Map<string, WebSocketWithUserData>) {
  const clientEntries = Array.from(clients.entries());

  clientEntries.forEach(([id, client]) => {
    if (!client.user) return;

    const clientsList: User[] = clientEntries
      .filter(([otherId]) => otherId !== id)
      .map(([otherId, otherClient]) => ({
        id: otherId,
        name: otherClient.user?.name || "Unknown",
        profilePic: otherClient.user?.profilePic || "",
        online: true,
      }));

    const message: ClientUpdateMessage = {
      type: "availableClient",
      data: { time: new Date().toLocaleTimeString(), clients: clientsList },
    };

    client.send(JSON.stringify(message));
  });
}
