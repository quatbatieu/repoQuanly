
import { SETTING } from '../constants/setting'
import addKeyLocalStorage from 'helper/localStorage'
let initialState = {
  enableConfigAllowBookingOverLimit : 0,
  enableConfigAutoConfirm : 1,
  enableConfigBookingOnToday : 0
}
const data = window.localStorage.getItem(addKeyLocalStorage('setting'))
if(data && data.length){
 const newData = JSON.parse(data)
 initialState={
   ...initialState,
   ...newData
 }
}

export default function settingReducer(state = initialState, action) {
  switch (action.type) {
    case SETTING: {
      window.localStorage.setItem(addKeyLocalStorage('setting'), JSON.stringify({
        ...state,
        ...action.data,
      }))
      return {
        ...state,
        ...action.data,
      }
    }
    default:
      return state
  }
}

