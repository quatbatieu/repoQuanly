
import { USER_LOGIN, USER_DETAILS_UPDATE, USER_RESET } from '../constants/member'
import addKeyLocalStorage from 'helper/localStorage'
let initialState = {
  isUserLoggedIn: !!window.localStorage.getItem(addKeyLocalStorage('isUserLoggedIn')),
  isSynchronization : !!window.localStorage.getItem(addKeyLocalStorage('isSynchronization'))
}
const data = window.localStorage.getItem(addKeyLocalStorage('data'))
if (data && data.length) {
  const newData = JSON.parse(data)
  initialState = {
    ...initialState,
    ...newData
  }
}
export default function userReducer(state = initialState, action) {

  switch (action.type) {
    case USER_LOGIN: {
      if (action.data) {
        window.localStorage.setItem(addKeyLocalStorage('isUserLoggedIn'), true)
        window.localStorage.setItem(addKeyLocalStorage('data'), JSON.stringify(action.data))
        return {
          ...state,
          ...action.data,
          isUserLoggedIn: true
        }
      }
      return {}
    }
    case USER_DETAILS_UPDATE: {
      if (action.data) {
        const data = {
          ...action.data,
        }

        if (action.data.token) {
          window.localStorage.setItem(addKeyLocalStorage('token'), action.data.token)
          data.token = action.data.token
        }

        window.localStorage.setItem(addKeyLocalStorage('data'), JSON.stringify(action.data))
        return {
          ...state,
          ...data,
          isUserLoggedIn: true
        }
      }
      return {}
    }
    case USER_RESET: {
      window.localStorage.removeItem(addKeyLocalStorage('isSynchronization'))
      window.localStorage.removeItem(addKeyLocalStorage('data'));
      window.localStorage.removeItem(addKeyLocalStorage('isUserLoggedIn'));
      action.callback();
      return {}
    }
    default:
      return state
  }
}

