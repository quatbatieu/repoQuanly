import { combineReducers } from 'redux'
import app from './app'
import member from './member'
import setting from './setting'
import introduction from './stationIntroduction'
import chat from './chat';
import mqtt from './mqtt';
import common from './common';

const rootReducer = combineReducers({
  member,
  app,
  chat,
  setting,
  introduction,
  mqtt,
  common
})

export default rootReducer