importScripts("https://www.gstatic.com/firebasejs/12.0.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/12.0.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyCVLKijqB9S3n2xkGrDSn5mos1MT8WCfrM",
  authDomain: "thielal.firebaseapp.com",
  projectId: "thielal",
  storageBucket: "thielal.firebasestorage.app",
  messagingSenderId: "220814183760",
  appId: "1:220814183760:web:9bd4bff4af59831272f055",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("[firebase-messaging-sw.js] Notification reçue :", payload);

  const notificationTitle =
    payload.notification?.title || "LifeLink";

  const notificationOptions = {
    body: payload.notification?.body || "",
    icon: "/logo.png", // À adapter selon votre projet
    badge: "/logo.png", // À adapter selon votre projet
  };

  self.registration.showNotification(
    notificationTitle,
    notificationOptions
  );
});