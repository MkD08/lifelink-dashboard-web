import { api } from "../../../lib/axios";

export interface AdminStatistics {
  totalCentres: number;
  totalDonors: number;
  totalDons: number;
  totalDemandes: number;
  totalCollectes: number;
  totalAlertes: number;
  totalParticipations: number;
  totalStock: number;
}

export interface CentreStatistics {
  totalDonors: number;
  verifiedUsers: number;
  totalDons: number;
  totalDemandes: number;
  totalCollectes: number;
  totalAlertes: number;
  totalParticipations: number;
  totalStock: number;
  totalStaff: number;
  totalStocksCritiques: number;
}

export interface StatisticsCharts {
  bloodStock: {
    group: string;
    quantity: number;
  }[];

  donationsByGroup: {
    group: string;
    count: number;
  }[];

  donationsTrend: {
    month: string;
    count: number;
  }[];

  requestsTrend: {
    month: string;
    count: number;
  }[];
}

export const statisticsService = {
  async getAdminStatistics(): Promise<AdminStatistics> {
    const response = await api.get("/statistics/admin");

    return response.data.data;
  },

  async getCentreStatistics(): Promise<CentreStatistics> {
    const response = await api.get("/statistics/centre");

    return response.data.data;
  },

  async getAdminCharts(): Promise<StatisticsCharts> {
    const response = await api.get(
      "/statistics/admin/charts"
    );
  
    return response.data.data;
  },
  
  async getCentreCharts(): Promise<StatisticsCharts> {
    const response = await api.get(
      "/statistics/centre/charts"
    );
  
    return response.data.data;
  }
};
