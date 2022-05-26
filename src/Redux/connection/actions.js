import { ActionTypes } from "../types";
import { loadWeb3 } from "../../api";
export const connectionAction = () => {
  return async (dispatch) => {
    let acc = await loadWeb3();
    let myAcc;
    if (acc === "No Wallet") {
      myAcc = "No Wallet";
    } else if (acc == "지갑 없음") {
      myAcc = "지갑 없음";
    } else if (acc === "Wrong Network") {
      myAcc = "Wrong Network";
    } else if (acc === "잘못된 네트워크") {
      myAcc = "잘못된 네트워크";
    } else {
      myAcc = acc;
    }
    await dispatch({ type: ActionTypes.CONNECT, payload: myAcc });
  };
};
