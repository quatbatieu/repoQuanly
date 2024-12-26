import Request from './request'

export default class ThoughtCalendarService {
  static async getList(dataFilter) {
    return new Promise(resolve => {
      Request.send({
        method: 'POST',
        path: '/StationWorkSchedule/advanceUser/getListDayOff',
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

  static async addDayOffSchedule(data = {}) {
    return new Promise(resolve => {
      Request.send({
        method: 'POST',
        path: '/StationWorkSchedule/advanceUser/addDayOff',
        data
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