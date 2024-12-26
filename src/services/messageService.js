import Request from './request'

export default class MessageService {
  static async getMessageSMSTemplate(data = {}) {
    return new Promise(resolve => {
      Request.send({
        method: 'POST',
        path: '/MessageCustomerMarketing/advanceUser/findTemplates',
        data
      }).then((result = {})=>{
        const { statusCode, data } = result
        if(statusCode === 200) {
            return resolve(data)
        }else{
            return resolve([])
        }
      })
    })
  }

  static async cancelSMSMessage(data = {}) {
    return new Promise(resolve => {
      Request.send({
        method: 'POST',
        path: '/MessageCustomerMarketing/advanceUser/cancelSMSMessage',
        data
      }).then((result = {})=>{
        const { statusCode, data } = result
        if(statusCode === 200) {
            return resolve({ isSuccess: true })
        }else{
            return resolve({ isSuccess: false })
        }
      })
    })
  }

  static async sendMessageByCustomerList(data = {}) {
    return new Promise(resolve => {
      Request.send({
        method: 'POST',
        path: '/MessageCustomerMarketing/advanceUser/sendSMSMessageToCustomerList',
        data
      }).then((result = {})=>{
        const { statusCode } = result
        if(statusCode === 200) {
            return resolve({ isSuccess: true })
        }else{
            return resolve({ isSuccess: false , ...result })
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
      }).then((result = {})=>{
        const { statusCode } = result
        if(statusCode === 200) {
            return resolve({ isSuccess: true })
        }else{
            return resolve({ isSuccess: false })
        }
      })
    })
  }

  static async sendMessageByCustomerListExport(data = {} , cancelEvent) {
    return new Promise(resolve => {
      Request.sendImportExport({
        method: 'POST',
        path: '/CustomerMessage/advanceUser/sendMessageToCustomerList',
        data , 
        cancelEvent
      }).then((result = {})=>{
        const { statusCode } = result
        if(statusCode === 200) {
            return resolve({ isSuccess: true , statusCode })
        }else{
            return resolve({ isSuccess: false , statusCode })
        }
      })
    })
  }

  static async sendMessageByFilter(data = {}) {
    return new Promise(resolve => {
      Request.send({
        method: 'POST',
        path: '/CustomerMessage/advanceUser/sendMessageByFilter',
        data
      }).then((result = {})=>{
        const { statusCode } = result
        if(statusCode === 200) {
            return resolve({ isSuccess: true })
        }else{
            return resolve({ isSuccess: false })
        }
      })
    })
  }

  static async findMessages(data = {}) {
    return new Promise(resolve => {
      Request.send({
        method: 'POST',
        path: '/MessageCustomerMarketing/advanceUser/getList',
        data: data
      }).then((result = {})=>{
        const { statusCode, data } = result
        if(statusCode === 200) {
            return resolve(data)
        }else{
            return resolve(null)
        }
      })
    })
  }

  static async getMessageById(id) {
    return new Promise(resolve => {
      Request.send({
        method: 'POST',
        path: '/CustomerMessage/advanceUser/getDetail',
        data: { id }
      }).then((result = {})=>{
        const { statusCode, data } = result
        if(statusCode === 200) {
            return resolve(data)
        }else{
            return resolve(null)
        }
      })
    })
  }

  static async updateMessageById(data = {}) {
    return new Promise(resolve => {
      Request.send({
        method: 'POST',
        path: '/CustomerMessage/advanceUser/updateById',
        data
      }).then((result = {})=>{
        const { statusCode } = result
        if(statusCode === 200) {
          return resolve({ isSuccess: true })
      }else{
          return resolve({ isSuccess: false })
      }
      })
    })
  }

  static async sendSms(data = {}) {
    return new Promise(resolve => {
      Request.send({
        method: 'POST',
        path: '/CustomerMessage/advanceUser/sendSMS',
        data
      }).then((result = {})=>{
        const { statusCode } = result
        if(statusCode === 200) {
          return resolve({ isSuccess: true })
      }else{
          return resolve({ isSuccess: false })
      }
      })
    })
  }

  static async getReportList(data = {}) {
    return new Promise(resolve => {
      Request.send({
        method: 'POST',
        path: '/MessageCustomerMarketing/advanceUser/getReportList',
        data
      }).then((result = {})=>{
        const { statusCode } = result
        if(statusCode === 200) {
          return resolve(result)
      }else{
          return resolve(null)
      }
      })
    })
  }
}
