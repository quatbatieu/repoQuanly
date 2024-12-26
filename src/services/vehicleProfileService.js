import Request from './request'

export default class vehicleProfileService {
  static async find(dataFilter) {
    return new Promise(resolve => {
      Request.send({
        method: 'POST',
        path: '/VehicleProfile/advanceUser/find',
        data: {
          ...dataFilter,
        }
      }).then((result = {}) => {
        const { statusCode, data } = result
        if (statusCode === 200) {
          return resolve(data)
        } else {
          return resolve(null)
        }
      })
    })
  }

  static async search(dataFilter) {
    return new Promise(resolve => {
      Request.send({
        method: 'POST',
        path: '/VehicleProfile/advanceUser/search',
        data: {
          ...dataFilter,
        }
      }).then((result = {}) => {
        const { statusCode, data } = result
        if (statusCode === 200) {
          return resolve(data)
        } else {
          return resolve(null)
        }
      })
    })
  }

  static async findById(data = {}) {
    return new Promise(resolve => {
      Request.send({
        method: 'POST',
        path: '/VehicleProfile/advanceUser/findById',
        data
      }).then((result = {}) => {
        const { statusCode , data} = result
        if (statusCode === 200) {
          return resolve(data)
        } else {
          return resolve(null)
        }
      })
    })
  }

  static async deleteById(data = {}) {
    return new Promise(resolve => {
      Request.send({
        method: 'POST',
        path: '/VehicleProfile/advanceUser/deleteById',
        data
      }).then((result = {}) => {
        const { statusCode } = result
        if (statusCode === 200) {
          return resolve({ isSuccess: true })
        } else {
          return resolve({ isSuccess: false })
        }
      })
    })
  }

  static async insert(data = {}) {
    return new Promise(resolve => {
      Request.send({
        method: 'POST',
        path: '/VehicleProfile/advanceUser/insert',
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

  static async updateById(data = {}) {
    return new Promise(resolve => {
      Request.send({
        method: 'POST',
        path: '/VehicleProfile/advanceUser/updateById',
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
}