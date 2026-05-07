import { useEffect, useMemo, useState } from "react";
import { alertsService } from "../services/alerts.service";
import type { Alert } from "../services/alerts.service";
import { useToast } from "../../auth/store/toast.store";
import CreateAlertModal from "../components/CreateAlertModal";

export default function AlertsPage() {
  const { showToast } = useToast();

  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<
    "all" | "urgent" | "warning" | "info"
  >("all");

  const [openCreate, setOpenCreate] = useState(false);

  // =========================
  // LOAD ALERTS
  // =========================
  const loadAlerts = async () => {
    try {
      setLoading(true);

      console.log("📡 Loading alerts...");

      const data = await alertsService.getAllAlerts();

      console.log("✅ Alerts loaded:", data);

      setAlerts(data);
    } catch (err) {
      console.error("❌ ALERT LOAD ERROR:", err);
      showToast("Erreur chargement alertes", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAlerts();
  }, []);

  // =========================
  // FILTER + SEARCH
  // =========================
  const filteredAlerts = useMemo(() => {
    return alerts.filter((a) => {
      const matchType = filter === "all" || a.type === filter;

      const matchSearch =
        a.titre.toLowerCase().includes(search.toLowerCase()) ||
        a.message.toLowerCase().includes(search.toLowerCase()) ||
        a.ville.toLowerCase().includes(search.toLowerCase()) ||
        a.groupe_sanguin.toLowerCase().includes(search.toLowerCase());

      return matchType && matchSearch;
    });
  }, [alerts, search, filter]);

  // =========================
  // STATS
  // =========================
  const stats = {
    total: alerts.length,
    urgent: alerts.filter((a) => a.type === "urgent").length,
    warning: alerts.filter((a) => a.type === "warning").length,
    info: alerts.filter((a) => a.type === "info").length,
  };

  // =========================
  // UI COLORS
  // =========================
  const badge = (type: string) => {
    if (type === "urgent") return "bg-red-100 text-red-700";
    if (type === "warning") return "bg-yellow-100 text-yellow-700";
    return "bg-blue-100 text-blue-700";
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between rounded-[24px] border border-slate-200 bg-white p-6 shadow-md dark:border-slate-700 dark:bg-slate-900">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Alertes système
          </h2>

          <p className="text-slate-500 dark:text-slate-400">
            Gestion des alertes médicales en temps réel
          </p>
        </div>

        <button
          onClick={() => setOpenCreate(true)}
          className="rounded-2xl bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-700"
        >
          + Créer alerte
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow dark:border-slate-700 dark:bg-slate-900">
          <p className="text-slate-500 dark:text-slate-400">Total</p>

          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
            {stats.total}
          </h3>
        </div>

        <div className="rounded-2xl border border-red-100 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950/40">
          <p className="text-red-600 dark:text-red-400">Urgent</p>

          <h3 className="text-2xl font-bold text-red-600 dark:text-red-400">
            {stats.urgent}
          </h3>
        </div>

        <div className="rounded-2xl border border-yellow-100 bg-yellow-50 p-4 dark:border-yellow-900 dark:bg-yellow-950/40">
          <p className="text-yellow-700 dark:text-yellow-400">Warning</p>

          <h3 className="text-2xl font-bold text-yellow-700 dark:text-yellow-400">
            {stats.warning}
          </h3>
        </div>

        <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950/40">
          <p className="text-blue-700 dark:text-blue-400">Info</p>

          <h3 className="text-2xl font-bold text-blue-700 dark:text-blue-400">
            {stats.info}
          </h3>
        </div>
      </div>

      {/* FILTERS */}
      <div className="flex flex-col gap-3 md:flex-row">
        <input
          className="
            flex-1
            rounded-2xl
            border border-slate-300
            bg-white
            px-4 py-3
            text-slate-900
            outline-none
            focus:border-red-500

            dark:border-slate-700
            dark:bg-slate-800
            dark:text-white
            dark:placeholder:text-slate-400
          "
          placeholder="Rechercher alerte..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="
            rounded-2xl
            border border-slate-300
            bg-white
            px-4 py-3
            text-slate-900
            outline-none
            focus:border-red-500

            dark:border-slate-700
            dark:bg-slate-800
            dark:text-white
          "
          value={filter}
          onChange={(e) => setFilter(e.target.value as any)}
        >
          <option
            value="all"
            className="dark:bg-slate-800 dark:text-white"
          >
            Tous
          </option>

          <option
            value="urgent"
            className="dark:bg-slate-800 dark:text-white"
          >
            Urgent
          </option>

          <option
            value="warning"
            className="dark:bg-slate-800 dark:text-white"
          >
            Warning
          </option>

          <option
            value="info"
            className="dark:bg-slate-800 dark:text-white"
          >
            Info
          </option>
        </select>
      </div>

      {/* LIST */}
      {loading ? (
        <div className="rounded-2xl bg-white p-10 text-center shadow dark:bg-slate-900">
          <p className="text-slate-500 dark:text-slate-400">
            Chargement...
          </p>
        </div>
      ) : filteredAlerts.length === 0 ? (
        <div className="rounded-2xl bg-white p-10 text-center shadow dark:bg-slate-900">
          <p className="text-slate-500 dark:text-slate-400">
            Aucune alerte trouvée
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredAlerts.map((a) => (
            <div
              key={a.id_alerte}
              className="flex justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900"
            >
              {/* LEFT */}
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white">
                  {a.titre}
                </h3>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {a.message}
                </p>

                <div className="mt-2 text-xs text-slate-400 dark:text-slate-500">
                  {a.centre?.nom ?? "Sans centre"} • {a.ville} •{" "}
                  {a.groupe_sanguin}
                </div>
              </div>

              {/* RIGHT */}
              <span
                className={`h-fit rounded-full px-3 py-1 text-xs font-bold ${badge(
                  a.type
                )}`}
              >
                {a.type}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* CREATE MODAL */}
      <CreateAlertModal
        isOpen={openCreate}
        onClose={() => setOpenCreate(false)}
        onSuccess={loadAlerts}
      />
    </div>
  );
}