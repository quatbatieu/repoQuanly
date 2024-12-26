
import { INIT, UPDATE } from '../constants/introduction'
import addKeyLocalStorage from 'helper/localStorage'
let initialState = {}
const data = window.localStorage.getItem(addKeyLocalStorage('introduction'))
if(data && data.length){
 const newData = JSON.parse(data)
 initialState={
   ...initialState,
   ...newData
 }
}
 
export default function introductionReducer(state = initialState, action) {
  switch (action.type) {
    case INIT: {
      window.localStorage.setItem(addKeyLocalStorage('introduction'), JSON.stringify({
        ...state,
        ...action.data,
      }))
      return {
        ...state,
        ...action.data,
      }
    }
    case UPDATE: {
      window.localStorage.setItem(addKeyLocalStorage('introduction'), JSON.stringify({
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

