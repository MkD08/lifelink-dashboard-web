import { getToken, onMessage } from "firebase/messaging";
import { api } from "../lib/axios";
import { messaging, VAPID_KEY } from "../firebase";


class FirebaseMessagingService {
  /**
   * Demande la permission des notifications
   * puis récupère le token FCM Web.
   */
  async requestPermissionAndGetToken(): Promise<string | null> {
    try {
      const permission = await Notification.requestPermission();

      if (permission !== "granted") {
        console.warn("Permission de notification refusée.");
        return null;
      }

      await navigator.serviceWorker.register("/firebase-messaging-sw.js");

// Attendre que le Service Worker soit réellement actif
const registration = await navigator.serviceWorker.ready;

const token = await getToken(messaging, {
  vapidKey: VAPID_KEY,
  serviceWorkerRegistration: registration,
});

      if (!token) {
        console.warn("Aucun token FCM obtenu.");
        return null;
      }

      console.log("Token FCM Web :", token);

      return token;
    } catch (error) {
      console.error("Erreur Firebase Messaging :", error);
      return null;
    }
  }
  async registerDevice(): Promise<void> {
    try {
      const token = await this.requestPermissionAndGetToken();
  
      if (!token) {
        return;
      }
  
      await api.post("/notifications/register-device", {
        token,
      });
  
      console.log("✅ Token Web enregistré.");
    } catch (error) {
      console.error(
        "Erreur lors de l'enregistrement du token :",
        error
      );
    }
  }
  /**
   * Écoute des notifications lorsque
   * le dashboard est ouvert.
   */
  onForegroundMessage() {
    return onMessage(messaging, (payload) => {
        console.log("Notification reçue :", payload);
        console.log("Titre :", payload.notification?.title);
        console.log("Message :", payload.notification?.body);
  
      const { title, body } = payload.notification || {};
  
      if (Notification.permission === "granted") {
        navigator.serviceWorker.ready.then((registration) => {
            registration.showNotification(title || "LifeLink", {
              body: body || "",
              icon: "/logo.png",
            });
          });
      }
    });
  }
}

export default new FirebaseMessagingService();