import { FETCH_APP_CHANGE } from '../constants/app'

const initialState = {

}

export default function appReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_APP_CHANGE:
      const data = action.payload
      return {
        ...state,
        ...data
      }
    default:
      return state
  }
}
