import { AxiosError } from "axios";
import { api } from "../../../lib/axios";
import type {
  CreateStaffPayload,
  CreateStaffResponse,
} from "../types/staff-management.types";

export const staffManagementService = {
  async createStaff(payload: CreateStaffPayload): Promise<void> {
    try {
      const response = await api.post<CreateStaffResponse>(
        "/users/director/create-staff",
        payload
      );

      if (response.data?.success === false) {
        throw new Error(
          response.data?.message || "Impossible de créer le staff"
        );
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(
          error.response?.data?.message ||
            error.message ||
            "Impossible de créer le staff"
        );
      }

      if (error instanceof Error) {
        throw error;
      }

      throw new Error("Impossible de créer le staff");
    }
  },
};