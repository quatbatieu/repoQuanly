import Request from './request'

export default class StationWorkingHoursService {
  static async find(data = {}) {
    return new Promise(resolve => {
      Request.send({
        method: 'POST',
        path: '/StationWorkingHours/advanceUser/findByStationId',
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
  static async updateById(data = {}) {
    return new Promise(resolve => {
      Request.send({
        method: 'POST',
        path: '/StationWorkingHours/advanceUser/updateById',
        data
      }).then((result = {}) => {
        const { statusCode, data } = result
        if (statusCode === 200) {
          return resolve({ issSuccess: true })
        } else {
          return resolve({ issSuccess: false })
        }
      })
    })
  }
}