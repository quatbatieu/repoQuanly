importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js"
);

const firebaseConfig = {
  apiKey: "AIzaSyCHqtj50ByeLd35h7dbcPpcKB4CNMWPTq8",
  authDomain: "thongbao-3d02a.firebaseapp.com",
  projectId: "thongbao-3d02a",
  storageBucket: "thongbao-3d02a.appspot.com",
  messagingSenderId: "8099311455",
  appId: "1:8099311455:web:7dddb3fe7f7203381bd0ea",
  measurementId: "G-PJRTQR5F22"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.image,
  };

  // self.registration.showNotification(notificationTitle, notificationOptions);
});