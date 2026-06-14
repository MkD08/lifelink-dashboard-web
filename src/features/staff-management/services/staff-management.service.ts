import { AxiosError } from "axios";
import { api } from "../../../lib/axios";

import type {
  CreateStaffPayload,
  CreateStaffResponse,
} from "../types/staff-management.types";

const handleError = (
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

export const staffManagementService = {
  /**
   * Création staff
   */
  async createStaff(
    payload: CreateStaffPayload
  ): Promise<void> {
    try {
      const response =
        await api.post<CreateStaffResponse>(
          "/users/director/create-staff",
          payload
        );

      if (
        response.data?.success === false
      ) {
        throw new Error(
          response.data?.message ||
            "Impossible de créer le staff"
        );
      }
    } catch (error) {
      handleError(
        error,
        "Impossible de créer le staff"
      );
    }
  },

  /**
   * Liste des staffs
   */
  async getStaffs() {
    try {
      const response = await api.get(
        "/users/director/staffs"
      );

      if (
        response.data?.success === false
      ) {
        throw new Error(
          response.data?.message ||
            "Impossible de charger les staffs"
        );
      }

      return response.data.data ?? [];
    } catch (error) {
      handleError(
        error,
        "Impossible de charger les staffs"
      );
    }
  },

  /**
   * Modifier staff
   */
  async updateStaff(
    staffId: number,
    payload: Partial<CreateStaffPayload>
  ): Promise<void> {
    try {
      const response =
        await api.put(
          `/users/director/staffs/${staffId}`,
          payload
        );

      if (
        response.data?.success === false
      ) {
        throw new Error(
          response.data?.message ||
            "Impossible de modifier le staff"
        );
      }
    } catch (error) {
      handleError(
        error,
        "Impossible de modifier le staff"
      );
    }
  },

  /**
   * Désactiver staff
   */
  async disableStaff(
    staffId: number
  ): Promise<void> {
    try {
      const response =
        await api.patch(
          `/users/director/staffs/${staffId}/disable`
        );

      if (
        response.data?.success === false
      ) {
        throw new Error(
          response.data?.message ||
            "Impossible de désactiver le staff"
        );
      }
    } catch (error) {
      handleError(
        error,
        "Impossible de désactiver le staff"
      );
    }
  },

  /**
   * Réactiver staff
   */
  async enableStaff(
    staffId: number
  ): Promise<void> {
    try {
      const response =
        await api.patch(
          `/users/director/staffs/${staffId}/enable`
        );

      if (
        response.data?.success === false
      ) {
        throw new Error(
          response.data?.message ||
            "Impossible de réactiver le staff"
        );
      }
    } catch (error) {
      handleError(
        error,
        "Impossible de réactiver le staff"
      );
    }
  },
};