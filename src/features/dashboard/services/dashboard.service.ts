import { api } from "../../../lib/axios";

export interface DashboardStats {
  donneurs: number;
  demandes: number;
  centres: number;
  stocks: number;
}

export const dashboardService = {
  async getStats(): Promise<DashboardStats> {
    const [donneurs, demandes, centres, stocks] = await Promise.all([
      api.get("/users"),
      api.get("/dons/demandes"),
      api.get("/centres"),
      api.get("/banque"),
    ]);

    return {
      donneurs: donneurs.data?.data?.length || 0,
      demandes: demandes.data?.data?.length || 0,
      centres: centres.data?.data?.length || 0,
      stocks: stocks.data?.data?.length || 0,
    };
  },
};