import Request from "./request"
export default class InspectionProcessService {
  static async getDetailByIdLoginSSO(data = {} , token) {
    return new Promise(resolve=>{
      Request.sendConfig({
        method: 'POST',
        path: '/AppUsers/advanceUser/stationUserInfo',
        headers : {
          authorization : token
        },
        data
      }).then((result = {})=>{
        const { statusCode, data } = result
        if(statusCode === 200) {
          return resolve({ isSuccess: true  , data})
        }else{
          return resolve({ isSuccess: false })
        }
      })
    })
  }
  static async getDetailById(data = {}) {
    return new Promise(resolve=>{
      Request.send({
        method: 'POST',
        path: '/Stations/advanceUser/getDetailById',
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

  static async updateById(data = {}) {
    return new Promise(resolve=>{
      Request.send({
        method: 'POST',
        path: '/Stations/advanceUser/updateById',
        data
      }).then((result = {})=>{
        const { statusCode } = result
        if(statusCode === 200) {
          return resolve({ issSuccess: true })
        }else{
          return resolve({ issSuccess: false })
        }
      })
    })
  }
  static async createBookingConfig(data = {}) {
    return new Promise(resolve=>{
      Request.send({
        method: 'POST',
        path: '/StationBookingConfig/advanceUser/insert',
        data
      }).then((result = {})=>{
        const { statusCode } = result
        if(statusCode === 200) {
          return resolve(result)
        }else{
          return resolve(result)
        }
      })
    })
  }
  static async deleteBookingConfigById(data = {}) {
    return new Promise(resolve=>{
      Request.send({
        method: 'POST',
        path: '/StationBookingConfig/advanceUser/deleteById',
        data
      }).then((result = {})=>{
        const { statusCode } = result
        if(statusCode === 200) {
          return resolve(result)
        }else{
          return resolve(result)
        }
      })
    })
  }
  static async updateBookingConfigById(data = {}) {
    return new Promise(resolve=>{
      Request.send({
        method: 'POST',
        path: '/StationBookingConfig/advanceUser/updateById',
        data
      }).then((result = {})=>{
        const { statusCode } = result
        if(statusCode === 200) {
          return resolve(result)
        }else{
          return resolve(result)
        }
      })
    })
  }

  static async getApikey(data = {}) {
    return new Promise(resolve=>{
      Request.send({
        method: 'POST',
        path: '/SystemApiKey/advanceUser/getList',
        data
      }).then((result = {})=>{
        const { statusCode } = result
        if(statusCode === 200) {
          return resolve(result)
        }else{
          return resolve(result)
        }
      })
    })
  }

  static async getAllStationArea(data = {}) {
    return new Promise(resolve=>{
      Request.send({
        method: 'POST',
        path: '/Stations/advanceUser/getAllStationArea',
        data
      }).then((result = {})=>{
        const { statusCode } = result
        if(statusCode === 200) {
          return resolve(result)
        }else{
          return resolve(result)
        }
      })
    })
  }

  static async getAllExternal(data = {}) {
    return new Promise(resolve=>{
      Request.send({
        method: 'POST',
        path: '/Stations/advanceUser/getAllExternal',
        data
      }).then((result = {})=>{
        const { statusCode } = result
        if(statusCode === 200) {
          return resolve(result)
        }else{
          return resolve(result)
        }
      })
    })
  }
}