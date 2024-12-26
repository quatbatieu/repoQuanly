import Request from './request'

const APP_USER_ERROR = {
  DUPLICATE_USER_NAME: "DUPLICATE_USER_NAME",
  DUPLICATE_EMAIL: "DUPLICATE_EMAIL",
  DUPLICATE_PHONENUMBER: "DUPLICATE_PHONENUMBER",
  DUPLICATE_EMPLOYEE_CODE : "DUPLICATE_EMPLOYEE_CODE" ,
  DUPLICATE_USER_IDENTITY : "DUPLICATE_USER_IDENTITY"
}

export default class ManagementService {
  static async getListUser(data) {
    return new Promise(resolve => {
      Request.send({
        method: 'POST',
        path: '/AppUsers/advanceUser/stationUserList',
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

  static async updateUser(data) {
    return new Promise(resolve => {
      Request.send({
        method: 'POST',
        path: '/AppUsers/advanceUser/updateStationUserById',
        data
      }).then((result = {}) => {
        let { statusCode , error } = result
        if (statusCode === 200) {
          return resolve({ isSuccess: true })
        } else {
          if (Object.values(APP_USER_ERROR).indexOf(error) === -1) {
            error = undefined;
          }
          return resolve({ isSuccess: false, error: error })
        }
      })
    })
  }
  static async changeStationById(data) {
    return new Promise(resolve => {
      Request.send({
        method: 'POST',
        path: '/AppUsers/advanceUser/changeStationById',
        data
      }).then((result = {}) => {
        let { statusCode , error } = result
        if (statusCode === 200) {
          return resolve({ isSuccess: true })
        } else {
          if (Object.values(APP_USER_ERROR).indexOf(error) === -1) {
            error = undefined;
          }
          return resolve({ isSuccess: false, error: error })
        }
      })
    })
  }

  static async registerUser(data) {
    return new Promise(resolve => {
      Request.send({
        method: 'POST',
        path: '/AppUsers/advanceUser/registerStationUser',
        data
      }).then((result = {}) => {
        let { statusCode, error , data } = result
        if (statusCode === 200) {
          return resolve({ isSuccess: true , id : data })
        } else {
          if (Object.values(APP_USER_ERROR).indexOf(error) === -1) {
            error = undefined;
          }
          return resolve({ isSuccess: false, error: error })
        }
      })
    })
  }

  static async getListRole(data) {
    return new Promise(resolve => {
      Request.send({
        method: 'POST',
        path: '/AppUserRole/advanceUser/find',
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

  static async stationUserDetail(data) {
    return new Promise(resolve => {
      Request.send({
        method: 'POST',
        path: '/AppUsers/advanceUser/stationUserDetail',
        data
      }).then((result = {}) => {
        const { statusCode, data } = result
        if (statusCode === 200) {
          return resolve(data)
        } else {
          return resolve({ isSuccess: false })
        }
      })
    })
  }
  static async getLists(data) {
    return new Promise(resolve => {
      Request.send({
        method: 'POST',
        path: '/AppUsers/advanceUser/stationUserList',
        data
      }).then((result = {}) => {
        const { statusCode, data } = result
        if (statusCode === 200) {
          return resolve(data)
        } else {
          return resolve({ isSuccess: false })
        }
      })
    })
  }
  static async UpdatePermission(data) {
    return new Promise(resolve => {
      Request.send({
        method: 'POST',
        path: '/AppUsers/advanceUser/updateUserPermission',
        data
      }).then((result = {}) => {
        const { statusCode, data } = result
        if (statusCode === 200) {
          return resolve(data)
        } else {
          return resolve({ isSuccess: false })
        }
      })
    })
  }
}