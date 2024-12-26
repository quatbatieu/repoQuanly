// import { initializeApp } from "firebase/app";
// import { getMessaging, getToken, isSupported } from "firebase/messaging";
// import { onBackgroundMessage } from "firebase/messaging/sw";
import { notification } from "antd";
import LoginService from "services/loginService";

export const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIRE_BASE_API_KEY,
  authDomain: process.env.REACT_APP_FIRE_BASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIRE_BASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIRE_BASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIRE_BASE_MESSAGEING_SENDER_ID,
  appId: process.env.REACT_APP_FIRE_BASE_APP_ID,
  measurementId: process.env.REACT_APP_FIRE_BASE_MEASUREMENT_ID
};

export const token = process.env.REACT_APP_FIRE_BASE_TOKEN;
export const getTokenFirebase = async (translation) => {
  let tokenResult = null;
  const hasFirebaseMessagingSupport = false // await isSupported();
  if (!hasFirebaseMessagingSupport) {
    return null;
  }
  const app = {}// initializeApp(firebaseConfig);
  const messaging = {} // getMessaging(app);
  try {
    await Notification.requestPermission().then(async (permission) => {
      if (permission === "granted") {
        try {
          // await getToken(messaging, {
          //   vapidKey: token
          // }).then((currentToken) => {
          //   if (currentToken) {
          //     tokenResult = currentToken;
          //   }
          // });
        } catch (error) {
          console.error('Lỗi khi lấy token FCM trên iOS:', error);
        }
      }
    });
  } catch (error) {
    console.error('Lỗi khi lấy token FCM trên iOS:', error);
  }

  return tokenResult;
}

export const updateUserWithFirebaseToken = async (result, translation) => {
  const token = await getTokenFirebase(translation);
  if (token) {
    try {
      const res = await LoginService.updateUserInfo({
        id: result.appUserId,
        data: {
          firebaseToken: token
        }
      }, result.token);
      if (!res.isSuccess) {
        return null;
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật token FCM cho người dùng:', error);
    }
  }

  return token;
}