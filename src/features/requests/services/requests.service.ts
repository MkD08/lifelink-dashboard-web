import { AxiosError } from "axios";

import { api } from "../../../lib/axios";

import type {
  BloodRequest,
} from "../types/request.types";

// ==============================
// Service demandes de sang
// ==============================

export const requestsService = {

  /**
   * Récupérer toutes les demandes
   *
   * 🔥 IMPORTANT :
   * - Admin => toutes les demandes
   * - Staff/Directeur => seulement son centre
   *
   * Le backend gère déjà le filtrage.
   */
  async getAllRequests(): Promise<BloodRequest[]> {

    try {

      const response =
        await api.get("/dons/demandes");

      // 🔥 DEBUG
      console.log(
        "API RESPONSE DEMANDES:",
        response.data
      );

      // ==============================
      // Vérification backend
      // ==============================

      if (!response.data?.success) {

        throw new Error(
          "Impossible de charger les demandes"
        );
      }

      // ==============================
      // Retour des demandes
      // ==============================

      return response.data.data ?? [];

    } catch (error) {

      // ==============================
      // Gestion erreurs Axios
      // ==============================

      if (error instanceof AxiosError) {

        throw new Error(

          error.response?.data?.message ||

          error.message ||

          "Impossible de charger les demandes"
        );
      }

      // ==============================
      // Gestion erreurs classiques
      // ==============================

      if (error instanceof Error) {

        throw error;
      }

      throw new Error(
        "Impossible de charger les demandes"
      );
    }
  },
};