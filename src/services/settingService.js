import Request from './request'

export default class SettingService {
  static async UpdateUser(data = {}) {
    return new Promise(resolve => {
      Request.send({
        method: 'POST',
        path: '/AppUsers/advanceUser/updateUserById',
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
  static async verifyingUserCode(data = {}) {
    return new Promise(resolve => {
      Request.send({
        method: 'POST',
        path: `/AppUsers/verify2FA`,
        data
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
}