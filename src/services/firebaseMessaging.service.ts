import { getToken, onMessage } from "firebase/messaging";
import { api } from "../lib/axios";
import { messaging, VAPID_KEY } from "../firebase";
import { showGlobalToast } from "./toast.service";


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
       
        return null;
      }

    

      return token;
    } catch (error) {
      
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
      const title = payload.notification?.title ?? "LifeLink";
      const body = payload.notification?.body;
  
      if (body) {
        showGlobalToast(`${title}\n${body}`, "info");
      }
    });
  }
  }
  
  export default new FirebaseMessagingService();