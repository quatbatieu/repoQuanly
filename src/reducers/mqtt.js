import { SET_CLIENT, ADD_MESSAGE } from "constants/mqtt";

// reducers.js
const initialState = {
  client: null,
  message: {},
};
export default function mqttReducer(state = initialState, action) {
  switch (action.type) {
    case SET_CLIENT:
      return {
        ...state,
        client: action.payload,
      };
    case ADD_MESSAGE:
      return {
        ...state,
        message: action.payload,
      };
    default:
      return state;
  }
}
