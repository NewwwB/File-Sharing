import { OfferMessage, User } from "../../types/webrtcMessages";
import { createOffer } from "./createOffer";

export const helpConnect = async (
  connectTo: User,
  connectFrom: User,
  ws: WebSocket,
  pc: RTCPeerConnection,
  dataChannel: React.RefObject<RTCDataChannel | null>,
  setIncomingConnection: React.Dispatch<
    React.SetStateAction<{
      client: User;
      offer: RTCSessionDescriptionInit;
    } | null>
  >,
  setIsConnecting: React.Dispatch<React.SetStateAction<boolean>>
): Promise<void> => {
  // create offer
  // render connecting by setting state
  // set connectionReq
  // create message
  // send it over ws

  if (!connectTo || !connectFrom || !ws) return; // Ensure there's a user before proceeding

  const offer = await createOffer(pc, dataChannel);

  if (offer) {
    const offerMessage: OfferMessage = {
      type: "offer",
      data: {
        offer,
        from: connectFrom,
        to: connectTo,
      },
    };

    ws.send(JSON.stringify(offerMessage));

    //set state of connection request
    setIncomingConnection({ client: connectTo, offer });
    setIsConnecting(true);
  }
};
