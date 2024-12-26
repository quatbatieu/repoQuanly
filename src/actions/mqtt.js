import { ADD_MESSAGE, SET_CLIENT } from "constants/mqtt";
// actions.js
export const setClient = (client) => ({
  type: SET_CLIENT,
  payload: client,
});

export const addMessage = (message) => ({
  type: ADD_MESSAGE,
  payload: message,
});