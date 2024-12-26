import Request from './request'

export default class ScheduleSettingService {
    static async getDetailById(data = {}) {
        return new Promise(resolve =>{
            Request.send({
            method: 'POST',
            path: '/Stations/advanceUser/getDetailById',
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
    
    static async saveScheduleSetting(data = {}) {
        return new Promise(resolve => {
            Request.send({
                method: 'POST',
                path: '/Stations/advanceUser/updateById',
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
}