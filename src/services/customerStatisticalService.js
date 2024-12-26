import Request from './request'

export default class customerStatisticalService {
  static async report(data = {}) {
    return new Promise(resolve => {
      Request.send({
        method: 'POST',
        path: '/CustomerStatistical/advanceUser/report',
        data
      }).then((result = {}) => {
        const { statusCode } = result
        if (statusCode === 200) {
          return resolve(result.data)
        } else {
          return resolve({ isSuccess: false })
        }
      })
    })
  }
}