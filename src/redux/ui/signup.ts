import { Middleware, Reducer } from "redux";
import { actionCreators, ApplicationState, selectors } from "..";
import { KnownAction as ApiAction } from "../api";

interface SignupInfo {
  email: string;
  password: string;
}

interface ConfirmSignupInfo {
  username: string;
  password: string;
  code: string;
}

export interface SignupState {
  waitingUserConfirmation: boolean;
  executing: boolean;
}

export const signupSelectors = {
  getSignupState: (state: ApplicationState) =>
    selectors.getUiState(state).signup,
};

interface SignupInitAction {
  type: "SIGNUP_INIT";
}

interface SignupExecuteAction {
  type: "SIGNUP_EXECUTE";
  payload: SignupInfo;
}

interface SignupConfirmExecuteAction {
  type: "SIGNUP_CONFIRM_EXECUTE";
  payload: ConfirmSignupInfo;
}

interface SignupSetWaitingUserConfirmation {
  type: "SIGNUP_SET_WAITING_USER_CONFIRMATION";
}

type KnownAction =
  | SignupInitAction
  | SignupExecuteAction
  | SignupConfirmExecuteAction
  | SignupSetWaitingUserConfirmation
  | ApiAction;

export const signupActionCreators = {
  initSignup: (): SignupInitAction => ({
    type: "SIGNUP_INIT",
  }),
  executeSignup: (info: SignupInfo): SignupExecuteAction => ({
    type: "SIGNUP_EXECUTE",
    payload: info,
  }),
  executeSignupConfirm: (
    info: ConfirmSignupInfo
  ): SignupConfirmExecuteAction => ({
    type: "SIGNUP_CONFIRM_EXECUTE",
    payload: info,
  }),
  setSignupWaitingUserConfirmation: (): SignupSetWaitingUserConfirmation => ({
    type: "SIGNUP_SET_WAITING_USER_CONFIRMATION",
  }),
};

export const signupMiddleware: Middleware = ({ dispatch, getState }) => (
  next
) => (incomingAction) => {
  next(incomingAction);
  const action = incomingAction as KnownAction;
  if (action.type === "SIGNUP_EXECUTE") {
    dispatch(actionCreators.api(action.type, "REGISTER", action.payload));
  }
  if (
    action.type === "API_SUCCEEDED" &&
    action.meta.returnAddress === "SIGNUP_EXECUTE"
  ) {
    if (action.payload.userConfirmed) {
      dispatch(actionCreators.initAuth());
    } else {
      dispatch(actionCreators.setSignupWaitingUserConfirmation());
    }
  }
  if (
    action.type === "API_FAILED" &&
    action.meta.returnAddress === "SIGNUP_EXECUTE"
  ) {
    if (action.payload.code === "UsernameExistsException") {
      console.error("既に登録済みのユーザーです。");
    } else {
      console.error("登録に失敗しました。");
    }
  }
  if (action.type === "SIGNUP_CONFIRM_EXECUTE") {
    dispatch(
      actionCreators.api(action.type, "CONFIRM_CODE", {
        username: action.payload.username,
        password: action.payload.password,
        code: action.payload.code,
      })
    );
  }
  if (
    action.type === "API_SUCCEEDED" &&
    action.meta.returnAddress === "SIGNUP_CONFIRM_EXECUTE"
  ) {
    dispatch(
      actionCreators.login({
        username: action.meta.username,
        password: action.meta.password,
      })
    );
  }
};

export const signupReducer: Reducer<SignupState> = (state, incomingAction) => {
  if (!state) {
    state = {
      waitingUserConfirmation: false,
      executing: false,
    };
  }

  const action = incomingAction as KnownAction;
  switch (action.type) {
    case "SIGNUP_INIT":
      return {
        waitingUserConfirmation: false,
        executing: false,
      };
    case "SIGNUP_EXECUTE":
      return {
        ...state,
        executing: true,
      };
    case "SIGNUP_SET_WAITING_USER_CONFIRMATION":
      return {
        ...state,
        waitingUserConfirmation: true,
      };
  }
  return state;
};
