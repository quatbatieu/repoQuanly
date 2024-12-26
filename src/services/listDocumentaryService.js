import Request from './request'

export default class ListSocumentaryService {
    static async getData(dataFilter) {
        return new Promise(resolve => {
            Request.send({
                method: 'POST',
                path: '/StationDocument/advanceUser/getListDocument',
                data: {
                    ...dataFilter,
                }
              }).then((result = {})=> {
                const { statusCode, data } = result
                if(statusCode === 200) {
                    return resolve(data)
                }else{
                    return resolve(null)
                }
              })
        })
    }

    static async getDataStation(dataFilter) {
        return new Promise(resolve => {
            Request.send({
                method: 'POST',
                path: '/StationDocument/advanceUser/getListStationDocument',
                data: {
                    ...dataFilter,
                }
              }).then((result = {})=> {
                const { statusCode, data } = result
                if(statusCode === 200) {
                    return resolve(data)
                }else{
                    return resolve(null)
                }
              })
        })
    }

    static async uploadDocument(data) {
        return new Promise(resolve => {
            Request.send({
                method: 'POST',
                path: '/StationDocument/advanceUser/uploadDocument',
                data: data,
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

    static async updateDocument(data) {
        return new Promise(resolve => {
            Request.send({
                method: 'POST',
                path: '/StationDocument/advanceUser/updateDocument',
                data: data,
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

    static async removeDocument(data) {
        return new Promise(resolve => {
            Request.send({
                method: 'POST',
                path: '/StationDocument/advanceUser/removeDocument',
                data: data
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

    static async getDetailDocument(id) {
        return new Promise(resolve => {
            Request.send({
                method: 'POST',
                path: '/StationDocument/advanceUser/getDetailDocument',
                data: {
                    "id" : id
                }
              }).then((result = {})=> {
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