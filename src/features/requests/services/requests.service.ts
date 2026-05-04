import { AxiosError } from "axios";
import { api } from "../../../lib/axios";
import type { BloodRequest } from "../types/request.types";

export const requestsService = {
  async getAllRequests(): Promise<BloodRequest[]> {
    try {
      const response = await api.get("/dons/demandes");

      // 🔥 LOG pour debug
      console.log("API RESPONSE DEMANDES:", response.data);

      // ✔ CAS NORMAL BACKEND
      if (!response.data?.success) {
        throw new Error("Impossible de charger les demandes");
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

      throw new Error("Impossible de charger les demandes");
    }
  },
};