import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyCVLKijqB9S3n2xkGrDSn5mos1MT8WCfrM", 
  authDomain: "thielal.firebaseapp.com",
  projectId: "thielal",
  storageBucket: "thielal.firebasestorage.app",
  messagingSenderId: "220814183760",
  appId: "1:220814183760:web:9bd4bff4af59831272f055",
};

const app = initializeApp(firebaseConfig);

// À remplacer par la vraie VAPID Key fournie ultérieurement
export const VAPID_KEY = "BBQB_otwzpeGHpOsDi2IlpmUQAJfJ_KRPw5xTyj0_7H6-HndQtf4k1M16ZhRORADMSX_ryxsPtVrTn-am49JIME";

export const messaging = getMessaging(app);

export { app };