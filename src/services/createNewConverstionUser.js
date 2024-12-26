import Request from "./request"
export default class createNewConverstationUser {
    static async createNewChatUser(data = {}) {
        return new Promise(resolve => {
            Request.send({
                method: 'POST',
                path: '/AppUserChatLog/advanceUser/sendNewMessageToUser',
                data
            }).then((result = {}) => {
                const { statusCode, data } = result
                if (statusCode === 200) {
                    return resolve(result)
                } else {
                    return resolve([])
                }
            })
        })
    }

}