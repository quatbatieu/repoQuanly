import Request from './request'


export default class PhonebookService {
  static async getListUser(data) {
    return new Promise(resolve => {
      Request.send({
        method: 'POST',
        path: '/AppUsers/advanceUser/searchStationStaff',
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
  static async getUserRoleId(data) {
    return new Promise(resolve => {
      Request.send({
        method: 'POST',
        path: '/AppUserRole/advanceUser/find',
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
