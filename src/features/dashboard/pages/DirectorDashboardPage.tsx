import { useEffect, useState } from "react";
import { statisticsService } from "../../statistics/services/statistics.service";
import { useToast } from "../../auth/store/toast.store";
import { useAuth } from "../../auth/store/auth.store";
import { useNavigate } from "react-router-dom";

export default function DirectorDashboardPage() {
  const [stats, setStats] = useState([
    { title: "Staff actifs", value: 0 },
    { title: "Demandes du centre", value: 0 },
    { title: "Stocks critiques", value: 0 },
  ]);

  const [loading, setLoading] = useState(true);

  const { showToast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [requests, setRequests] = useState<any[]>([]);

  // ==============================
  // 🔥 LOAD DATA
  // ==============================
  const loadStats = async () => {
    try {
      setLoading(true);

      const { donors, requests, stocks } =
        await statisticsService.getDashboardStatistics();

      const centreId = user?.centre_id;

      // 🔥 STAFF
      const staffCount = donors.filter(
        (u: any) =>
          u.role_id === 3 &&
          u.centre_id === centreId &&
          u.actif === true
      ).length;

      // 🔥 DEMANDES
      const demandesCentre = requests.filter(
        (r: any) => r.centre_id === centreId
      );

      // 🔥 STOCK
      const stocksCritiques = stocks.filter(
        (s: any) =>
          s.centre_id === centreId &&
          s.quantite < 5
      ).length;

      setStats([
        { title: "Staff actifs", value: staffCount },
        { title: "Demandes du centre", value: demandesCentre.length },
        { title: "Stocks critiques", value: stocksCritiques },
      ]);

      setRequests(demandesCentre);
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
    loadStats();
  }, []);

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="rounded-[24px] border border-slate-200 bg-white dark:bg-slate-900 p-6 shadow-md">
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
          Dashboard Directeur
        </h2>
        <p className="mt-2 text-slate-500">
          Supervision globale du centre et prise de décision.
        </p>
      </div>

      {/* STATS */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="rounded-[24px] bg-white dark:bg-slate-900 p-5 shadow-md border border-slate-200"
          >
            <p className="text-sm text-slate-500">{stat.title}</p>

            <h3 className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white">
              {loading ? "..." : stat.value}
            </h3>
          </div>
        ))}
      </div>

      {/* ACTIONS RAPIDES */}
      <div className="rounded-[24px] border border-slate-200 bg-white dark:bg-slate-900 p-6 shadow-md">
        <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
          Actions rapides
        </h3>

        <div className="mt-4 flex flex-wrap gap-3">

          <button
            onClick={() => navigate("/staff")}
            className="rounded-2xl bg-red-600 px-4 py-3 font-bold text-white hover:bg-red-700"
          >
            Gérer le staff
          </button>

          <button
            onClick={() => navigate("/requests")}
            className="rounded-2xl border border-slate-300 px-4 py-3 font-semibold text-slate-700 hover:bg-slate-50"
          >
            Voir demandes
          </button>

          <button
            onClick={() => navigate("/stocks")}
            className="rounded-2xl border border-slate-300 px-4 py-3 font-semibold text-slate-700 hover:bg-slate-50"
          >
            Voir stocks
          </button>

        </div>
      </div>

      {/* DEMANDES RÉCENTES DU CENTRE */}
      <div className="rounded-[24px] border border-slate-200 bg-white dark:bg-slate-900 p-6 shadow-md">
        <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
          Demandes récentes du centre
        </h3>

        {loading ? (
          <p className="mt-4 text-slate-500">Chargement...</p>
        ) : requests.length === 0 ? (
          <p className="mt-4 text-slate-500">
            Aucune demande disponible
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

      {/* INFOS CENTRE */}
      <div className="rounded-[24px] border border-slate-200 bg-white dark:bg-slate-900 p-6 shadow-md">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          Informations du centre
        </h3>

        <div className="mt-4 space-y-2 text-sm text-slate-600">
          <p>
            <span className="font-semibold">Centre :</span>{" "}
            {user?.centre_sante?.nom || "—"}
          </p>

          <p>
            <span className="font-semibold">Ville :</span>{" "}
            {user?.centre_sante?.ville || "—"}
          </p>

          <p>
            <span className="font-semibold">Adresse :</span>{" "}
            {user?.centre_sante?.adresse || "—"}
          </p>
        </div>
      </div>

    </div>
  );
}