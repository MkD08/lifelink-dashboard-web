import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { requestsService } from "../../requests/services/requests.service";
import { donorsService } from "../../donors/services/donors.service";

import type { BloodRequest } from "../../requests/types/request.types";
import type { Donor } from "../../donors/types/donor.types";

export default function StaffDashboardPage() {
  const [loading, setLoading] = useState(true);

  const [requests, setRequests] = useState<BloodRequest[]>([]);

  const [stats, setStats] = useState({
    demandesUrgentes: 0,
    donneursDisponibles: 0,
    groupesAVerifier: 0,
  });

  const navigate = useNavigate();

  // ==============================
  // LOAD DATA
  // ==============================
  const load = async () => {
    try {
      setLoading(true);

      const demandes = await requestsService.getAllRequests();
      setRequests(demandes);

      const demandesUrgentes = demandes.filter(
        (d) => d.statut === "EN_ATTENTE"
      ).length;

      let donneursData: Donor[] = [];

      try {
        donneursData = await donorsService.getAllDonors();
        
      } catch {
        donneursData = [];
      }

      const donneursDisponibles = donneursData.length;

      const groupesAVerifier = donneursData.filter(
        (d) => d.statut_groupe_sanguin !== "verifie"
      ).length;

      setStats({
        demandesUrgentes,
        donneursDisponibles,
        groupesAVerifier,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // ==============================
  // 🔥 UI
  // ==============================
  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="rounded-[24px] border border-slate-200 bg-white dark:bg-slate-900 p-6 shadow-md">
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
          Dashboard Staff
        </h2>
        <p className="mt-2 text-slate-500">
          Vue globale des opérations et accès rapide aux actions.
        </p>
      </div>

      {/* STATS */}
      <div className="grid gap-4 md:grid-cols-3">

        <div className="rounded-[24px] bg-white dark:bg-slate-900 p-5 shadow-md border border-slate-200">
          <p className="text-sm text-slate-500">Demandes en attente</p>
          <h3 className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white">
            {loading ? "..." : stats.demandesUrgentes}
          </h3>
        </div>

        <div className="rounded-[24px] bg-white dark:bg-slate-900 p-5 shadow-md border border-slate-200">
          <p className="text-sm text-slate-500">Donneurs disponibles</p>
          <h3 className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white">
            {loading ? "..." : stats.donneursDisponibles}
          </h3>
        </div>

        <div className="rounded-[24px] bg-white dark:bg-slate-900 p-5 shadow-md border border-slate-200">
          <p className="text-sm text-slate-500">Groupes à vérifier</p>
          <h3 className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white">
            {loading ? "..." : stats.groupesAVerifier}
          </h3>
        </div>

      </div>

      {/* ACTIONS RAPIDES */}
      <div className="rounded-[24px] border border-slate-200 bg-white dark:bg-slate-900 p-6 shadow-md">
        <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
          Actions rapides
        </h3>

        <div className="mt-4 flex flex-wrap gap-3">

          <button
            onClick={() => navigate("/scan-qr")}
            className="rounded-2xl bg-red-600 px-4 py-3 font-bold text-white hover:bg-red-700"
          >
            Scanner QR
          </button>

          <button
            onClick={() => navigate("/requests")}
            className="rounded-2xl border border-slate-300 px-4 py-3 font-semibold text-slate-700 hover:bg-slate-50"
          >
            Voir demandes
          </button>

          <button
            onClick={() => navigate("/collectes")}
            className="rounded-2xl border border-slate-300 px-4 py-3 font-semibold text-slate-700 hover:bg-slate-50"
          >
            Voir collectes
          </button>

        </div>
      </div>

      {/* DEMANDES RÉCENTES */}
      <div className="rounded-[24px] border border-slate-200 bg-white dark:bg-slate-900 p-6 shadow-md">
        <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
          Demandes récentes
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
                className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-700"
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
                    req.statut === "VALIDE"
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