import Request from './request'

export default class LoginService {
  static async AddBooking(data) {
    return new Promise((resolve) => {
      Request.send({
        method: 'POST',
        path: '/CustomerSchedule/advanceUser/insertSchedule',
        data: data,
      }).then((result = {}) => {
        const { statusCode } = result
        if (statusCode === 200) {
          return resolve({ issSuccess: true  , ...result})
        } else {
          return resolve({ issSuccess: false , ...result })
        }
      })
    })
  }
}