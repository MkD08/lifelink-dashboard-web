import { useEffect, useState } from "react";

import { Activity } from "lucide-react";

import { useAuth } from "../../auth/store/auth.store";

import StatisticsOverview from "../components/StatisticsOverview";

import StockChart from "../../../components/charts/StockChart";
import DonationsChart from "../../../components/charts/DonationsChart";
import DonationsTrendChart from "../../../components/charts/DonationsTrendChart";
import RequestsChart from "../../../components/charts/RequestsChart";

import {
  statisticsService,
  type AdminStatistics,
  type CentreStatistics,
  type StatisticsCharts,
} from "../services/statistics.service";

type StatisticsData =
  | AdminStatistics
  | CentreStatistics;

export default function StatisticsPage() {
  const { user } = useAuth();

  const [statistics, setStatistics] =
    useState<StatisticsData | null>(null);

  const [charts, setCharts] =
    useState<StatisticsCharts | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const isAdmin =
    user?.role_id === 1;

  useEffect(() => {
    const loadStatistics = async () => {
      try {
        setLoading(true);
        setError("");

        const [
          statisticsData,
          chartsData,
        ] = await Promise.all([
          isAdmin
            ? statisticsService.getAdminStatistics()
            : statisticsService.getCentreStatistics(),

          isAdmin
            ? statisticsService.getAdminCharts()
            : statisticsService.getCentreCharts(),
        ]);

        setStatistics(
          statisticsData
        );

        setCharts(
          chartsData
        );
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError(
            "Impossible de charger les statistiques"
          );
        }
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadStatistics();
    }
  }, [user, isAdmin]);

  if (loading) {
    return (
      <div className="rounded-[28px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-12 shadow-lg">
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-red-200 border-t-red-600" />

          <p className="text-slate-500 dark:text-slate-400">
            Chargement des statistiques...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-[28px] border border-red-200 bg-red-50 p-6 shadow-lg dark:border-red-900 dark:bg-red-950/20">
        <p className="font-semibold text-red-700 dark:text-red-400">
          {error}
        </p>
      </div>
    );
  }

  if (!statistics) {
    return null;
  }

  return (
    <div className="space-y-8">
      <div className="overflow-hidden rounded-[32px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-lg">
        <div className="h-1 bg-gradient-to-r from-red-600 via-red-500 to-rose-500" />

        <div className="p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 dark:bg-red-950/30">
                  <Activity
                    size={24}
                    className="text-red-600"
                  />
                </div>

                <div>
                  <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                    Tableau de bord analytique
                  </h2>

                  <p className="mt-1 text-slate-500 dark:text-slate-400">
                    Vue globale des dons, stocks sanguins,
                    collectes et demandes LifeLink.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 dark:bg-emerald-950/30">
              <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-500" />

              <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
                Données synchronisées
              </span>
            </div>
          </div>
        </div>
      </div>

      {isAdmin ? (
        <StatisticsOverview
          type="admin"
          {...(statistics as AdminStatistics)}
        />
      ) : (
        <StatisticsOverview
          type="centre"
          {...(statistics as CentreStatistics)}
        />
      )}

      {charts && (
        <>
          <div className="grid gap-6 xl:grid-cols-2">
            <StockChart
              data={charts.bloodStock}
            />

            <DonationsChart
              data={charts.donationsByGroup}
            />
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            <DonationsTrendChart
              data={charts.donationsTrend}
            />

            <RequestsChart
              data={charts.requestsTrend}
            />
          </div>
        </>
      )}
    </div>
  );
}