import type { Donor } from "../../donors/types/donor.types";
import type { BloodRequest } from "../../requests/types/request.types";
import type { BloodStock } from "../../stocks/types/stock.types";
import { donorsService } from "../../donors/services/donors.service";
import { requestsService } from "../../requests/services/requests.service";
import { stocksService } from "../../stocks/services/stocks.service";

export const statisticsService = {
  async getDashboardStatistics() {
    const [donors, requests, stocks] = await Promise.all([
      donorsService.getAllDonors(),
      requestsService.getAllRequests(),
      stocksService.getAllStocks(),
    ]);

    return {
      donors,
      requests,
      stocks,
    };
  },

  buildDonorsByGroup(donors: Donor[]) {
    const map = new Map<string, number>();

    donors.forEach((donor) => {
      const group = donor.groupe_sanguin || "Non défini";
      map.set(group, (map.get(group) || 0) + 1);
    });

    return Array.from(map.entries()).map(([group, count]) => ({
      group,
      count,
    }));
  },

  buildRequestsTrend(requests: BloodRequest[]) {
    const map = new Map<string, number>();

    requests.forEach((request) => {
      const date = new Date(request.date_creation).toLocaleDateString("fr-FR");
      map.set(date, (map.get(date) || 0) + 1);
    });

    return Array.from(map.entries()).map(([date, count]) => ({
      date,
      count,
    }));
  },

  getOverviewStats(
    donors: Donor[],
    requests: BloodRequest[],
    stocks: BloodStock[]
  ) {
    return {
      totalDonors: donors.length,
      verifiedDonors: donors.filter(
        (donor) => donor.statut_groupe_sanguin === "verifie"
      ).length,
      totalRequests: requests.length,
      totalStock: stocks.reduce((sum, stock) => sum + stock.quantite, 0),
    };
  },
};