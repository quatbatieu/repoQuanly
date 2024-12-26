import * as actionTypes from "../constants/member"

const handleSignin = (data) => ({
    type: actionTypes.USER_LOGIN,
    data: data
})

const handleSignout = (callback) => ({
    type: actionTypes.USER_RESET ,
    callback
})

export {
    handleSignin,
    handleSignout
}