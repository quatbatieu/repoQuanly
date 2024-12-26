import Request from './request'

export default class ConversationService {
  static async getListConversation(data) {
    return new Promise((resolve) => {
      Request.send({
        method: 'POST',
        path: '/AppUserConversation/advanceUser/getListConversation',
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
  static async getUser(data) {
    return new Promise((resolve) => {
      Request.send({
        method: 'POST',
        path: '/AppUserConversation/advanceUser/getDetailConversation',
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
  static async read(data) {
    return new Promise((resolve) => {
      Request.send({
        method: 'POST',
        path: '/AppUserConversation/advanceUser/readConversation',
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
