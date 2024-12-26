import Request from "./request"
export default class StationIntroduceService {
  static async findStationById(newParams) {
    return new Promise(resolve=>{
      Request.send({
        method: 'POST',
        path: '/StationIntroduction/advanceUser/getDetail',
        data: newParams
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
  static async getLinkCSKH(newParams) {
    return new Promise(resolve=>{
      Request.send({
        method: 'POST',
        path: '/StationSetting/advanceUser/findById',
        data: newParams
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

  static async updateStationById(data = {}) {
    return new Promise(resolve=>{
      Request.send({
        method: 'POST',
        path: '/StationIntroduction/advanceUser/updateStationIntro',
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

  static async updateStationExtraInfoById(data = {}) {
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
}