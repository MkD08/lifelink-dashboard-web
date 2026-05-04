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
  const [filter, setFilter] = useState<"all" | "urgent" | "warning" | "info">("all");

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
      <div className="rounded-[24px] bg-white dark:bg-slate-900 p-6 shadow-md border flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold">Alertes système</h2>
          <p className="text-slate-500">
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow border">
          <p className="text-slate-500">Total</p>
          <h3 className="text-2xl font-bold">{stats.total}</h3>
        </div>

        <div className="bg-red-50 p-4 rounded-2xl border border-red-100">
          <p className="text-red-600">Urgent</p>
          <h3 className="text-2xl font-bold text-red-600">{stats.urgent}</h3>
        </div>

        <div className="bg-yellow-50 p-4 rounded-2xl border border-yellow-100">
          <p className="text-yellow-700">Warning</p>
          <h3 className="text-2xl font-bold text-yellow-700">{stats.warning}</h3>
        </div>

        <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
          <p className="text-blue-700">Info</p>
          <h3 className="text-2xl font-bold text-blue-700">{stats.info}</h3>
        </div>
      </div>

      {/* FILTERS */}
      <div className="flex flex-col md:flex-row gap-3">

        <input
          className="border rounded-2xl px-4 py-2 flex-1"
          placeholder="Rechercher alerte..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border rounded-2xl px-4 py-2"
          value={filter}
          onChange={(e) => setFilter(e.target.value as any)}
        >
          <option value="all">Tous</option>
          <option value="urgent">Urgent</option>
          <option value="warning">Warning</option>
          <option value="info">Info</option>
        </select>

      </div>

      {/* LIST */}
      {loading ? (
        <div className="bg-white dark:bg-slate-900 p-10 rounded-2xl text-center shadow">
          Chargement...
        </div>
      ) : filteredAlerts.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 p-10 rounded-2xl text-center shadow">
          Aucune alerte trouvée
        </div>
      ) : (
        <div className="space-y-3">

          {filteredAlerts.map((a) => (
            <div
              key={a.id_alerte}
              className="bg-white dark:bg-slate-900 border rounded-2xl p-4 flex justify-between shadow-sm"
            >

              {/* LEFT */}
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white">{a.titre}</h3>

                <p className="text-sm text-slate-500 mt-1">
                  {a.message}
                </p>

                <div className="text-xs text-slate-400 mt-2">
                 {a.centre?.nom ?? "Sans centre"} • {a.ville} • {a.groupe_sanguin}
                </div>
              </div>

              {/* RIGHT */}
              <span className={`h-fit px-3 py-1 rounded-full text-xs font-bold ${badge(a.type)}`}>
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