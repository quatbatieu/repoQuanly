import Request from './request'

export default class MessageCustomerMarketingService {
  static async getList(data = {}) {
    return new Promise(resolve => {
      Request.send({
        method: 'POST',
        path: '/MessageCustomerMarketing/advanceUser/getList',
        data
      }).then((result = {}) => {
        const { statusCode, data } = result
        if (statusCode === 200) {
          return resolve(data)
        } else {
          return resolve([])
        }
      })
    })
  }

  static async findTemplates(data = {}) {
    return new Promise(resolve => {
      Request.send({
        method: 'POST',
        path: '/MessageCustomerMarketing/advanceUser/findTemplates',
        data
      }).then((result = {}) => {
        const { statusCode, data } = result
        if (statusCode === 200) {
          return resolve(data)
        } else {
          return resolve([])
        }
      })
    })
  }

  static async sendSMSMessageToCustomerList(data = {}) {
    return new Promise(resolve => {
      Request.send({
        method: 'POST',
        path: '/MessageCustomerMarketing/advanceUser/sendSMSMessageToCustomerList',
        data
      }).then((result = {}) => {
        const { statusCode } = result
        if (statusCode === 200) {
          return resolve({ isSuccess: true })
        } else {
          return resolve({ isSuccess: false, ...result })
        }
      })
    })
  }

  static async sendSMSMessageToCustomerListExportImport(data = {}, cancelEvent) {
    return new Promise(resolve => {
      Request.sendImportExport({
        method: 'POST',
        path: '/MessageCustomerMarketing/advanceUser/sendSMSMessageToCustomerList',
        data,
        cancelEvent
      }).then((result = {}) => {
        const { statusCode } = result
        if (statusCode === 200) {
          return resolve({ isSuccess: true })
        } else {
          return resolve({ isSuccess: false, ...result })
        }
      })
    })
  }

  static async sendZNSMessageToCustomerListExportImport(data = {}, cancelEvent) {
    return new Promise(resolve => {
      Request.sendImportExport({
        method: 'POST',
        path: '/MessageCustomerMarketing/advanceUser/sendZNSMessageToCustomerList',
        data,
        cancelEvent
      }).then((result = {}) => {
        const { statusCode } = result
        if (statusCode === 200) {
          return resolve({ isSuccess: true })
        } else {
          return resolve({ isSuccess: false, ...result })
        }
      })
    })
  }

  static async sendTestSMS(data = {}) {
    return new Promise(resolve => {
      Request.send({
        method: 'POST',
        path: '/MessageCustomerMarketing/advanceUser/sendTestSMS',
        data
      }).then((result = {}) => {
        const { statusCode } = result
        if (statusCode === 200) {
          return resolve({ isSuccess: true, statusCode, ...result })
        } else {
          return resolve({ isSuccess: false, statusCode, ...result })
        }
      })
    })
  }

  static async sendTestZNS(data = {}) {
    return new Promise(resolve => {
      Request.send({
        method: 'POST',
        path: '/MessageCustomerMarketing/advanceUser/sendTestZNS',
        data
      }).then((result = {}) => {
        const { statusCode } = result
        if (statusCode === 200) {
          return resolve({ isSuccess: true, statusCode, ...result })
        } else {
          return resolve({ isSuccess: false, statusCode, ...result })
        }
      })
    })
  }

  static async getMessageMarketingConfig(data = {}) {
    return new Promise(resolve => {
      Request.send({
        method: 'POST',
        path: '/MessageCustomerMarketing/advanceUser/getMessageMarketingConfig',
        data
      }).then((result = {}) => {
        const { statusCode } = result
        if (statusCode === 200) {
          return resolve({ isSuccess: true, statusCode, ...result })
        } else {
          return resolve({ isSuccess: false, statusCode, ...result })
        }
      })
    })
  }

}
