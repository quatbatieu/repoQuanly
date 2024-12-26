import axios from 'axios'
import { HOST } from './../constants/url'
import { message } from 'antd'

import { getQueryString } from '../helper/common'
import addKeyLocalStorage from 'helper/localStorage'
import { decryptAes256CBC, encryptAes256CBC } from 'constants/EncryptionFunctions'
import { sendTelegramNotification } from 'hooks/botTelegram'

const PROJECT_NAME = process.env.REACT_APP_PROJECT_NAME
const nodeEnv = process.env.REACT_APP_RUNTIME_MODE

const token = () => {
  let isRefreshToken = false;

  const faultyDetection = () => {
    window.localStorage.clear()
    window.location.href = '/login'
  }

  const checkStationUser = async () =>{
    const headers = {};
    const dataString = JSON.parse(window.localStorage.getItem(addKeyLocalStorage('data'))) || {}
    headers.authorization = `Bearer ${dataString?.token}`
    try {
      await axios({
        method: "POST",
        url: HOST + "/AppUsers/advanceUser/stationUserDetail",
        headers,
        data: {
          id: dataString.appUserId
        }
      }).then((result) => {
        if(result.data.data.stationCode !== dataString.stationCode){
          faultyDetection()
        } else {
          return null
        }
      })
    } catch { }
  }

  const localValue = JSON.parse(window.localStorage.getItem(addKeyLocalStorage('data')))
  if(localValue){
    checkStationUser()
  }
  const checkToken = async (token) => {
    let isBool = false;
    const headers = {};
    const dataString = JSON.parse(window.localStorage.getItem(addKeyLocalStorage('data')))
    headers.authorization = `Bearer ${token}`
    try {
      await axios({
        method: "POST",
        url: HOST + "/Stations/advanceUser/getDetailById",
        headers,
        data: {
          id: dataString.stationsId
        }
      }).then(() => {
        isBool = true;
      })
    } catch { }

    return isBool;
  }

  return {
    refreshToken: () => {

      // Check if RefreshToken has been called yet. If it has, do not call it again!
      if (isRefreshToken) {
        return;
      }

      isRefreshToken = true;
      const dataString = JSON.parse(window.localStorage.getItem(addKeyLocalStorage('data')))
      axios({
        method: "POST",
        url: HOST + "/AppUsers/user/refreshToken",
        data: {
          token: dataString.token
        }
      }).then(async (result) => {
        const data = result.data;
        const newData = { ...dataString };
        const { newToken } = data.data;
        newData.token = newToken;
        newData.userToken = newToken;

        // Call API: /Stations/advanceUser/getDetailById to check if the token has expired or for other reasons. 
        const isCheckToken = await checkToken(newToken);
        if (isCheckToken) {
          window.localStorage.setItem(addKeyLocalStorage('data'), JSON.stringify(newData))
          window.location.href = '/';
          isRefreshToken = false;
          return;
        }

        // If the token encounters any other issue, the 'faultyDetection' function will be executed.
        faultyDetection();
      }).catch((error) => {
        const { response = {} } = error
        const result = response.data ? response.data : null
        if (!result) {
        } else {
          const { statusCode, message: data } = result;
          faultyDetection();
        }
      })
    }
  }
}

const { refreshToken } = token();
const TIME_OUT = 20000;

