import { useEffect, useState } from "react";
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

  // ==============================
  // 🔥 LOAD DATA
  // ==============================
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
    <div className="space-y-6">

      {/* HEADER */}
      <div className="rounded-[24px] border border-slate-200 bg-white dark:bg-slate-900 p-6 shadow-md">
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
          Dashboard Admin
        </h2>
        <p className="mt-2 text-slate-500">
          Vue globale de toute la plateforme.
        </p>
      </div>

      {/* STATS */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <Card title="Donneurs" value={stats.donneurs} loading={loading} />
        <Card title="Demandes" value={stats.demandes} loading={loading} />
        <Card title="Centres" value={stats.centres} loading={loading} />
        <Card title="Stocks" value={stats.stocks} loading={loading} />

      </div>

      {/* ACTIONS RAPIDES */}
      <div className="rounded-[24px] border border-slate-200 bg-white dark:bg-slate-900 p-6 shadow-md">
        <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
          Actions rapides
        </h3>

        <div className="mt-4 flex flex-wrap gap-3">

          <button
            onClick={() => navigate("/centres")}
            className="rounded-2xl bg-red-600 px-4 py-3 font-bold text-slate-900 dark:text-white hover:bg-red-700"
          >
            Gérer centres
          </button>

          <button
            onClick={() => navigate("/admin/users")}
            className="rounded-2xl border border-slate-300 px-4 py-3 font-semibold text-slate-700 hover:bg-slate-50"
          >
            Gérer utilisateurs
          </button>

          <button
            onClick={() => navigate("/requests")}
            className="rounded-2xl border border-slate-300 px-4 py-3 font-semibold text-slate-700 hover:bg-slate-50"
          >
            Voir demandes
          </button>

        </div>
      </div>

      {/* ACTIVITÉ RÉCENTE */}
      <div className="rounded-[24px] border border-slate-200 bg-white dark:bg-slate-900 p-6 shadow-md">
        <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
          Activité récente
        </h3>

        {loading ? (
          <p className="mt-4 text-slate-500">Chargement...</p>
        ) : requests.length === 0 ? (
          <p className="mt-4 text-slate-500">
            Aucune activité disponible
          </p>
        ) : (
          <div className="mt-4 space-y-3">

            {requests.slice(0, 5).map((req) => (
              <div
                key={req.id_demande}
                className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3"
              >
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">
                    {req.groupe_sanguin} - {req.ville}
                  </p>
                  <p className="text-sm text-slate-500">
                    {new Date(req.date_creation).toLocaleDateString()}
                  </p>
                </div>

                <span
                  className={`rounded-xl px-3 py-1 text-sm font-semibold ${
                    req.statut === "satisfaite"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
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

// ==============================
// 🔥 CARD COMPONENT
// ==============================
function Card({ title, value, loading }: any) {
  return (
    <div className="rounded-[24px] bg-white dark:bg-slate-900 p-5 shadow-md border border-slate-200">
      <p className="text-sm text-slate-500">{title}</p>

      <h3 className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white">
        {loading ? "..." : value}
      </h3>
    </div>
  );
}