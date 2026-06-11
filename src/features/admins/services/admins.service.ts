import { AxiosError } from "axios";
import { api } from "../../../lib/axios";

import type {
  Admin,
  AdminApiResponse,
  AdminDetailsApiResponse,
  CreateAdminPayload,
  UpdateAdminPayload,
  UpdateAdminProfilePayload,
  ChangeAdminPasswordPayload,
} from "../types/admin.types";

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

export const adminsService = {
  /**
   * Liste admins
   */
  async getAllAdmins(): Promise<Admin[]> {
    try {
      const response =
        await api.get<AdminApiResponse>(
          "/users/admins"
        );

      if (response.data?.success === false) {
        throw new Error(
          response.data?.message ||
            "Impossible de charger les administrateurs"
        );
      }

      return response.data.data ?? [];
    } catch (error) {
      handleApiError(
        error,
        "Impossible de charger les administrateurs"
      );

      return [];
    }
  },

  /**
   * Détail admin
   */
  async getAdminById(
    adminId: number
  ): Promise<Admin> {
    try {
      const response =
        await api.get<AdminDetailsApiResponse>(
          `/users/admins/${adminId}`
        );

      if (response.data?.success === false) {
        throw new Error(
          response.data?.message ||
            "Impossible de charger l'administrateur"
        );
      }

      return response.data.data;
    } catch (error) {
      handleApiError(
        error,
        "Impossible de charger l'administrateur"
      );

      throw error;
    }
  },

  /**
   * Création admin
   */
  async createAdmin(
    payload: CreateAdminPayload
  ): Promise<void> {
    try {
      const response =
        await api.post(
          "/users/admins",
          payload
        );

      if (response.data?.success === false) {
        throw new Error(
          response.data?.message ||
            "Impossible de créer l'administrateur"
        );
      }
    } catch (error) {
      handleApiError(
        error,
        "Impossible de créer l'administrateur"
      );
    }
  },

  /**
   * Modifier admin
   */
  async updateAdmin(
    adminId: number,
    payload: UpdateAdminPayload
  ): Promise<void> {
    try {
      const response =
        await api.put(
          `/users/admins/${adminId}`,
          payload
        );

      if (response.data?.success === false) {
        throw new Error(
          response.data?.message ||
            "Impossible de modifier l'administrateur"
        );
      }
    } catch (error) {
      handleApiError(
        error,
        "Impossible de modifier l'administrateur"
      );
    }
  },

  /**
   * Désactiver admin
   */
  async disableAdmin(
    adminId: number
  ): Promise<void> {
    try {
      const response =
        await api.patch(
          `/users/admins/${adminId}/disable`
        );

      if (response.data?.success === false) {
        throw new Error(
          response.data?.message ||
            "Impossible de désactiver l'administrateur"
        );
      }
    } catch (error) {
      handleApiError(
        error,
        "Impossible de désactiver l'administrateur"
      );
    }
  },

  /**
   * Réactiver admin
   */
  async enableAdmin(
    adminId: number
  ): Promise<void> {
    try {
      const response =
        await api.patch(
          `/users/admins/${adminId}/enable`
        );

      if (response.data?.success === false) {
        throw new Error(
          response.data?.message ||
            "Impossible de réactiver l'administrateur"
        );
      }
    } catch (error) {
      handleApiError(
        error,
        "Impossible de réactiver l'administrateur"
      );
    }
  },

  /**
   * Mon profil admin
   */
  async updateMyProfile(
    payload: UpdateAdminProfilePayload
  ): Promise<void> {
    try {
      const response =
        await api.put(
          "/users/admin/profile",
          payload
        );

      if (response.data?.success === false) {
        throw new Error(
          response.data?.message ||
            "Impossible de modifier le profil"
        );
      }
    } catch (error) {
      handleApiError(
        error,
        "Impossible de modifier le profil"
      );
    }
  },

  /**
   * Mot de passe admin
   */
  async changePassword(
    payload: ChangeAdminPasswordPayload
  ): Promise<void> {
    try {
      const response =
        await api.put(
          "/users/admin/change-password",
          payload
        );

      if (response.data?.success === false) {
        throw new Error(
          response.data?.message ||
            "Impossible de modifier le mot de passe"
        );
      }
    } catch (error) {
      handleApiError(
        error,
        "Impossible de modifier le mot de passe"
      );
    }
  },

 /**
 * Profil admin connecté
 */
async getMyProfile(): Promise<Admin> {
    try {
      const response =
        await api.get("/users/me");
  
      if (response.data?.success === false) {
        throw new Error(
          response.data?.message ||
          "Impossible de récupérer le profil"
        );
      }
  
      return response.data.data;
    } catch (error) {
      handleApiError(
        error,
        "Impossible de récupérer le profil"
      );
  
      throw error;
    }
  }, 
};