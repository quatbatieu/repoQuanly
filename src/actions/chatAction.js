import { CHANGE_CHAT } from "constants/chat"

export const handleChangeChat = (data) => ({
  type: CHANGE_CHAT,
  payload: data
})