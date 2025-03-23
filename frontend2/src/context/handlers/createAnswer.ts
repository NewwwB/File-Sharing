export const createAnswer = async (
  offer: RTCSessionDescriptionInit,
  peerConnection: RTCPeerConnection
): Promise<RTCSessionDescriptionInit | undefined> => {
  try {
    await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));

    // Create an answer
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);

    return answer;
  } catch (error) {
    console.error("Error handling WebRTC offer:", error);
    return undefined;
  }
};