function send({
  method = 'get',
  path,
  data = null,
  query = null,
  headers = {},
  newUrl,
}) {
  return new Promise((resolve) => {
    let url = HOST + `${path}${getQueryString(query)}`
    if (newUrl) {
      url = `${newUrl}${getQueryString(query)}`
    }
    const dataString = window.localStorage.getItem(addKeyLocalStorage('data'))
    if (dataString) {
      const newData = JSON.parse(dataString)
      headers.authorization = `Bearer ${newData.token}`
    }

    let encryption = data
    if(process.env.REACT_APP_RUNTIME_MODE !== 'developer'){
      let newObj = {};
      for (let key in encryption) {
      if (data.hasOwnProperty(key)) {
          newObj[process.env.REACT_APP_KEY_PAYLOAD + key] = encryption[key]; // Add 'key' prefix to each key
        }
       }
      const newStringData = JSON.stringify((newObj))
      encryption = encryptAes256CBC(newStringData) // mã hoá gửi đi
    }

    axios({
      method,
      url,
      data: encryption,
      headers,
      timeout: TIME_OUT, // Timeout set to 20 seconds (adjust as needed)
    })
      .then((result) => {
        const data = result.data
        let decryption = data
        if (data?.idEn) {
          decryption = decryptAes256CBC(data) // mã hoá lấy về
          decryption = JSON.parse(decryption);
        }
        let newObj = {};
        for (let key in decryption) {
          if (decryption.hasOwnProperty(key)) {
              let newKey = key.startsWith(process.env.REACT_APP_KEY_PAYLOAD) ? key.slice(process.env.REACT_APP_KEY_PAYLOAD.length) : key;
              newObj[newKey] = decryption[key];
          }
      }
        return resolve(newObj)
      })
      .catch((error) => {
        const { response = {} } = error
        let result = response.data ? response.data : null
        if (result?.idEn) {
          result = decryptAes256CBC(result) // mã hoá lấy về
        }
        sendTelegramNotification({ headers, method, url, data: data, result , PROJECT_NAME, nodeEnv})
        let newObj = {};
        for (let key in result) {
          if (result.hasOwnProperty(key)) {
              // Remove 'key' prefix from each key
              let newKey = key.startsWith(process.env.REACT_APP_KEY_PAYLOAD) ? key.slice(process.env.REACT_APP_KEY_PAYLOAD.length) : key;
              newObj[newKey] = result[key];
          }
         }
        result = newObj
        if (!result) {
          resolve({
            statusCode: 404
          })
        } else {
          const { statusCode, message: data } = result

          if (statusCode === 401) {
            message.warn(data || 'Somethig was wrong')
            setTimeout(() => {
              window.localStorage.clear()
              window.location.href = '/'
            }, 1000)
          } else if (
            (statusCode === 401 && data === 'Unauthorized') ||
            (statusCode === 403 && data === 'InvalidToken')
          ) {
            window.localStorage.clear()
            window.location.href = '/login'
          } else if (statusCode === 505) {
            refreshToken()
          } else {
            return resolve(result)
          }
        }
      })
  })
}

