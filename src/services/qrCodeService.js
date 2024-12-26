import Request from './request'

export default class QRCodeService {
  static async getList(data) {
    return new Promise(resolve => {
      Request.send({
        method: 'POST',
        path: '/PaymentQR/advanceUser/getList',
        data
      }).then((result = {}) => {
        const { statusCode, data } = result
        if (statusCode === 200) {
          return resolve(data)
        } else {
          return resolve()
        }
      })
    })
  }

  static async create(data) {
    return new Promise(resolve => {
      Request.send({
        method: 'POST',
        path: '/PaymentQR/advanceUser/create',
        data
      }).then((result = {}) => {
        const { statusCode, data } = result
        if (statusCode === 200) {
          return resolve(data)
        } else {
          return resolve()
        }
      })
    })
  }

  static async deleteById(data) {
    return new Promise(resolve => {
      Request.send({
        method: 'POST',
        path: '/PaymentQR/advanceUser/deleteById',
        data
      }).then((result = {}) => {
        const { statusCode, data } = result
        if (statusCode === 200) {
          return resolve(data)
        } else {
          return resolve()
        }
      })
    })
  }

  static async getDetailById(data) {
    return new Promise(resolve => {
      Request.send({
        method: 'POST',
        path: '/PaymentQR/advanceUser/getDetailById',
        data
      }).then((result = {}) => {
        const { statusCode, data } = result
        if (statusCode === 200) {
          return resolve(data)
        } else {
          return resolve()
        }
      })
    })
  }

}