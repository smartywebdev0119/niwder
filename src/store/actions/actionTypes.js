import createRoutine from "redux-routines";

export const signInAction = createRoutine("USER_LOGIN");
export const queueTransferAction = createRoutine("QUEUE_TRANSFER");
export const authorizingAction = createRoutine("GOOGLE_AUTHORIZE");
