import Request from './request'

export default class StationDevicesService {
  static async insert(data = {}) {
    return new Promise(resolve => {
      Request.send({
        method: 'POST',
        path: '/StationDevices/advanceUser/advanceUserInsertStationDevice',
        data
      }).then(result => {
        return resolve({ isSuccess: result.statusCode === 200 , ...result });
      })
    })
  }

  static async getId(data = {}) {
    return new Promise(resolve => {
      Request.send({
        method: 'POST',
        path: '/StationDevices/advanceUser/advanceUserGetStationDeviceById',
        data
      }).then(result => {
        return resolve(result?.data);
      })
    })
  }

  static async getList(data = {}) {
    return new Promise(resolve => {
      Request.send({
        method: 'POST',
        path: '/StationDevices/advanceUser/advanceUserGetListStationDevices',
        data
      }).then(result => {
        return resolve(result?.data);
      })
    })
  }

  static async update(data = {}) {
    return new Promise(resolve => {
      Request.send({
        method: 'POST',
        path: '/StationDevices/advanceUser/advanceUserUpdateStationDeviceById',
        data
      }).then(result => {
        return resolve({ isSuccess: result.statusCode === 200 , ...result  });
      })
    })
  }

  static async delete(data = {}) {
    return new Promise(resolve => {
      Request.send({
        method: 'POST',
        path: '/StationDevices/advanceUser/advanceUserDeleteStationDeviceById',
        data
      }).then(result => {
        return resolve({ isSuccess: result.statusCode === 200 , ...result });
      })
    })
  }
  static async insertWebhook(data = {}) {
    return new Promise(resolve => {
      Request.send({
        method: 'POST',
        path: '/StationWebHooks/advanceUser/create',
        data
      }).then(result => {
        return resolve({ isSuccess: result.statusCode === 200 , ...result });
      })
    })
  }

  static async getDetailWebhook(data = {}) {
    return new Promise(resolve => {
      Request.send({
        method: 'POST',
        path: '/StationWebHooks/advanceUser/getDetail',
        data
      }).then(result => {
        return resolve(result?.data);
      })
    })
  }

  static async getListWebhook(data = {}) {
    return new Promise(resolve => {
      Request.send({
        method: 'POST',
        path: '/StationWebHooks/advanceUser/getList',
        data
      }).then(result => {
        return resolve(result?.data);
      })
    })
  }

  static async updateWebhook(data = {}) {
    return new Promise(resolve => {
      Request.send({
        method: 'POST',
        path: '/StationWebHooks/advanceUser/updateById',
        data
      }).then(result => {
        return resolve({ isSuccess: result.statusCode === 200 , ...result  });
      })
    })
  }

  static async deleteWebhook(data = {}) {
    return new Promise(resolve => {
      Request.send({
        method: 'POST',
        path: '/StationWebHooks/advanceUser/deleteById',
        data
      }).then(result => {
        return resolve({ isSuccess: result.statusCode === 200 , ...result });
      })
    })
  }
  static async testConnectWebhook(data = {}) {
    return new Promise(resolve => {
      Request.send({
        method: 'POST',
        path: '/StationWebHooks/advanceUser/testConnect',
        data
      }).then(result => {
        return resolve(result);
      })
    })
  }
}
