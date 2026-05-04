import { AxiosError } from "axios";
import { api } from "../../../lib/axios";
import type { Centre, CentresApiResponse } from "../types/centre.types";

export interface CreateCentrePayload {
  nom: string;
  ville: string;
  adresse: string;
  latitude: number;
  longitude: number;
  telephone?: string | null;
}

export interface UpdateCentrePayload {
  nom: string;
  ville: string;
  adresse: string;
  latitude: number;
  longitude: number;
  telephone?: string | null;
}

function normalizeOneCentre(item: any): Centre {
  return {
    id_centre: Number(item.id_centre ?? item.id ?? 0),
    nom: item.nom ?? "—",
    adresse: item.adresse ?? null,
    ville: item.ville ?? null,
    telephone: item.telephone ?? null,
    latitude: item.latitude ?? null,
    longitude: item.longitude ?? null,
    created_at: item.created_at ?? item.date_creation ?? null,
  };
}

export const centresService = {
  async getAllCentres(): Promise<Centre[]> {
    try {
      const response = await api.get<CentresApiResponse | Centre[]>("/centres");

      const payload = response.data;

      if (Array.isArray(payload)) {
        return payload.map(normalizeOneCentre);
      }

      if (payload?.success === false) {
        throw new Error("Impossible de charger les centres");
      }

      return (payload?.data ?? []).map(normalizeOneCentre);
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(
          error.response?.data?.message ||
            error.message ||
            "Impossible de charger les centres"
        );
      }

      if (error instanceof Error) {
        throw error;
      }

      throw new Error("Impossible de charger les centres");
    }
  },

  async createCentre(payload: CreateCentrePayload): Promise<void> {
    try {
      const response = await api.post("/centres", payload);

      if (response.data?.success === false) {
        throw new Error(
          response.data?.message || "Impossible de créer le centre"
        );
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(
          error.response?.data?.message ||
            error.message ||
            "Impossible de créer le centre"
        );
      }

      if (error instanceof Error) {
        throw error;
      }

      throw new Error("Impossible de créer le centre");
    }
  },

  async updateCentre(
    centreId: number,
    payload: UpdateCentrePayload
  ): Promise<void> {
    try {
      const response = await api.put(`/centres/${centreId}`, payload);

      if (response.data?.success === false) {
        throw new Error(
          response.data?.message || "Impossible de modifier le centre"
        );
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(
          error.response?.data?.message ||
            error.message ||
            "Impossible de modifier le centre"
        );
      }

      if (error instanceof Error) {
        throw error;
      }

      throw new Error("Impossible de modifier le centre");
    }
  },

  async deleteCentre(centreId: number): Promise<void> {
    try {
      const response = await api.delete(`/centres/${centreId}`);

      if (response.data?.success === false) {
        throw new Error(
          response.data?.message || "Impossible de supprimer le centre"
        );
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(
          error.response?.data?.message ||
            error.message ||
            "Impossible de supprimer le centre"
        );
      }

      if (error instanceof Error) {
        throw error;
      }

      throw new Error("Impossible de supprimer le centre");
    }
  },
};