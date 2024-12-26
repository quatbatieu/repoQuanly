import Request from "./request"
export default class stationPaymentConfigsService {
  static async detail(data = {}) {
    return new Promise(resolve=>{
      Request.send({
        method: 'POST',
        path: '/StationPaymentConfigs/advanceUser/detail',
        data
      }).then((result = {})=>{
        const { statusCode, data } = result
        if(statusCode === 200) {
          return resolve(data)
        }else{
          return resolve(null)
        }
      })
    })
  }

  static async updateMomoPersonalConfigs(data = {}) {
    return new Promise(resolve=>{
      Request.send({
        method: 'POST',
        path: '/StationPaymentConfigs/advanceUser/updateMomoPersonalConfigs',
        data
      }).then((result = {})=>{
        const { statusCode, data } = result
        if(statusCode === 200) {
          return resolve({ issSuccess: true })
        }else{
          return resolve({ issSuccess: false })
        }
      })
    })
  }

  static async updateMomoBusinessConfigs(data = {}) {
    return new Promise(resolve=>{
      Request.send({
        method: 'POST',
        path: '/StationPaymentConfigs/advanceUser/updateMomoBusinessConfigs',
        data
      }).then((result = {})=>{
        const { statusCode, data } = result
        if(statusCode === 200) {
          return resolve({ issSuccess: true })
        }else{
          return resolve({ issSuccess: false })
        }
      })
    })
  }

  static async updateBankConfigs(data = {}) {
    return new Promise(resolve=>{
      Request.send({
        method: 'POST',
        path: '/StationPaymentConfigs/advanceUser/updateBankConfigs',
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
}