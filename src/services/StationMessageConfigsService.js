import Request from './request'

export default class StationMessageConfigsService {
  static async getStationMessageConfigs(data) {
    return new Promise((resolve) => {
      Request.send({
        method: 'POST',
        path: '/StationMessageConfigs/advanceUser/getStationMessageConfigs',
        data: data,
      }).then((result = {}) => {
        const { statusCode } = result
        if (statusCode === 200) {
          return resolve({ ...result.data, isSuccess: true })
        } else {
          return resolve({ isSuccess: false })
        }
      })
    })
  }
  static async updateStationMessageConfigs(data) {
    return new Promise((resolve) => {
      Request.send({
        method: 'POST',
        path: '/StationMessageConfigs/advanceUser/updateStationMessageConfigs',
        data: data,
      }).then((result = {}) => {
        const { statusCode } = result
        if (statusCode === 200) {
          return resolve({ isSuccess: true })
        } else {
          return resolve({ isSuccess: false })
        }
      })
    })
  }
}
