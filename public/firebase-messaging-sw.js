importScripts("https://www.gstatic.com/firebasejs/12.0.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/12.0.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyCVLKijqB9S3n2xkGrDSn5mos1MT8WCfrM", // pas la vraie
  authDomain: "thielal.firebaseapp.com",
  projectId: "thielal",
  storageBucket: "thielal.firebasestorage.app",
  messagingSenderId: "220814183760",
  appId: "1:220814183760:web:9bd4bff4af59831272f055", // pas la vraie
});

self.addEventListener("notificationclick", (event) => {
    event.notification.close();
  
    event.waitUntil(
      clients.openWindow("/")
    );
  });
// =======================

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    const notification = payload.notification;
  
    if (!notification) return;
  
    self.registration.showNotification(notification.title, {
      body: notification.body,
      icon: notification.icon || "/logo.png",
      badge: notification.badge || "/logo.png",
    });
  });