import Request from './request'

export default class ChatService {
  static async getListChatLog(data) {
    return new Promise((resolve) => {
      Request.send({
        method: 'POST',
        path: '/AppUserChatLog/advanceUser/getList',
        data: data,
      }).then((result = {}) => {
        const { statusCode } = result
        if (statusCode === 200) {
          return resolve(result.data)
        } else {
          return resolve({ issSuccess: false })
        }
      })
    })
  }
  static async sendToUser(data) {
    return new Promise((resolve) => {
      Request.send({
        method: 'POST',
        path: '/AppUserChatLog/advanceUser/sendNewMessageToUser',
        data: data,
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
