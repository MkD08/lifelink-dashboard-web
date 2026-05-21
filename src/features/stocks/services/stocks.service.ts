import { AxiosError } from "axios";
import { api } from "../../../lib/axios";
import type { BloodStock, StocksApiResponse } from "../types/stock.types";

function normalizeOneStock(item: any): BloodStock {
  return {
    id: item.id_banque ?? item.id_stock ?? item.id ?? undefined,
    centre_id: item.centre_id ?? null,
    groupe_sanguin: item.groupe_sanguin ?? "—",
    quantite: Number(item.quantite ?? 0),
    centre_nom: item.centre?.nom ?? null,
    ville: item.centre?.ville ?? null,
  };
}

export const stocksService = {
  async getAllStocks(): Promise<BloodStock[]> {
    try {
      const response = await api.get<StocksApiResponse>("/banque");

      if (response.data?.success === false) {
        throw new Error("Impossible de charger les stocks");
      }

      return (response.data?.data ?? []).map(normalizeOneStock);
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(
          error.response?.data?.message ||
            error.message ||
            "Impossible de charger les stocks"
        );
      }

      if (error instanceof Error) {
        throw error;
      }

      throw new Error("Impossible de charger les stocks");
    }
  },

  async updateStock(
    groupeSanguin: string,
    quantite: number
  ): Promise<void> {
  
    try {
  
      const response =
        await api.post(
          "/banque",
          {
            groupe_sanguin:
              groupeSanguin,
  
            quantite,
          }
        );
  
      if (
        response.data?.success === false
      ) {
  
        throw new Error(
  
          response.data?.message ||
  
          "Impossible de mettre à jour le stock"
        );
      }
  
    } catch (error) {
  
      if (
        error instanceof AxiosError
      ) {
  
        throw new Error(
  
          error.response?.data
            ?.message ||
  
          error.message ||
  
          "Impossible de mettre à jour le stock"
        );
      }
  
      if (
        error instanceof Error
      ) {
  
        throw error;
      }
  
      throw new Error(
        "Impossible de mettre à jour le stock"
      );
    }
  }
}