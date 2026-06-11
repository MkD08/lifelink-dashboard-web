import { useEffect, useMemo, useState } from "react";

import AuditTable from "../../../components/tables/AuditTable";

import { auditService } from "../services/audit.service";

import type { AuditLog } from "../types/audit.types";

import { exportToCsv, exportToPdf } from "../../../utils/export";

import { useToast } from "../../auth/store/toast.store";

export default function AuditPage() {
  const { showToast } = useToast();

  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const loadLogs = async () => {
    try {
      setLoading(true);
      setError("");

      const data =
        await auditService.getAllLogs();

      setLogs(data);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Impossible de charger les audits";

      setError(message);

      showToast(
        message,
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const filteredLogs = useMemo(() => {
    const term =
      search
        .trim()
        .toLowerCase();

    if (!term) {
      return logs;
    }

    return logs.filter((log) => {

      const action =
        log.action
          ?.toLowerCase() || "";

      const description =
        log.description
          ?.toLowerCase() || "";

      const utilisateur =
        `${log.utilisateur?.nom || ""} ${
          log.utilisateur?.prenom || ""
        }`
          .trim()
          .toLowerCase();

      return (
        action.includes(term) ||
        description.includes(term) ||
        utilisateur.includes(term)
      );
    });
  }, [logs, search]);

  const loginCount =
    logs.filter((l) =>
      l.action.startsWith(
        "LOGIN"
      )
    ).length;

  const stockCount =
    logs.filter((l) =>
      l.action.startsWith(
        "STOCK"
      )
    ).length;

  const donationCount =
    logs.filter(
      (l) =>
        l.action.startsWith(
          "DON"
        ) ||
        l.action.startsWith(
          "DEMANDE"
        )
    ).length;

//   const adminCount =
//     logs.filter(
//       (l) =>
//         l.action.includes(
//           "USER"
//         ) ||
//         l.action.includes(
//           "CENTRE"
//         ) ||
//         l.action.includes(
//           "COLLECTE"
//         )
//     ).length;

  const auditColumns = [
    {
      header: "ID",
      accessor: (
        log: AuditLog
      ) => log.id_journal,
    },
    {
      header: "Action",
      accessor: (
        log: AuditLog
      ) => log.action,
    },
    {
      header: "Utilisateur",
      accessor: (
        log: AuditLog
      ) =>
        log.utilisateur
          ? `${log.utilisateur.nom ?? ""} ${
              log.utilisateur.prenom ??
              ""
            }`
          : "Système",
    },
    {
      header: "Description",
      accessor: (
        log: AuditLog
      ) =>
        log.description ??
        "",
    },
    {
      header: "Date",
      accessor: (
        log: AuditLog
      ) =>
        new Date(
          log.date_action
        ).toLocaleString(
          "fr-FR"
        ),
    },
  ];

  return (
    <div className="space-y-6">

      {/* HEADER */}

      <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-md dark:border-slate-700 dark:bg-slate-900">

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

          <div>

            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              Journal d'audit
            </h2>

            <p className="mt-2 text-slate-500 dark:text-slate-400">
              Historique complet des actions sensibles
              réalisées sur la plateforme LifeLink.
            </p>

          </div>

          <div className="flex w-full flex-col gap-3 lg:max-w-4xl lg:flex-row">

            <input
              type="text"
              placeholder="Rechercher par action, utilisateur ou description..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
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
            />

            <button
              onClick={() =>
                exportToCsv(
                  "audit",
                  filteredLogs,
                  auditColumns
                )
              }
              className="
                rounded-2xl
                border border-slate-300
                px-4 py-3
                font-semibold
                text-slate-700
                hover:bg-slate-50
                dark:border-slate-700
                dark:bg-slate-800
                dark:text-white
                dark:hover:bg-slate-700
              "
            >
              Export CSV
            </button>

            <button
              onClick={() =>
                exportToPdf(
                  "audit",
                  "Journal d'audit",
                  filteredLogs,
                  auditColumns
                )
              }
              className="
                rounded-2xl
                bg-red-600
                px-4 py-3
                font-bold
                text-white
                hover:bg-red-700
              "
            >
              Export PDF
            </button>

          </div>

        </div>

      </div>

      {/* STATS */}

      <div className="grid gap-4 md:grid-cols-4">

        <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-md dark:border-slate-700 dark:bg-slate-900">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Total audits
          </p>

          <h3 className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white">
            {logs.length}
          </h3>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-md dark:border-slate-700 dark:bg-slate-900">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Connexions
          </p>

          <h3 className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white">
            {loginCount}
          </h3>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-md dark:border-slate-700 dark:bg-slate-900">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Actions stock
          </p>

          <h3 className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white">
            {stockCount}
          </h3>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-md dark:border-slate-700 dark:bg-slate-900">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Dons / demandes
          </p>

          <h3 className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white">
            {donationCount}
          </h3>
        </div>

      </div>

      {/* ERROR */}

      {!loading && error && (

        <div className="rounded-[24px] border border-red-200 bg-red-50 p-6 shadow-md dark:border-red-800 dark:bg-red-950/40">

          <p className="font-semibold text-red-700 dark:text-red-400">
            {error}
          </p>

        </div>
      )}

      {/* CONTENT */}

      {loading ? (

        <div className="rounded-[24px] border border-slate-200 bg-white p-10 text-center shadow-md dark:border-slate-700 dark:bg-slate-900">

          <p className="text-slate-500 dark:text-slate-400">
            Chargement des audits...
          </p>

        </div>

      ) : filteredLogs.length === 0 ? (

        <div className="rounded-[24px] border border-slate-200 bg-white p-10 text-center shadow-md dark:border-slate-700 dark:bg-slate-900">

          <p className="text-slate-500 dark:text-slate-400">
            Aucun audit trouvé.
          </p>

        </div>

      ) : (

        <AuditTable
          logs={filteredLogs}
        />

      )}

    </div>
  );
}