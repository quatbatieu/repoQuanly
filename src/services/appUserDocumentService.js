import Request from "./request"
export default class AppUserDocumentService {
  static async addDocument(data = {}) {
    return new Promise(resolve => {
      Request.send({
        method: 'POST',
        path: '/AppUserDocument/advanceUser/addDocument',
        data
      }).then((result = {}) => {
        const { statusCode, data } = result
        if (statusCode === 200) {
          return resolve({ issSuccess: true })
        } else {
          return resolve({ issSuccess: false , statusCode })
        }
      })
    })
  }

  static async deleteDocument(data = {}) {
    return new Promise(resolve => {
      Request.send({
        method: 'POST',
        path: '/AppUserDocument/advanceUser/deleteDocument',
        data
      }).then((result = {}) => {
        const { statusCode, data } = result
        if (statusCode === 200) {
          return resolve({ issSuccess: true })
        } else {
          return resolve({ issSuccess: false })
        }
      })
    })
  }
}