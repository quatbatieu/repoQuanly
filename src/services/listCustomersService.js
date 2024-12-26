import Request from './request'

export default class ListCustomersService {
    static async getData(dataFilter) {
        return new Promise(resolve => {
            Request.send({
                method: 'POST',
                path: '/CustomerRecord/advanceUser/getList',
                data: {
                    ...dataFilter,
                }
              }).then((result = {})=> {
                const { statusCode, data } = result
                if(statusCode === 200) {
                    for(let i = 0; i <= data.total; i++) {
                        if(data.data[i])
                            data.data[i].key = dataFilter.skip ? data.total - ( dataFilter.skip + i ): data.total  - (i)
                        else
                            break
                    }
                    return resolve(data)
                }else{
                    return resolve(null)
                }
              })
        })
    }

    static async updateCustomerInfo({
        id,
        customerRecordFullName,
        customerRecordPhone,
        customerRecordPlatenumber,
        customerRecordEmail,
        customerRecordCheckDuration,
        customerRecordCheckDate,
        customerRecordCheckExpiredDate
    }) {
        return new Promise(resolve => {
            Request.send({
                method: 'POST',
                path: '/CustomerRecord/advanceUser/updateById',
                data: {
                    "id": id,
                    "data": {
                        "customerRecordEmail": customerRecordEmail,
                        "customerRecordFullName": customerRecordFullName,
                        "customerRecordPhone": customerRecordPhone,
                        "customerRecordPlatenumber": customerRecordPlatenumber,
                        "customerRecordCheckDuration": customerRecordCheckDuration,
                        "customerRecordCheckDate" : customerRecordCheckDate,
                        "customerRecordCheckExpiredDate": customerRecordCheckExpiredDate
                    }
                }
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

    static async deleteCustomerById(id) {
        return new Promise(resolve => {
            Request.send({
                method: 'POST',
                path: '/CustomerRecord/advanceUser/deleteById',
                data: { id: id }
            }).then((result = {})=>{
                const { statusCode } = result
                if(statusCode === 200) {
                    return resolve({ isSuccess: true })
                } else {
                    return resolve({ isSuccess: false })
                }
            })
        })
    }

    static async exportListCustomers(data = {}) {
        return new Promise(resolve => {
            Request.send({
                method: 'POST',
                path: '/CustomerRecord/advanceUser/exportExcel',
                data
            }).then((result = {})=>{
                const { statusCode, data } = result
                if(statusCode === 200) {
                    return resolve(data)
                } else {
                    return resolve(null)
                }
            })
        })
    }
}