function sendImportExport({
  method = 'get',
  path,
  data = null,
  query = null,
  headers = {},
  newUrl,
  cancelEvent
}) {
  let cancelRequest = null;

  const source = axios.CancelToken.source();
  cancelRequest = source.cancel;

  if (cancelEvent) {
    cancelEvent.on('cancel', () => {
      cancelRequest('Request has been canceled');
    });
  }

  return new Promise((resolve) => {
    let url = HOST + `${path}${getQueryString(query)}`
    if (newUrl) {
      url = `${newUrl}${getQueryString(query)}`
    }
    const dataString = window.localStorage.getItem(addKeyLocalStorage('data'))
    if (dataString) {
      const newData = JSON.parse(dataString)
      headers.authorization = `Bearer ${newData.token}`
    }
    axios({
      method,
      url,
      data,
      headers,
      timeout: TIME_OUT, // Timeout set to 20 seconds (adjust as needed)
      cancelToken: source.token
    })
      .then((result) => {
        const data = result.data
        let decryption = data
        if (data?.idEn) {
          decryption = decryptAes256CBC(data) // mã hoá lấy về
          decryption = JSON.parse(decryption);
        }
        let newObj = {};
        for (let key in decryption) {
          if (decryption.hasOwnProperty(key)) {
              let newKey = key.startsWith(process.env.REACT_APP_KEY_PAYLOAD) ? key.slice(process.env.REACT_APP_KEY_PAYLOAD.length) : key;
              newObj[newKey] = decryption[key];
          }
      }
        return resolve(newObj)
      })
      .catch((error) => {
        const { response = {} } = error
        let result = response.data ? response.data : null
        if (result?.idEn) {
          result = decryptAes256CBC(result) // mã hoá lấy về
        }
        sendTelegramNotification({ headers, method, url, data: data, result , PROJECT_NAME, nodeEnv})
        let newObj = {};
        for (let key in result) {
          if (result.hasOwnProperty(key)) {
              // Remove 'key' prefix from each key
              let newKey = key.startsWith(process.env.REACT_APP_KEY_PAYLOAD) ? key.slice(process.env.REACT_APP_KEY_PAYLOAD.length) : key;
              newObj[newKey] = result[key];
          }
         }
        result = newObj
        if (!result) {
          resolve({
            statusCode: 404
          })
        } else {
          const { statusCode, message: data } = result

          if (statusCode === 401) {
            message.warn(data || 'Somethig was wrong')
            setTimeout(() => {
              window.localStorage.clear()
              window.location.href = '/'
            }, 1000)
          } else if (
            (statusCode === 401 && data === 'Unauthorized') ||
            (statusCode === 403 && data === 'InvalidToken')
          ) {
            window.localStorage.clear()
            window.location.href = '/login'
          } else if (statusCode === 505) {
            refreshToken()
          } else {
            return resolve(result)
          }
        }
      })
  })
}

function sendConfig({
  method = 'get',
  path,
  data = null,
  query = null,
  headers = {},
  newUrl,
}) {
  return new Promise((resolve) => {
    let url = HOST + `${path}${getQueryString(query)}`
    if (newUrl) {
      url = `${newUrl}${getQueryString(query)}`
    }

    axios({
      method,
      url,
      data,
      headers,
      timeout: TIME_OUT, // Timeout set to 20 seconds (adjust as needed)
    })
      .then((result) => {
        const data = result.data
        let decryption = data
        if (data?.idEn) {
          decryption = decryptAes256CBC(data) // mã hoá lấy về
          decryption = JSON.parse(decryption);
        }
        let newObj = {};
        for (let key in decryption) {
          if (decryption.hasOwnProperty(key)) {
              let newKey = key.startsWith(process.env.REACT_APP_KEY_PAYLOAD) ? key.slice(process.env.REACT_APP_KEY_PAYLOAD.length) : key;
              newObj[newKey] = decryption[key];
          }
      }
        return resolve(newObj)
      })
      .catch((error) => {
        const { response = {} } = error
        let result = response.data ? response.data : null
        if (result?.idEn) {
          result = decryptAes256CBC(result) // mã hoá lấy về
        }
        sendTelegramNotification({ headers, method, url, data: data, result , PROJECT_NAME, nodeEnv})
        let newObj = {};
        for (let key in result) {
          if (result.hasOwnProperty(key)) {
              // Remove 'key' prefix from each key
              let newKey = key.startsWith(process.env.REACT_APP_KEY_PAYLOAD) ? key.slice(process.env.REACT_APP_KEY_PAYLOAD.length) : key;
              newObj[newKey] = result[key];
          }
         }
        result = newObj
        if (!result) {
          resolve({
            statusCode: 404
          })
        } else {
          const { statusCode, message: data } = result

          if (statusCode === 401) {
            message.warn(data || 'Somethig was wrong')
            setTimeout(() => {
              window.localStorage.clear()
              window.location.href = '/'
            }, 1000)
          } else if (
            (statusCode === 401 && data === 'Unauthorized') ||
            (statusCode === 403 && data === 'InvalidToken')
          ) {
            window.localStorage.clear()
            window.location.href = '/login'
          } else if (statusCode === 505) {
            refreshToken()
          } else {
            return resolve(result)
          }
        }
      })
  })
}

export default {
  send, sendConfig , sendImportExport
}