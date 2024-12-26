import Request from './request'

export default class StatisticalService {
  static async getStatistical(data = {}) {
    return new Promise(resolve => {
        Request.send({
            method: 'POST',
            path: '/StationReport/advanceUser/getStationReport',
            data
        }).then((result = {})=>{
            const { statusCode, data } = result
            if(statusCode === 200) {
                return resolve(data)
            } else {
                return resolve(null)
            }
        })
    })
}
  static async getTodayReport(data = {}) {
    return new Promise(resolve => {
      Request.send({
        method: 'POST',
        path: '/StationReport/advanceUser/getTodayReport',
        data
      }).then((result = {}) => {
        const { statusCode, data } = result
        if (statusCode === 200) {
          return resolve(data)
        } else {
          return resolve(null)
        }
      })
    })
  }
  static async submitTodayReport(data = {}) {
    return new Promise(resolve => {
      Request.send({
        method: 'POST',
        path: '/StationReport/advanceUser/submitTodayReport',
        data
      }).then((result = {}) => {
        const { statusCode, data } = result
        if (statusCode === 200) {
          return resolve({ isSuccess: true })
        } else {
          return resolve({ isSuccess: false })
        }
      })
    })
  }
}