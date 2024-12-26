import Request from './request'

export default class stationServicesServices {
  static async getList(dataFilter) {
    return new Promise(resolve => {
      Request.send({
        method: 'POST',
        path: '/StationServices/advanceUser/list',
        data: {
          ...dataFilter,
        }
      }).then((result = {}) => {
        const { statusCode, data } = result
        if (statusCode === 200) {
          return resolve(data.data)
        } else {
          return resolve(null)
        }
      })
    })
  }

  static async insert(data = {}) {
    return new Promise(resolve => {
      Request.send({
        method: 'POST',
        path: '/StationServices/advanceUser/insert',
        data
      }).then((result = {}) => {
        const { statusCode , data} = result
        if (statusCode === 200) {
          return resolve({ issSuccess: true })
        } else {
          return resolve({ issSuccess: false })
        }
      })
    })
  }

  static async delete(data = {}) {
    return new Promise(resolve => {
      Request.send({
        method: 'POST',
        path: '/StationServices/advanceUser/delete',
        data
      }).then((result = {}) => {
        const { statusCode , data} = result
        if (statusCode === 200) {
          return resolve({ issSuccess: true })
        } else {
          return resolve({ issSuccess: false })
        }
      })
    })
  }

}