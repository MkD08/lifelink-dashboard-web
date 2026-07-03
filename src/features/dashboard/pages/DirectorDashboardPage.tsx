import { useEffect, useState } from "react";
import {
  Activity,
  AlertTriangle,
  Building2,
  Users,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import { useToast } from "../../auth/store/toast.store";
import { useAuth } from "../../auth/store/auth.store";

import {
  statisticsService,
  type CentreStatistics,
} from "../../statistics/services/statistics.service";

export default function DirectorDashboardPage() {
  const [loading, setLoading] =
    useState(true);

  const [stats, setStats] =
    useState<CentreStatistics | null>(
      null
    );

  const { showToast } = useToast();

  const { user } = useAuth();

  const navigate = useNavigate();

  const load = async () => {
    try {
      setLoading(true);

      const data =
        await statisticsService.getCentreStatistics();

      setStats(data);
    } catch (err) {
      showToast(
        err instanceof Error
          ? err.message
          : "Erreur chargement dashboard directeur",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (!stats && !loading) {
    return null;
  }

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="overflow-hidden rounded-[32px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-lg">
        <div className="h-1 bg-gradient-to-r from-red-600 via-red-500 to-rose-500" />

        <div className="p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 dark:bg-red-950/30">
                <Activity
                  size={28}
                  className="text-red-600"
                />
              </div>

              <div>
                <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                Tableau de bord Directeur
                </h2>

                <p className="mt-1 text-slate-500 dark:text-slate-400">
                  Supervision globale du centre
                  et pilotage des activités.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 dark:bg-emerald-950/30">
              <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-500" />

              <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
                Centre opérationnel
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Staff actifs"
          value={stats?.totalStaff ?? 0}
          loading={loading}
          color="from-blue-500 to-blue-600"
          icon={<Users size={22} />}
        />

        <StatCard
          title="Donneurs"
          value={stats?.totalDonors ?? 0}
          loading={loading}
          color="from-cyan-500 to-cyan-600"
          icon={<Users size={22} />}
        />

        <StatCard
          title="Demandes"
          value={stats?.totalDemandes ?? 0}
          loading={loading}
          color="from-orange-500 to-orange-600"
          icon={<Activity size={22} />}
        />

        <StatCard
          title="Stocks critiques"
          value={
            stats?.totalStocksCritiques ??
            0
          }
          loading={loading}
          color="from-red-500 to-red-600"
          icon={
            <AlertTriangle size={22} />
          }
        />
      </div>

      {/* ACTIONS */}
      <div className="rounded-[28px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-lg">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
          Actions rapides
        </h3>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            onClick={() =>
              navigate("/staff")
            }
            className="rounded-2xl bg-red-600 px-5 py-3 font-semibold text-white transition hover:bg-red-700"
          >
            Gérer le staff
          </button>

          <button
            onClick={() =>
              navigate("/requests")
            }
            className="rounded-2xl border border-slate-300 dark:border-slate-700 px-5 py-3 font-semibold text-slate-700 dark:text-slate-300 transition hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            Voir demandes
          </button>

          <button
            onClick={() =>
              navigate("/stocks")
            }
            className="rounded-2xl border border-slate-300 dark:border-slate-700 px-5 py-3 font-semibold text-slate-700 dark:text-slate-300 transition hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            Voir stocks
          </button>
        </div>
      </div>

      {/* INFOS CENTRE */}
      <div className="rounded-[28px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-lg">
        <div className="flex items-center gap-3">
          <Building2 className="text-red-600" />

          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            Informations du centre
          </h3>
        </div>

        <div className="mt-6 space-y-3 text-sm">
          <p className="text-slate-600 dark:text-slate-300">
            <span className="font-semibold">
              Centre :
            </span>{" "}
            {user?.centre_sante?.nom ||
              "—"}
          </p>

          <p className="text-slate-600 dark:text-slate-300">
            <span className="font-semibold">
              Ville :
            </span>{" "}
            {user?.centre_sante?.ville ||
              "—"}
          </p>

          <p className="text-slate-600 dark:text-slate-300">
            <span className="font-semibold">
              Adresse :
            </span>{" "}
            {user?.centre_sante?.adresse ||
              "—"}
          </p>
        </div>
      </div>
    </div>
  );
}

type StatCardProps = {
  title: string;
  value: number;
  loading: boolean;
  icon: React.ReactNode;
  color: string;
};

function StatCard({
  title,
  value,
  loading,
  icon,
  color,
}: StatCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-[28px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
      <div
        className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${color}`}
      />

      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {title}
          </p>

          <h3 className="mt-3 text-4xl font-black tracking-tight text-slate-900 dark:text-white">
            {loading
              ? "..."
              : value.toLocaleString()}
          </h3>
        </div>

        <div
          className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${color} text-white shadow-lg`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}