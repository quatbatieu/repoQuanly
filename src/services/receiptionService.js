import Request from './request'

export default class ReceiptionService {
  static async getListReceiption(data = {}) {
    return new Promise(resolve => {
      Request.send({
        method: 'POST',
        path: '/CustomerReceipt/advanceUser/userGetList',
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

  static async createReceipt(data) {
    return new Promise(resolve => {
      Request.send({
        method: 'POST',
        path: '/CustomerReceipt/advanceUser/userCreate',
        data: data
      }).then((result = {}) => {
        const { statusCode, data } = result
        if (statusCode === 200) {
          return resolve(result)
        } else {
          return resolve(result)
        }
      })
    })
  }

  static async makeVNPayURL(data) {
    return new Promise(resolve => {
      Request.send({
        method: 'POST',
        path: '/PaymentGateway/vnpay/advanceUser/makePaymentRequestVNPAY',
        data: data
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

  static async createVNPayQRCodeByTnx(id) {
    return new Promise(resolve => {
      Request.send({
        method: 'POST',
        path: '/PaymentQR/user/createQRByTnx',
        data: {
          customerReceiptId: id
        }
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

  static async getDetailById(id) {
    return new Promise(resolve => {
      Request.send({
        method: 'POST',
        path: '/CustomerReceipt/user/getDetail',
        data: {
          id: id
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

  static async getDetailByRef(ref) {
    return new Promise(resolve => {
      Request.send({
        method: 'POST',
        path: '/CustomerReceipt/advanceUser/getDetailByRef',
        data: {
          customerReceiptRef: ref
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

  static async payById(id) {
    return new Promise(resolve => {
      Request.send({
        method: 'POST',
        path: '/CustomerReceipt/advanceUser/payById',
        data: {
          id
        }
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

  static async cancelById(id) {
    return new Promise(resolve => {
      Request.send({
        method: 'POST',
        path: '/CustomerReceipt/advanceUser/cancelById',
        data: {
          id
        }
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
  
  static async updateReceiptById({ id, data }) {
    return new Promise(resolve => {
      Request.send({
        method: 'POST',
        path: '/CustomerReceipt/advanceUser/updateById',
        data: {
          id: id,
          data: data
        }
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
