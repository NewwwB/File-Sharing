export const createOffer = async (
  pc: RTCPeerConnection,
  dataChannel: React.RefObject<RTCDataChannel | null>
): Promise<RTCSessionDescriptionInit | undefined> => {
  if (!pc) return;
  const dc = pc.createDataChannel("fileShare");
  dataChannel.current = dc;
  const offer = await pc.createOffer();
  await pc.setLocalDescription(offer);
  return offer;
};
