import Request from "./request"
export default class AppUserWorkInfoServer {
  static async updateById(data = {}) {
    return new Promise(resolve => {
      Request.send({
        method: 'POST',
        path: '/AppUserWorkInfo/advanceUser/updateById',
        data
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