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
   */
  async getAllRequests(): Promise<BloodRequest[]> {

    try {

      const response =
        await api.get("/dons/demandes");

      console.log(
        "API RESPONSE DEMANDES:",
        response.data
      );

      if (!response.data?.success) {

        throw new Error(
          "Impossible de charger les demandes"
        );
      }

      return response.data.data ?? [];

    } catch (error) {

      if (error instanceof AxiosError) {

        throw new Error(

          error.response?.data?.message ||

          error.message ||

          "Impossible de charger les demandes"
        );
      }

      if (error instanceof Error) {

        throw error;
      }

      throw new Error(
        "Impossible de charger les demandes"
      );
    }
  },

  // ==============================
  // Remettre la poche au patient
  // ==============================

  async delivrerRequest(
    id_demande: number
  ): Promise<BloodRequest> {

    try {

      const response =
        await api.patch(
          `/dons/${id_demande}/delivrer`
        );

      if (!response.data?.success) {

        throw new Error(
          response.data?.message ||
          "Impossible de délivrer la demande"
        );
      }

      return response.data.data;

    } catch (error) {

      if (error instanceof AxiosError) {

        throw new Error(

          error.response?.data?.message ||

          error.message ||

          "Impossible de délivrer la demande"
        );
      }

      if (error instanceof Error) {

        throw error;
      }

      throw new Error(
        "Impossible de délivrer la demande"
      );
    }
  },
};