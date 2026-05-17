import { AxiosError } from "axios";
import { api } from "../../../lib/axios";

import type {
  Director,
  DirectorsApiResponse,
  CreateDirectorPayload,
} from "../types/director.types";

/**
 * Gestion centralisée erreurs API
 */
const handleApiError = (
  error: unknown,
  defaultMessage: string
): never => {
  if (error instanceof AxiosError) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        defaultMessage
    );
  }

  if (error instanceof Error) {
    throw error;
  }

  throw new Error(defaultMessage);
};

export const directorsService = {
  /**
   * Liste directeurs
   */
  async getAllDirectors(): Promise<Director[]> {
    try {
      const response =
        await api.get<DirectorsApiResponse>("/users");

      if (response.data?.success === false) {
        throw new Error(
          response.data?.message ||
            "Impossible de charger les directeurs"
        );
      }

      const users = response.data.data ?? [];

      /**
       * 🔥 FILTRE ROLE DIRECTEUR
       * role_id = 4
       */
      return users.filter(
        (user) => user.role_id === 4
      );
    } catch (error) {
      handleApiError(
        error,
        "Impossible de charger les directeurs"
      );

      return [];
    }
  },

  /**
   * Création directeur
   */
  async createDirector(
    payload: CreateDirectorPayload
  ): Promise<void> {
    try {
      /**
       * 🔥 IMPORTANT
       * role_id directeur = 4
       */
      const response = await api.post(
        "/users/admin/create-backoffice",
        {
          ...payload,
          role_id: 4,
        }
      );

      if (response.data?.success === false) {
        throw new Error(
          response.data?.message ||
            "Impossible de créer le directeur"
        );
      }
    } catch (error) {
      handleApiError(
        error,
        "Impossible de créer le directeur"
      );
    }
  },

  /**
   * Modifier directeur
   */
  async updateDirector(
    directorId: number,
    payload: Partial<Director>
  ): Promise<void> {
    try {
      const response = await api.put(
        `/users/${directorId}`,
        payload
      );

      if (response.data?.success === false) {
        throw new Error(
          response.data?.message ||
            "Impossible de modifier le directeur"
        );
      }
    } catch (error) {
      handleApiError(
        error,
        "Impossible de modifier le directeur"
      );
    }
  },

  /**
   * Désactivation directeur
   */
  async deleteDirector(
    directorId: number
  ): Promise<void> {
    try {
      const response = await api.delete(
        `/users/${directorId}`
      );

      if (response.data?.success === false) {
        throw new Error(
          response.data?.message ||
            "Impossible de désactiver le directeur"
        );
      }
    } catch (error) {
      handleApiError(
        error,
        "Impossible de désactiver le directeur"
      );
    }
  },

  /**
   * Réactivation directeur
   */
  async reactivateDirector(
    directorId: number
  ): Promise<void> {
    try {
      const response = await api.put(
        `/users/${directorId}`,
        {
          actif: true,
        }
      );

      if (response.data?.success === false) {
        throw new Error(
          response.data?.message ||
            "Impossible de réactiver le directeur"
        );
      }
    } catch (error) {
      handleApiError(
        error,
        "Impossible de réactiver le directeur"
      );
    }
  },
};