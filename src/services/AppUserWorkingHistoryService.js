import Request from "./request"

export default class AppUserWorkingHistoryService {
  static async getListWorkingHistory(data = {}) {
    return new Promise(resolve=>{
      Request.send({
        method: 'POST',
        path: '/AppUserWorkingHistory/advanceUser/getListWorkingHistory',
        data
      }).then((result = {})=>{
        const { statusCode, data } = result
        if(statusCode === 200) {
          return resolve(data)
        }else{
          return resolve([])
        }
      })
    })
  }
  static async getDetailWorkingHistory(data = {}) {
    return new Promise(resolve=>{
      Request.send({
        method: 'POST',
        path: '/AppUserWorkingHistory/advanceUser/getDetailWorkingHistory',
        data
      }).then((result = {})=>{
        const { statusCode, data } = result
        if(statusCode === 200) {
          return resolve(data)
        }else{
          return resolve([])
        }
      })
    })
  }
  static async createAppUserWorkingHistory(data = {}) {
    return new Promise(resolve=>{
      Request.send({
        method: 'POST',
        path: '/AppUserWorkingHistory/advanceUser/createAppUserWorkingHistory',
        data
      }).then((result = {})=>{
        const { statusCode, data } = result
        if(statusCode === 200) {
          return resolve({ isSuccess: true })
        }else{
          return resolve({ isSuccess: false })
        }
      })
    })
  }
}