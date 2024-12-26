import Request from './request'

export default class stationsService {
  static async getDate(dataFilter) {
    return new Promise(resolve => {
      Request.send({
        method: 'POST',
        path: '/Stations/advanceUser/getListScheduleDate',
        data: {
          ...dataFilter,
        }
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

  static async getTime(data = {}) {
    return new Promise(resolve => {
      Request.send({
        method: 'POST',
        path: '/Stations/advanceUser/getListScheduleTime',
        data
      }).then((result = {}) => {
        const { statusCode , data} = result
        if (statusCode === 200) {
          return resolve(data)
        } else {
          return resolve(null)
        }
      })
    })
  }
  static async getStationList(data) {
    return new Promise(resolve => {
      Request.send({
        method: 'POST',
        path: '/Stations/user/getList',
        data
      }).then((result = {}) => {
        const { statusCode,data } = result
        if (statusCode === 200) {
          return resolve(data)
        } else {
          return resolve(null)
        }
      })
    })
  }
}