import { AxiosError } from "axios";
import { api } from "../../../lib/axios";
import type { Donor, DonorsApiResponse } from "../types/donor.types";

export const donorsService = {
  async getAllDonors(): Promise<Donor[]> {
    try {
      const response = await api.get<DonorsApiResponse>("/dons/donneurs/all");

      if (!response.data?.success) {
        throw new Error("Impossible de charger les donneurs");
      }

      return response.data.data ?? [];
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(
          error.response?.data?.message ||
            error.message ||
            "Impossible de charger les donneurs"
        );
      }

      if (error instanceof Error) {
        throw error;
      }

      throw new Error("Impossible de charger les donneurs");
    }
  },

  async verifyBloodGroup(userId: number, groupeSanguin: string): Promise<void> {
    try {
      const response = await api.patch(`/users/${userId}/verify-blood-group`, {
        groupe_sanguin: groupeSanguin,
      });

      if (!response.data?.success) {
        throw new Error(
          response.data?.message || "Impossible de vérifier le groupe sanguin"
        );
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(
          error.response?.data?.message ||
            error.message ||
            "Impossible de vérifier le groupe sanguin"
        );
      }

      if (error instanceof Error) {
        throw error;
      }

      throw new Error("Impossible de vérifier le groupe sanguin");
    }
  },

  async getDonorById(donorId: number): Promise<Donor> {
    try {
      const response = await api.get(`/dons/donneurs/${donorId}`);

      if (response.data?.success === false) {
        throw new Error(response.data?.message || "Impossible de charger le donneur");
      }

      return response.data.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(
          error.response?.data?.message ||
            error.message ||
            "Impossible de charger le donneur"
        );
      }

      if (error instanceof Error) {
        throw error;
      }

      throw new Error("Impossible de charger le donneur");
    }
  },

  async generateQr(userId: number): Promise<string> {
    try {
      const response = await api.post("/dons/generate-qr", {
        userId,
      });

      if (response.data?.success === false) {
        throw new Error(response.data?.message || "Impossible de générer le QR");
      }

      const qr =
        response.data?.qr ??
        response.data?.qr_code ??
        response.data?.data?.qr ??
        response.data?.data?.qr_code ??
        "";

      if (!qr) {
        throw new Error("QR généré mais image introuvable dans la réponse");
      }

      return qr;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(
          error.response?.data?.message ||
            error.message ||
            "Impossible de générer le QR"
        );
      }

      if (error instanceof Error) {
        throw error;
      }

      throw new Error("Impossible de générer le QR");
    }
  },
  async scanQr(qrData: string, centreId: number): Promise<any> {
    try {
      const response = await api.post("/dons/scan-qr", {
        qrData,
        centre_id: centreId,
      });

      if (response.data?.success === false) {
        throw new Error(response.data?.message || "Impossible de scanner le QR");
      }

      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(
          error.response?.data?.message ||
            error.message ||
            "Impossible de scanner le QR"
        );
      }

      if (error instanceof Error) {
        throw error;
      }

      throw new Error("Impossible de scanner le QR");
    }
  },

  async verifyReceipt(token: string): Promise<any> {
    try {
      const response = await api.post("/dons/receipt/verify", {
        token,
      });

      if (response.data?.success === false) {
        throw new Error(
          response.data?.message || "Impossible de vérifier le reçu"
        );
      }

      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(
          error.response?.data?.message ||
            error.message ||
            "Impossible de vérifier le reçu"
        );
      }

      if (error instanceof Error) {
        throw error;
      }

      throw new Error("Impossible de vérifier le reçu");
    }
  },
};
