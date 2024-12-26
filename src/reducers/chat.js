import { CHANGE_CHAT } from "constants/chat"

const initialState = {
  notification : false
}

export default function chatReducer(state = initialState, action) {
  switch (action.type) {
    case CHANGE_CHAT:
      state.notification = action.payload;
      return {
        ...state
      }
    default:
      return state
  }
}
