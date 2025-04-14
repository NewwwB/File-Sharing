import { requestApproval } from "../services/ApprovalService";
import { webRTCService } from "../services/WebRTCServices";
import { webSocketService } from "../services/WebSocketService";
import { Action, GlobalState } from "../types/stateContextTypes";
import {
  AnswerMessage,
  Message,
  isAnswerMessage,
  isCandidateMessage,
  isClientUpdateMessage,
  isConnectedMessage,
  isOfferMessage,
} from "../types/webRTCMessages";

interface Handler {
  type: Message["type"];
  func: (msg: Message) => void;
}

export const createWebSocketHandlers = (
  dispatch: React.Dispatch<Action>,
  state: GlobalState
) => {
  const handlers: Handler[] = [
    {
      type: "availableClient",
      func: (msg) => {
        if (isClientUpdateMessage(msg)) {
          dispatch({
            type: "SET_CLIENTS",
            payload: msg.data.clients,
          });
        } else {
          console.warn("Unexpected message type:", msg);
        }
      },
    },
    {
      type: "connected",
      func: (msg) => {
        if (isConnectedMessage(msg)) {
          dispatch({
            type: "SET_USER",
            payload: msg.data,
          });
        } else {
          console.warn("Unexpected message type:", msg);
        }
        console.log(state.user);
      },
    },
    {
      type: "offer",
      func: async (msg) => {
        if (isOfferMessage(msg)) {
          const approval = await requestApproval(msg.data.from, dispatch);
          if (approval) {
            console.log("approved");
            dispatch({ type: "SET_REMOTE_USER", payload: msg.data.from });
            webRTCService.cleanup();
            webRTCService.setupConnection(msg.data.to, msg.data.from, dispatch);
            await webRTCService.registerOffer(msg.data.offer);
            const ans = await webRTCService.createAnswer();
            // console.log("ans: ", ans);
            if (ans) {
              const acceptMsg: AnswerMessage = {
                type: "answer",
                data: {
                  status: true,
                  answer: ans,
                  from: msg.data.to,
                  to: msg.data.from,
                },
              };
              webSocketService.send(acceptMsg);
            } else {
              const rejectMsg: AnswerMessage = {
                type: "answer",
                data: {
                  status: false,
                  answer: undefined,
                  from: msg.data.to,
                  to: msg.data.from,
                },
              };
              webSocketService.send(rejectMsg);
            }
          }
        }
      },
    },
    {
      type: "answer",
      func: async (msg) => {
        if (isAnswerMessage(msg)) {
          if (msg.data.status && msg.data.answer) {
            webRTCService.registerAnswer(msg.data.answer);
          }
        }
      },
    },
    {
      type: "iceCandidate",
      func: async (msg) => {
        if (isCandidateMessage(msg)) {
          await webRTCService.addIceCandidate(msg.data.iceCandidate);
        }
      },
    },
  ];

  return handlers;
};
