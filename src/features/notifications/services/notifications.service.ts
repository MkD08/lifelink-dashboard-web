import { AxiosError } from "axios";

import { api } from "../../../lib/axios";

import type {
  Notification,
} from "../types/notification.types";

// ==============================
// Service notifications
// ==============================

export const notificationsService = {

  /**
   * Récupérer mes notifications
   */
  async getMyNotifications():
    Promise<Notification[]> {

    try {

      const response =
        await api.get(
          "/notifications"
        );

      console.log(
        "NOTIFICATIONS RESPONSE:",
        response.data
      );

      // ==============================
      // Vérification backend
      // ==============================

      if (!response.data?.success) {

        throw new Error(
          "Impossible de charger les notifications"
        );
      }

      // ==============================
      // Retour notifications
      // ==============================

      return response.data.data ?? [];

    } catch (error) {

      // ==============================
      // Axios
      // ==============================

      if (
        error instanceof AxiosError
      ) {

        throw new Error(

          error.response?.data
            ?.message ||

          error.message ||

          "Impossible de charger les notifications"
        );
      }

      // ==============================
      // Error classique
      // ==============================

      if (error instanceof Error) {

        throw error;
      }

      throw new Error(
        "Impossible de charger les notifications"
      );
    }
  },

  /**
   * Marquer notification comme lue
   */
  async markAsRead(
    id: number
  ): Promise<void> {

    try {

      await api.put(
        `/notifications/${id}/read`
      );

    } catch (error) {

      console.error(
        "READ NOTIFICATION ERROR:",
        error
      );

      throw error;
    }
  },
};