import { Action } from "../types/stateContextTypes";
import { User } from "../types/webRTCMessages";

let approvalResolver: ((approved: boolean) => void) | null = null;

export const requestApproval = (
  from: User,
  dispatch: React.Dispatch<Action>
) => {
  dispatch({ type: "SET_APPROVAL_REQUEST", payload: from });
  return new Promise<boolean>((resolve) => {
    approvalResolver = resolve;
  });
};

export const resolveApproval = (
  approved: boolean,
  dispatch: React.Dispatch<Action>
) => {
  if (approvalResolver) {
    approvalResolver(approved);
    approvalResolver = null;
    dispatch({ type: "SET_APPROVAL_REQUEST", payload: null });
  }
};
