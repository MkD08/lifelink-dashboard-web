import { useEffect, useState } from "react";
import StatisticsOverview from "../components/StatisticsOverview";
import DonationsByGroupChart from "../components/DonationsByGroupChart";
import RequestsTrendChart from "../components/RequestsTrendChart";
import { statisticsService } from "../services/statistics.service";
import type { Donor } from "../../donors/types/donor.types";
import type { BloodRequest } from "../../requests/types/request.types";
import type { BloodStock } from "../../stocks/types/stock.types";

export default function StatisticsPage() {
  const [donors, setDonors] = useState<Donor[]>([]);
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [stocks, setStocks] = useState<BloodStock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadStatistics = async () => {
      setLoading(true);
      setError("");

      try {
        const result = await statisticsService.getDashboardStatistics();
        setDonors(result.donors);
        setRequests(result.requests);
        setStocks(result.stocks);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Impossible de charger les statistiques");
        }
      } finally {
        setLoading(false);
      }
    };

    loadStatistics();
  }, []);

  if (loading) {
    return (
      <div className="rounded-[24px] border border-slate-200 bg-white dark:bg-slate-900 p-10 text-center shadow-md">
        <p className="text-slate-500">Chargement des statistiques...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-[24px] border border-red-200 bg-red-50 p-6 shadow-md">
        <p className="font-semibold text-red-700">{error}</p>
      </div>
    );
  }

  const overview = statisticsService.getOverviewStats(donors, requests, stocks);
  const donorsByGroup = statisticsService.buildDonorsByGroup(donors);
  const requestsTrend = statisticsService.buildRequestsTrend(requests);

  return (
    <div className="space-y-6">
      <div className="rounded-[24px] border border-slate-200 bg-white dark:bg-slate-900 p-6 shadow-md">
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Statistiques</h2>
        <p className="mt-2 text-slate-500">
          Vue analytique de la plateforme LifeLink.
        </p>
      </div>

      <StatisticsOverview {...overview} />

      <div className="grid gap-6 xl:grid-cols-2">
        <DonationsByGroupChart data={donorsByGroup} />
        <RequestsTrendChart data={requestsTrend} />
      </div>
    </div>
  );
}