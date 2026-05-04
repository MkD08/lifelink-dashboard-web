import { AxiosError } from "axios";

import { api } from "../../../lib/axios";

import type {
  AdminUser,
  AdminUsersApiResponse,
  UpdateAdminUserPayload,
} from "../types/admin-user.types";

/**
 * Gestion centralisée des erreurs API
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

export const adminUsersService = {
  /**
   * Liste complète utilisateurs
   */
  async getAllUsers(): Promise<AdminUser[]> {
    try {
      const response =
        await api.get<AdminUsersApiResponse>("/users");

      if (response.data?.success === false) {
        throw new Error(
          response.data?.message ||
            "Impossible de charger les utilisateurs"
        );
      }

      return response.data.data ?? [];
    } catch (error) {
      handleApiError(
        error,
        "Impossible de charger les utilisateurs"
      );
    }
  },

  /**
   * Détails utilisateur
   */
  async getUserById(userId: number): Promise<AdminUser> {
    try {
      const response = await api.get(`/users/${userId}`);

      if (response.data?.success === false) {
        throw new Error(
          response.data?.message ||
            "Impossible de charger l'utilisateur"
        );
      }

      return response.data.data;
    } catch (error) {
      handleApiError(
        error,
        "Impossible de charger l'utilisateur"
      );
    }
  },

  /**
   * Modifier utilisateur
   */
  async updateUser(
    userId: number,
    payload: UpdateAdminUserPayload
  ): Promise<void> {
    try {
      const response = await api.put(
        `/users/${userId}`,
        payload
      );

      if (response.data?.success === false) {
        throw new Error(
          response.data?.message ||
            "Impossible de modifier l'utilisateur"
        );
      }
    } catch (error) {
      handleApiError(
        error,
        "Impossible de modifier l'utilisateur"
      );
    }
  },

  /**
   * Désactiver utilisateur (soft delete)
   */
  async deleteUser(userId: number): Promise<void> {
    try {
      const response = await api.delete(`/users/${userId}`);

      if (response.data?.success === false) {
        throw new Error(
          response.data?.message ||
            "Impossible de désactiver l'utilisateur"
        );
      }
    } catch (error) {
      handleApiError(
        error,
        "Impossible de désactiver l'utilisateur"
      );
    }
  },

  /**
   * Réactiver utilisateur
   */
  async reactivateUser(userId: number): Promise<void> {
    try {
      const response = await api.put(`/users/${userId}`, {
        actif: true,
      });

      if (response.data?.success === false) {
        throw new Error(
          response.data?.message ||
            "Impossible de réactiver l'utilisateur"
        );
      }
    } catch (error) {
      handleApiError(
        error,
        "Impossible de réactiver l'utilisateur"
      );
    }
  },
};