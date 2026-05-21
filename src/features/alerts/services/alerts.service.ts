import { api } from "../../../lib/axios";

import type {
  Alert,
  CreateAlertPayload,
  UpdateAlertPayload,
} from "../types/alert.types";

export const alertsService = {

  /**
   * =========================
   * CREATE ALERT
   * =========================
   */
  async createAlert(
    data: CreateAlertPayload
  ): Promise<Alert> {

    try {

      const response =
        await api.post(
          "/alertes",
          data
        );

      return response.data?.data;

    } catch (err: any) {

      console.error(
        "❌ CREATE ALERT ERROR:",
        err
      );

      throw new Error(
        err?.response?.data
          ?.message ||
          "Impossible de créer l'alerte"
      );
    }
  },

  /**
   * =========================
   * GET ALL ALERTS
   * =========================
   */
  async getAlerts(): Promise<
    Alert[]
  > {

    try {

      const response =
        await api.get(
          "/alertes"
        );

      return (
        response.data?.data || []
      );

    } catch (err: any) {

      console.error(
        "❌ GET ALERTS ERROR:",
        err
      );

      throw new Error(
        err?.response?.data
          ?.message ||
          "Impossible de charger les alertes"
      );
    }
  },

  /**
   * =========================
   * GET ONE ALERT
   * =========================
   */
  async getAlert(
    id: number
  ): Promise<Alert> {

    try {

      const response =
        await api.get(
          `/alertes/${id}`
        );

      return response.data?.data;

    } catch (err: any) {

      console.error(
        "❌ GET ALERT ERROR:",
        err
      );

      throw new Error(
        err?.response?.data
          ?.message ||
          "Impossible de récupérer l'alerte"
      );
    }
  },

  /**
   * =========================
   * UPDATE ALERT
   * =========================
   */
  async updateAlert(
    id: number,
    data: UpdateAlertPayload
  ): Promise<Alert> {

    try {

      const response =
        await api.put(
          `/alertes/${id}`,
          data
        );

      return response.data?.data;

    } catch (err: any) {

      console.error(
        "❌ UPDATE ALERT ERROR:",
        err
      );

      throw new Error(
        err?.response?.data
          ?.message ||
          "Impossible de modifier l'alerte"
      );
    }
  },

  /**
   * =========================
   * DELETE ALERT
   * =========================
   */
  async deleteAlert(
    id: number
  ): Promise<void> {

    try {

      await api.delete(
        `/alertes/${id}`
      );

    } catch (err: any) {

      console.error(
        "❌ DELETE ALERT ERROR:",
        err
      );

      throw new Error(
        err?.response?.data
          ?.message ||
          "Impossible de supprimer l'alerte"
      );
    }
  },

  /**
   * =========================
   * MARK ALERT AS READ
   * =========================
   */
  async markAsRead(
    id: number
  ): Promise<void> {

    try {

      await api.put(
        `/alertes/${id}/read`
      );

    } catch (err: any) {

      console.error(
        "❌ MARK READ ERROR:",
        err
      );

      throw new Error(
        err?.response?.data
          ?.message ||
          "Impossible de lire l'alerte"
      );
    }
  },
};