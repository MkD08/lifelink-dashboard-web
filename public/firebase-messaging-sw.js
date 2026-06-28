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

// ===== AJOUTER ICI =====
console.log("🔥 Firebase Service Worker chargé");

self.addEventListener("push", (event) => {
    console.log("🔥 PUSH EVENT");
  
    if (event.data) {
      console.log("DATA :", event.data.text());
  
      try {
        console.log("JSON :", event.data.json());
      } catch (e) {
        console.log("Impossible de parser le JSON");
      }
    }
  });

self.addEventListener("notificationclick", (event) => {
  console.log("🔥 Notification cliquée :", event);
});
// =======================

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log("BACKGROUND PAYLOAD :", payload);
  });