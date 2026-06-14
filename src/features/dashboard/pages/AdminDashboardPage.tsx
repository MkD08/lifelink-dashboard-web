import { useEffect, useState } from "react";
import {
  Building2,
  Droplets,
  FileText,
  Users,
  Activity,
} from "lucide-react";

import { dashboardService } from "../services/dashboard.service";
import { useToast } from "../../auth/store/toast.store";
import { useNavigate } from "react-router-dom";
import { requestsService } from "../../requests/services/requests.service";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    donneurs: 0,
    demandes: 0,
    centres: 0,
    stocks: 0,
  });

  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const { showToast } = useToast();
  const navigate = useNavigate();

  const load = async () => {
    try {
      setLoading(true);

      const data = await dashboardService.getStats();
      setStats(data);

      const reqs = await requestsService.getAllRequests();
      setRequests(reqs);
    } catch (err) {
      showToast(
        err instanceof Error
          ? err.message
          : "Erreur chargement dashboard",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

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
                  Dashboard Administrateur
                </h2>

                <p className="mt-1 text-slate-500 dark:text-slate-400">
                  Vue globale de la plateforme LifeLink.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 dark:bg-emerald-950/30">
              <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-500" />

              <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
                Système opérationnel
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Donneurs"
          value={stats.donneurs}
          loading={loading}
          icon={<Users size={22} />}
          color="from-cyan-500 to-cyan-600"
        />

        <StatCard
          title="Demandes"
          value={stats.demandes}
          loading={loading}
          icon={<FileText size={22} />}
          color="from-orange-500 to-orange-600"
        />

        <StatCard
          title="Centres"
          value={stats.centres}
          loading={loading}
          icon={<Building2 size={22} />}
          color="from-blue-500 to-blue-600"
        />

        <StatCard
          title="Stocks"
          value={stats.stocks}
          loading={loading}
          icon={<Droplets size={22} />}
          color="from-red-600 to-rose-600"
        />
      </div>

      {/* ACTIONS */}
      <div className="rounded-[28px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-lg">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
          Actions rapides
        </h3>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            onClick={() => navigate("/centres")}
            className="rounded-2xl bg-red-600 px-5 py-3 font-semibold text-white transition hover:bg-red-700"
          >
            Gérer centres
          </button>

          <button
            onClick={() => navigate("/admin/users")}
            className="rounded-2xl border border-slate-300 dark:border-slate-700 px-5 py-3 font-semibold text-slate-700 dark:text-slate-300 transition hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            Gérer utilisateurs
          </button>

          <button
            onClick={() => navigate("/requests")}
            className="rounded-2xl border border-slate-300 dark:border-slate-700 px-5 py-3 font-semibold text-slate-700 dark:text-slate-300 transition hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            Voir demandes
          </button>
        </div>
      </div>

      {/* ACTIVITÉ */}
      <div className="rounded-[28px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-lg">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
          Activité récente
        </h3>

        {loading ? (
          <p className="mt-4 text-slate-500">
            Chargement...
          </p>
        ) : requests.length === 0 ? (
          <p className="mt-4 text-slate-500">
            Aucune activité disponible
          </p>
        ) : (
          <div className="mt-6 space-y-3">
            {requests.slice(0, 5).map((req) => (
              <div
                key={req.id_demande}
                className="flex items-center justify-between rounded-2xl border border-slate-200 dark:border-slate-700 px-4 py-4"
              >
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">
                    {req.groupe_sanguin} - {req.ville}
                  </p>

                  <p className="text-sm text-slate-500">
                    {new Date(
                      req.date_creation
                    ).toLocaleDateString()}
                  </p>
                </div>

                <span
                  className={`rounded-xl px-3 py-1 text-sm font-semibold ${
                    req.statut === "satisfaite"
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                  }`}
                >
                  {req.statut}
                </span>
              </div>
            ))}
          </div>
        )}
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