import { api } from "../../../lib/axios";

export type AlertType = "urgent" | "warning" | "info";

export interface Centre {
  id_centre: number;
  nom: string;
  ville: string;
}

/**
 * CREATE ALERT PAYLOAD
 */
export interface CreateAlertPayload {
  titre: string;
  message: string;
  type: AlertType;
  groupe_sanguin: string;
  ville: string;
  centre_id?: number;
}

/**
 * ALERT MODEL (GET BACKEND)
 */
export interface Alert {
  id_alerte: number;
  titre: string;
  message: string;
  type: AlertType;
  groupe_sanguin: string;
  ville: string;
  date_creation: string;
  centre?: Centre;
}

export interface AlertsResponse {
  success: boolean;
  data: Alert[];
}

export const alertsService = {

  // =========================
  // GET ALL ALERTS
  // =========================
  async getAllAlerts(): Promise<Alert[]> {
    try {
      console.log("🚀 GET ALERTS START");

      const res = await api.get<AlertsResponse>("/alertes");

      console.log("📦 RESPONSE:", res.data);

      if (!res.data?.success && res.data?.success !== undefined) {
        throw new Error("Backend error");
      }

      return res.data.data ?? [];
    } catch (error: any) {
      console.error("🔥 GET ALERTS ERROR:", error);

      if (error?.response) {
        console.error("📛 STATUS:", error.response.status);
        console.error("📛 DATA:", error.response.data);
      }

      throw new Error("Impossible de charger les alertes");
    }
  },

  // =========================
  // CREATE ALERT
  // =========================
  async createAlert(data: CreateAlertPayload) {
    try {
      console.log("🚀 CREATE ALERT PAYLOAD:", data);

      const res = await api.post("/alertes", data);

      console.log("📦 CREATE RESPONSE:", res.data);

      if (!res.data?.success) {
        throw new Error(res.data?.message || "Erreur création alerte");
      }

      return res.data.data;
    } catch (error: any) {
      console.error("🔥 CREATE ALERT ERROR:", error);

      if (error?.response) {
        // console.error("📛 STATUS:", error.response.status);
        // console.error("📛 DATA:", error.response.data);
      }

      throw new Error("Erreur création alerte");
    }
  },
};