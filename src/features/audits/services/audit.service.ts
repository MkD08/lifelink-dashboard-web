import { api } from "../../../lib/axios";
import type { AuditLog } from "../types/audit.types";

export const auditService = {
  async getAllLogs(): Promise<AuditLog[]> {
    const response = await api.get("/audit");

    return response.data.data;
  },
};