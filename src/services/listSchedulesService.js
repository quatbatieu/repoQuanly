import Request from './request'

export default class ListSchedulesService {
    static async getList(dataFilter) {
        return new Promise(resolve => {
            Request.send({
                method: 'POST',
                path: '/CustomerSchedule/advanceUser/list',
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

    static async getMetaData(dataFilter) {
        return new Promise(resolve => {
            Request.send({
                method: 'POST',
                path: '/SystemConfigurations/getMetaData',
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

    static async findId(id) {
        return new Promise(resolve => {
            Request.send({
                method: 'POST',
                path: '/CustomerSchedule/advanceUser/getDetailSchedule',
                data: {
                  customerScheduleId : id
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

    static async searchSchedule(dataFilter) {
        return new Promise(resolve => {
            Request.send({
                method: 'POST',
                path: '/CustomerSchedule/advanceUser/searchSchedule',
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

    
    static async deleteSchedule(data = {}) {
        return new Promise(resolve => {
            Request.send({
                method: 'POST',
                path: '/CustomerSchedule/advanceUser/cancelSchedule',
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

    static async updateSchedule(data = {}) {
        return new Promise(resolve => {
            Request.send({
                method: 'POST',
                path: '/CustomerSchedule/advanceUser/update',
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

    static async exportExcel(dataFilter) {
        return new Promise(resolve => {
            Request.send({
                method: 'POST',
                path: '/CustomerSchedule/advanceUser/exportExcel',
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
}