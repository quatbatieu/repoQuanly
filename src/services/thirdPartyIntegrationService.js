import Request from "./request";

export default class ThirdPartyIntegration {
    static async getThirdPartyById(data) {
        return new Promise((resolve,reject) => {
            Request.send({
                method: 'POST',
                path: '/ThirdPartyIntegration/advanceUser/getIntegrationDetail',
                data: { ...data },
                query: null,
            }).then((result = {}) => {
                const { statusCode, data } = result
                if (statusCode === 200) {
                    return resolve(data)
                } else {
                    reject(null)
                }
            }).catch(err =>{
                reject(null)
            })
        })
    }
    static async getConfigsTelegram(data) {
        return new Promise((resolve,reject) => {
            Request.send({
                method: 'POST',
                path: '/ThirdPartyIntegration/advanceUser/getStationIntegration',
                data: { ...data },
                query: null,
            }).then((result = {}) => {
                const { statusCode, data } = result
                if (statusCode === 200) {
                    return resolve(data)
                } else {
                    reject(null)
                }
            }).catch(err =>{
                reject(null)
            })
        })
    }

    static async updateConfigsTelegram(data) {
        return new Promise((resolve,reject) => {
            Request.send({
                method: 'POST',
                path: '/ThirdPartyIntegration/advanceUser/updateConfigsTelegram',
                data: { ...data },
                query: null,
            }).then((result = {}) => {
                const { statusCode, data } = result
                if (statusCode === 200) {
                    return resolve(result)
                } else {
                    reject(null)
                }
            }).catch(err =>{
                reject(null)
            })
        })
    }
    static async updateConfigsTelegram(data) {
        return new Promise((resolve,reject) => {
            Request.send({
                method: 'POST',
                path: '/ThirdPartyIntegration/advanceUser/updateConfigsTelegram',
                data: { ...data },
                query: null,
            }).then((result = {}) => {
                const { statusCode, data } = result
                if (statusCode === 200) {
                    return resolve(result)
                } else {
                    reject(null)
                }
            }).catch(err =>{
                reject(null)
            })
        })
    }
    static async updateConfigsVMG(data) {
        return new Promise((resolve,reject) => {
            Request.send({
                method: 'POST',
                path: '/ThirdPartyIntegration/advanceUser/updateConfigsVMG',
                data: { ...data },
                query: null,
            }).then((result = {}) => {
                const { statusCode, data } = result
                if (statusCode === 200) {
                    return resolve(result)
                } else {
                    reject(null)
                }
            }).catch(err =>{
                reject(null)
            })
        })
    }
    static async updateConfigsSmartGit(data) {
        return new Promise((resolve,reject) => {
            Request.send({
                method: 'POST',
                path: '/ThirdPartyIntegration/advanceUser/updateConfigsSmartGit',
                data: { ...data },
                query: null,
            }).then((result = {}) => {
                const { statusCode, data } = result
                if (statusCode === 200) {
                    return resolve(result)
                } else {
                    reject(null)
                }
            }).catch(err =>{
                reject(null)
            })
        })
    }
    static async updateConfigsVietQR(data) {
        return new Promise((resolve,reject) => {
            Request.send({
                method: 'POST',
                path: '/ThirdPartyIntegration/advanceUser/updateConfigsVietQR',
                data: { ...data },
                query: null,
            }).then((result = {}) => {
                const { statusCode, data } = result
                if (statusCode === 200) {
                    return resolve(result)
                } else {
                    reject(null)
                }
            }).catch(err =>{
                reject(null)
            })
        })
    }
    static async testConfigsTelegram(data) {
        return new Promise((resolve,reject) => {
            Request.send({
                method: 'POST',
                path: '/ThirdPartyIntegration/advanceUser/testConfigsTelegram',
                data: { ...data },
                query: null,
            }).then((result = {}) => {
                const { statusCode, data } = result
                if (statusCode === 200) {
                    return resolve(result)
                } else {
                    reject(null)
                }
            }).catch(err =>{
                reject(null)
            })
        })
    }
    static async testConfigsVMG(data) {
        return new Promise((resolve,reject) => {
            Request.send({
                method: 'POST',
                path: '/ThirdPartyIntegration/advanceUser/testConfigsVMG',
                data: { ...data },
                query: null,
            }).then((result = {}) => {
                const { statusCode, data } = result
                if (statusCode === 200) {
                    return resolve(result)
                } else {
                    reject(result)
                }
            }).catch(err =>{
                reject(err)
            })
        })
    }
    static async testConfigsSmartGift(data) {
        return new Promise((resolve,reject) => {
            Request.send({
                method: 'POST',
                path: '/ThirdPartyIntegration/advanceUser/testConfigsSmartGift',
                data: { ...data },
                query: null,
            }).then((result = {}) => {
                const { statusCode, data } = result
                if (statusCode === 200) {
                    return resolve(result)
                } else {
                    reject(result)
                }
            }).catch(err =>{
                reject(err)
            })
        })
    }
    static async testConfigsVietQR(data) {
        return new Promise((resolve,reject) => {
            Request.send({
                method: 'POST',
                path: '/ThirdPartyIntegration/advanceUser/testConfigsVietQR',
                data: { ...data },
                query: null,
            }).then((result = {}) => {
                const { statusCode, data } = result
                if (statusCode === 200) {
                    return resolve(result)
                } else {
                    reject(result)
                }
            }).catch(err =>{
                reject(err)
            })
        })
    }
    static async updateConfigsTingee(data) {
        return new Promise((resolve,reject) => {
            Request.send({
                method: 'POST',
                path: '/ThirdPartyIntegration/advanceUser/updateConfigsTingee',
                data: { ...data },
                query: null,
            }).then((result = {}) => {
                const { statusCode, data } = result
                if (statusCode === 200) {
                    return resolve(result)
                } else {
                    reject(null)
                }
            }).catch(err =>{
                reject(null)
            })
        })
    }
}