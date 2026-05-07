import { useEffect, useState } from "react";
import { requestsService } from "../services/requests.service";
import { useToast } from "../../auth/store/toast.store";
import type { BloodRequest } from "../types/request.types";

import { exportToCsv, exportToPdf } from "../../../utils/export";

export default function RequestsPage() {
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const { showToast } = useToast();

  // ==============================
  // LOAD DATA
  // ==============================
  const loadRequests = async () => {
    try {
      setLoading(true);

      const data = await requestsService.getAllRequests();

      const sorted = [...data].sort(
        (a, b) =>
          new Date(b.date_creation).getTime() -
          new Date(a.date_creation).getTime()
      );

      setRequests(sorted);
    } catch (err: any) {
      showToast(err.message || "Erreur chargement", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  // ==============================
  // EXPORT CONFIG 🔥
  // ==============================
  const requestColumns = [
    {
      header: "ID",
      accessor: (r: BloodRequest) => r.id_demande,
    },
    {
      header: "Groupe sanguin",
      accessor: (r: BloodRequest) => r.groupe_sanguin,
    },
    {
      header: "Ville",
      accessor: (r: BloodRequest) => r.ville || "—",
    },
    {
      header: "Quantité",
      accessor: (r: BloodRequest) => r.quantite,
    },
    {
      header: "Statut",
      accessor: (r: BloodRequest) => r.statut,
    },
    {
      header: "Date",
      accessor: (r: BloodRequest) =>
        new Date(r.date_creation).toLocaleDateString(),
    },
  ];

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-md dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
          Demandes de sang
        </h2>

        <p className="mt-2 text-slate-500 dark:text-slate-400">
          Consultez les demandes en attente ou satisfaites.
        </p>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          {/* CSV */}
          <button
            onClick={() =>
              exportToCsv("demandes", requests, requestColumns)
            }
            className="rounded-2xl border border-slate-300 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700"
          >
            Export CSV
          </button>

          {/* PDF */}
          <button
            onClick={async () => {
              await exportToPdf(
                "demandes",
                "Liste des demandes de sang",
                requests,
                requestColumns
              );
            }}
            className="rounded-2xl bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700"
          >
            Export PDF
          </button>
        </div>
      </div>

      {/* CONTENT */}
      {loading ? (
        <div className="rounded-[24px] border border-slate-200 bg-white p-6 text-center text-slate-500 shadow-md dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
          Chargement...
        </div>
      ) : requests.length === 0 ? (
        <div className="rounded-[24px] border border-slate-200 bg-white p-6 text-center text-slate-500 shadow-md dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
          Aucune demande disponible
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {requests.map((req) => (
            <div
              key={req.id_demande}
              className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-md dark:border-slate-700 dark:bg-slate-900"
            >
              {/* HEADER CARD */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Demande #{req.id_demande}
                  </p>

                  <h3 className="mt-1 text-lg font-extrabold text-slate-900 dark:text-white">
                    Groupe : {req.groupe_sanguin}
                  </h3>
                </div>

                {/* STATUT */}
                <div
                  className={`inline-flex items-center gap-2 rounded-xl px-3 py-1 text-sm font-semibold ${
                    req.statut === "satisfaite"
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                      : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300"
                  }`}
                >
                  <span className="h-2 w-2 rounded-full bg-current"></span>
                  {req.statut}
                </div>
              </div>

              {/* INFOS */}
              <div className="mt-5 space-y-3">
                <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 dark:bg-slate-800">
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    Ville
                  </span>

                  <span className="font-semibold text-slate-900 dark:text-white">
                    {req.ville || "—"}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 dark:bg-slate-800">
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    Quantité
                  </span>

                  <span className="font-semibold text-slate-900 dark:text-white">
                    {req.quantite}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 dark:bg-slate-800">
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    Date
                  </span>

                  <span className="font-semibold text-slate-900 dark:text-white">
                    {new Date(req.date_creation).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}