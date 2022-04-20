import * as actions from "./actionTypes";
import axios from "axios";
import { API_BASE } from "../../config";

export const queueTransfer = (url, queue) => async (firebase, dispatch) => {
  try {
    dispatch(actions.queueTransferAction.trigger());
    const token = await firebase.auth().currentUser.getIdToken();
    await axios.post(
      `${API_BASE}/api/${queue}`,
      {
        url,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    dispatch(actions.queueTransferAction.success());
  } catch (e) {
    dispatch(actions.queueTransferAction.failure(e.message));
  }
};

export const checkAPIAlive = () => async (firebase) => {
  return new Promise(async (resolve, reject) => {
    try {
      const token = await firebase.auth().currentUser.getIdToken();
      await axios.get(`${API_BASE}/api`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      resolve();
    } catch (e) {
      reject();
    }
  });
};

export const authorizeGoogle = () => async (firebase, dispatch) => {
  try {
    dispatch(actions.authorizingAction.trigger());
    const token = await firebase.auth().currentUser.getIdToken();
    const response = await axios.get(`${API_BASE}/api/oauth`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const win = window.open(response.data.url, "_blank");
    win.focus();
    dispatch(actions.authorizingAction.success());
  } catch (e) {
    dispatch(actions.authorizingAction.failure(e.message));
  }
};

export const revokeGoogle = () => async (firebase, dispatch) => {
  try {
    dispatch(actions.authorizingAction.trigger());
    const token = await firebase.auth().currentUser.getIdToken();
    const response = await axios.delete(`${API_BASE}/api/oauth`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const win = window.open(response.data.url, "_blank");
    win.focus();
    dispatch(actions.authorizingAction.success());
  } catch (e) {
    dispatch(actions.authorizingAction.failure(e.message));
  }
};

export const removeTransferred = (dbPath, key) => async (firebase) => {
  try {
    const uid = await firebase.auth().currentUser.uid;
    await firebase.remove(`transfers/${uid}/${dbPath}/${key}`);
  } catch (e) {
    console.log(e.message);
  }
};

export const clearMessages = () => (dispatch) =>
  dispatch(actions.queueTransferAction.fulfill());

export const clearAuthorizingMessages = () => (dispatch) =>
  dispatch(actions.authorizingAction.fulfill());
