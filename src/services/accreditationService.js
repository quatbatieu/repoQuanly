import Request from "./request"
export default class AccreditationService {
  static async getList(data = {}) {
    return new Promise(resolve=>{
      Request.send({
        method: 'POST',
        path: '/CustomerRecord/advanceUser/getList',
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

  static async getReports(data = {}) {
    return new Promise(resolve=>{
      Request.send({
        method: 'POST',
        path: '/StationInspectionReport/advanceUser/getReports',
        data
      }).then((result = {})=>{
        const { statusCode, data } = result
        if(statusCode === 200) {
          return resolve(result)
        }else{
          return resolve(result)
        }
      })
    })
  }

  static async getListByDate(data = {}) {
    return new Promise(resolve=>{
      Request.send({
        method: 'POST',
        path: '/CustomerRecord/advanceUser/todayCustomerRecord',
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

  static async updateById(data = {}) {
    return new Promise(resolve=>{
      Request.send({
        method: 'POST',
        path: '/CustomerRecord/advanceUser/updateById',
        data
      }).then((result = {})=>{
        const { statusCode } = result
        if(statusCode === 200) {
          return resolve({ issSuccess: true })
        }else{
          return resolve({ issSuccess: false })
        }
      })
    })
  }

  static async deleteById(data = {}) {
    return new Promise(resolve=>{
      Request.send({
        method: 'POST',
        path: '/CustomerRecord/advanceUser/deleteById',
        data
      }).then((result = {})=>{
        const { statusCode } = result
        if(statusCode === 200) {
          return resolve({ issSuccess: true })
        }else{
          return resolve({ issSuccess: false })
        }
      })
    })
  }

  static async createNewCustomer(data = {}) {
    return new Promise(resolve=>{
      Request.send({
        method: 'POST',
        path: '/CustomerRecord/advanceUser/insert',
        data
      }).then((result = {})=>{
        const { statusCode } = result
        if(statusCode === 200) {
          return resolve(result)
        }else{
          return resolve(result)
        }
      })
    })
  }

  static async registerFromSchedule(data = {}) {
    return new Promise(resolve => {
        Request.send({
            method: 'POST',
            path: '/CustomerRecord/advanceUser/registerFromSchedule',
            data
        }).then((result = {}) => {
            const { statusCode } = result
            if (statusCode === 200) {
                return resolve({ isSuccess: true })
            } else {
                return resolve({ isSuccess: false , ...result })
            }
        })
    })
}
  static async importDataReport(data = {}) {
    return new Promise((resolve) => {
      Request.send({
        method: 'POST',
        path: '/StationInspectionReport/advanceUser/importExcelReports',
        data,
      }).then((result = {}) => {
        const { statusCode, data } = result
        if (statusCode === 200) {
          return resolve(data)
        } else {
          return resolve({})
        }
      })
    })
  }
}