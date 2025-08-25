import { postFakeProfile } from "../../../helpers/fakebackend_helper";
import { profileFailed, profileSuccess } from "./reducer";
import { getFirebaseBackend } from "../../../helpers/firebase_helper";
import type { RootState } from "../../../slices/index";
import type { ThunkAction } from "redux-thunk";
import type { Action, Dispatch } from "redux";

interface User {
  username: string;
  idx: number;
}

export const editProfile =
  (user: User): ThunkAction<void, RootState, unknown, Action<string>> =>
  async (dispatch: Dispatch) => {
    try {
      let response: any;
      if (import.meta.env.REACT_APP_DEFAULTAUTH === "fake") {
        response = await postFakeProfile(user);
      } else if (import.meta.env.REACT_APP_DEFAULTAUTH === "firebase") {
        const fireBaseBackend = getFirebaseBackend();
        response = await fireBaseBackend.editProfileAPI(
          user.username,
          user.idx
        );
      }

      if (response) {
        dispatch(profileSuccess(response));
      }
    } catch (error) {
      dispatch(profileFailed(error));
    }
  };
