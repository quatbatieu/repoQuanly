import Request from './request'

export default class LoginService {
  static async Signin(data = {}) {
    return new Promise((resolve) => {
      Request.send({
        method: 'POST',
        path: '/AppUsers/loginUser',
        data,
      }).then((result = {}) => {
        const { statusCode, data } = result
        if (statusCode === 200) {
          return resolve(data)
        } else {
          return resolve({})
        }
      })
    })
  }
  static async getDetailByUrl(stationsUrl) {
    return new Promise((resolve) => {
      Request.send({
        method: 'POST',
        path: '/Stations/getDetailByUrl',
        data: {
          stationsUrl: stationsUrl,
        },
      }).then((result = {}) => {
        const { statusCode, data } = result
        if (statusCode === 200) {
          return resolve(data)
        } else {
          return resolve({})
        }
      })
    })
  }

  static async changeUserPassword(data = {}) {
    return new Promise((resolve) => {
      Request.send({
        method: 'POST',
        path: '/AppUsers/advanceUser/changePassword',
        data,
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
  
  static async updateUserInfo(data = {} , token) {
    return new Promise((resolve) => {
      Request.sendConfig({
        method: 'POST',
        path: '/AppUsers/advanceUser/updateUserInfo',
        headers : {
          authorization : `Bearer ${token}`
        },
        data,
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

  static async changePasswordUser(data = {}) {
    return new Promise((resolve) => {
      Request.send({
        method: 'POST',
        path: '/AppUsers/advanceUser/changePasswordUser',
        data,
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

  static async getLandingPageInfoAuth(id) {
    return new Promise((resolve) => {
      Request.send({
        method: 'POST',
        path: '/StationIntroduction/advanceUser/getDetail',
        data: {
          id: id,
        },
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

  static async getLandingPageInfo(stationUrl) {
    return new Promise((resolve) => {
      Request.send({
        method: 'POST',
        path: '/StationIntroduction/advanceUser/stationIntroductionDetail',
        data: {
          stationUrl: stationUrl,
        },
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

  static async getDetailPunish(data = {}) {
    return new Promise((resolve) => {
      Request.send({
        method: 'POST',
        path: '/CustomerCriminalRecord/advanceUser/findCrimeRecords',
        data,
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
  static async resetPasswordByEmail(data = {}) {
    return new Promise((resolve) => {
      Request.send({
        method: 'POST',
        path: '/AppUsers/advanceUser/resetPasswordByEmail',
        data,
      }).then((result = {}) => {
        const { statusCode, data } = result
        if (statusCode === 200) {
          return resolve(data)
        } else {
          return resolve({})
        }
      })
    })
  }
  static async resetPasswordUserByToken({ password, token } = {}) {
    return new Promise((resolve) => {
      Request.send({
        method: 'POST',
        headers : {
          authorization : `Bearer ${token}`
        },
        path: '/AppUsers/advanceUser/resetPasswordUserByToken',
        data : {
          password : password
        },
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
