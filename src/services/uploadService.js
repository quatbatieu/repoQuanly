import Request from './request'

export default class uploadService {
  static async uploadImage(data = {}) {
    return new Promise((resolve) => {
      Request.send({
        method: 'POST',
        path: '/Upload/advanceUser/uploadMediaFile',
        data,
      }).then((result = {}) => {
        const { statusCode, data } = result
        if (statusCode === 200) {
          return resolve({ issSuccess: true, data })
        } else {
          return resolve({ issSuccess: false, statusCode })
        }
      })
    })
  }

  static async uploadImageBanner(data = {}) {
    return new Promise((resolve) => {
      Request.send({
        method: 'POST',
        path: '/Upload/advanceUser/uploadAdMediaFile',
        data,
      }).then((result = {}) => {
        const { statusCode, data } = result
        if (statusCode === 200) {
          return resolve({ issSuccess: true, data })
        } else {
          return resolve({ issSuccess: false, statusCode })
        }
      })
    })
  }

  static async importDataCustomers(data = {}) {
    return new Promise((resolve) => {
      Request.send({
        method: 'POST',
        path: '/CustomerRecord/advanceUser/importExcel',
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

  static async updateStationIntroduction(data = {}) {
    return new Promise((resolve) => {
      Request.send({
        method: 'POST',
        path: '/StationIntroduction/advanceUser/updateStationIntro',
        data,
      }).then((result = {}) => {
        const { statusCode } = result
        if (statusCode === 200) {
          return resolve({ issSuccess: true })
        } else {
          return resolve({ issSuccess: false })
        }
      })
    })
  }

  static async updateBanner(path, data = {}) {
    return new Promise((resolve) => {
      Request.send({
        method: 'POST',
        path: path,
        data,
      }).then((result = {}) => {
        const { statusCode } = result
        if (statusCode === 200) {
          return resolve({ issSuccess: true })
        } else {
          return resolve({ issSuccess: false })
        }
      })
    })
  }
}
