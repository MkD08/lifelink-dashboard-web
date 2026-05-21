import { useEffect, useMemo, useState } from "react";

import {
  Pencil,
  Trash2,
} from "lucide-react";

import { alertsService } from "../services/alerts.service";

import type { Alert } from "../types/alert.types";

import { useToast } from "../../auth/store/toast.store";

import CreateAlertModal from "../components/CreateAlertModal";

import EditAlertModal from "../components/EditAlertModal";

import DeleteAlertModal from "../components/DeleteAlertModal";

export default function AlertsPage() {
  const { showToast } =
    useToast();

  const [alerts, setAlerts] =
    useState<Alert[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [filter, setFilter] =
    useState<
      "all" |
      "urgent" |
      "warning" |
      "info"
    >("all");

  const [openCreate, setOpenCreate] =
    useState(false);

  const [openEdit, setOpenEdit] =
    useState(false);

  const [
    openDelete,
    setOpenDelete,
  ] = useState(false);

  const [
    deleteLoading,
    setDeleteLoading,
  ] = useState(false);

  const [
    selectedAlert,
    setSelectedAlert,
  ] =
    useState<Alert | null>(
      null
    );

  // =========================
  // LOAD ALERTS
  // =========================
  const loadAlerts =
    async () => {
      try {
        setLoading(true);

        console.log(
          "📡 Loading alerts..."
        );

        const data =
          await alertsService.getAlerts();

        console.log(
          "✅ Alerts loaded:",
          data
        );

        setAlerts(data);
      } catch (err) {
        console.error(
          "❌ ALERT LOAD ERROR:",
          err
        );

        showToast(
          "Erreur chargement alertes",
          "error"
        );
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    loadAlerts();
  }, []);

  // =========================
  // DELETE ALERT
  // =========================
  const handleDelete =
    async () => {

      if (!selectedAlert)
        return;

      try {

        setDeleteLoading(
          true
        );

        await alertsService.deleteAlert(
          selectedAlert.id_alerte
        );

        showToast(
          "Alerte supprimée",
          "success"
        );

        setOpenDelete(
          false
        );

        setSelectedAlert(
          null
        );

        await loadAlerts();

      } catch (err) {

        console.error(err);

        showToast(
          "Erreur suppression",
          "error"
        );

      } finally {

        setDeleteLoading(
          false
        );
      }
    };

  // =========================
  // FILTER + SEARCH
  // =========================
  const filteredAlerts =
    useMemo(() => {

      return alerts.filter(
        (a) => {

          const matchType =
            filter === "all" ||
            a.type === filter;

          const matchSearch =

            (a.titre || "")
              .toLowerCase()
              .includes(
                search.toLowerCase()
              ) ||

            (a.message || "")
              .toLowerCase()
              .includes(
                search.toLowerCase()
              ) ||

            (a.ville || "")
              .toLowerCase()
              .includes(
                search.toLowerCase()
              ) ||

            (
              a.groupe_sanguin ||
              ""
            )
              .toLowerCase()
              .includes(
                search.toLowerCase()
              );

          return (
            matchType &&
            matchSearch
          );
        }
      );
    }, [
      alerts,
      search,
      filter,
    ]);

  // =========================
  // STATS
  // =========================
  const stats = {

    total:
      alerts.length,

    urgent:
      alerts.filter(
        (a) =>
          a.type === "urgent"
      ).length,

    warning:
      alerts.filter(
        (a) =>
          a.type === "warning"
      ).length,

    info:
      alerts.filter(
        (a) =>
          a.type === "info"
      ).length,
  };

  // =========================
  // BADGE COLORS
  // =========================
  const badge = (
    type: Alert["type"]
  ) => {

    if (type === "urgent")
      return "bg-red-100 text-red-700";

    if (type === "warning")
      return "bg-yellow-100 text-yellow-700";

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
          onClick={() =>
            setOpenCreate(
              true
            )
          }
          className="
            rounded-2xl
            bg-red-600
            px-4 py-2
            text-sm
            font-bold
            text-white
            transition
            hover:bg-red-700
          "
        >
          + Créer alerte
        </button>

      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">

        {/* TOTAL */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow dark:border-slate-700 dark:bg-slate-900">

          <p className="text-slate-500 dark:text-slate-400">
            Total
          </p>

          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
            {stats.total}
          </h3>

        </div>

        {/* URGENT */}
        <div className="rounded-2xl border border-red-100 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950/40">

          <p className="text-red-600 dark:text-red-400">
            Urgent
          </p>

          <h3 className="text-2xl font-bold text-red-600 dark:text-red-400">
            {stats.urgent}
          </h3>

        </div>

        {/* WARNING */}
        <div className="rounded-2xl border border-yellow-100 bg-yellow-50 p-4 dark:border-yellow-900 dark:bg-yellow-950/40">

          <p className="text-yellow-700 dark:text-yellow-400">
            Warning
          </p>

          <h3 className="text-2xl font-bold text-yellow-700 dark:text-yellow-400">
            {stats.warning}
          </h3>

        </div>

        {/* INFO */}
        <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950/40">

          <p className="text-blue-700 dark:text-blue-400">
            Info
          </p>

          <h3 className="text-2xl font-bold text-blue-700 dark:text-blue-400">
            {stats.info}
          </h3>

        </div>

      </div>

      {/* FILTERS */}
      <div className="flex flex-col gap-3 md:flex-row">

        {/* SEARCH */}
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
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
        />

        {/* FILTER */}
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
          onChange={(e) =>
            setFilter(
              e.target
                .value as any
            )
          }
        >

          <option value="all">
            Tous
          </option>

          <option value="urgent">
            Urgent
          </option>

          <option value="warning">
            Warning
          </option>

          <option value="info">
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

          {filteredAlerts.map(
            (a) => (

              <div
                key={
                  a.id_alerte
                }
                className="
                  flex
                  justify-between
                  rounded-2xl
                  border
                  border-slate-200
                  bg-white
                  p-4
                  shadow-sm

                  dark:border-slate-700
                  dark:bg-slate-900
                "
              >

                {/* LEFT */}
                <div>

                  {/* TITLE */}
                  <h3 className="font-bold text-slate-900 dark:text-white">
                    {a.titre}
                  </h3>

                  {/* MESSAGE */}
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {a.message}
                  </p>

                  {/* LOCATION */}
                  <div className="mt-2 text-xs text-slate-400 dark:text-slate-500">

                    {a.is_global ? (

                      <span className="font-semibold text-purple-600">
                        🌍 Alerte nationale
                      </span>

                    ) : (

                      <>
                        {a.centre?.nom ??
                          "Sans centre"}

                        {" • "}

                        {a.ville || "—"}

                        {" • "}

                        {a.quartier || "—"}
                      </>
                    )}

                    {a.type === "urgent" &&
                      a.groupe_sanguin && (
                      <>
                        {" • "}
                        {a.groupe_sanguin}
                      </>
                    )}

                  </div>

                  {/* CREATOR */}
                  <div className="mt-1 text-xs text-slate-400 dark:text-slate-500">

                    Créé par :

                    {" "}

                    {a.creator
                      ? `${a.creator.prenom} ${a.creator.nom}`
                      : "Inconnu"}

                  </div>

                  {/* DATE */}
                  <div className="mt-1 text-xs text-slate-400 dark:text-slate-500">

                    {new Date(
                      a.date_creation
                    ).toLocaleString(
                      "fr-FR"
                    )}

                  </div>

                </div>

                {/* RIGHT */}
                <div className="flex items-start gap-3">

                  {/* BADGE */}
                  <span
                    className={`h-fit rounded-full px-3 py-1 text-xs font-bold ${badge(
                      a.type
                    )}`}
                  >
                    {a.type}
                  </span>

                  {/* ACTIONS */}
                  <div className="flex gap-2">

                    {/* EDIT */}
                    <button
                      onClick={() => {

                        setSelectedAlert(
                          a
                        );

                        setOpenEdit(
                          true
                        );
                      }}
                      className="
                        rounded-xl
                        border
                        border-slate-300
                        p-2
                        text-slate-600
                        transition
                        hover:bg-slate-100

                        dark:border-slate-700
                        dark:text-slate-300
                        dark:hover:bg-slate-800
                      "
                    >
                      <Pencil
                        size={16}
                      />
                    </button>

                    {/* DELETE */}
                    <button
                      onClick={() => {

                        setSelectedAlert(
                          a
                        );

                        setOpenDelete(
                          true
                        );
                      }}
                      className="
                        rounded-xl
                        border
                        border-red-200
                        p-2
                        text-red-600
                        transition
                        hover:bg-red-50

                        dark:border-red-900
                        dark:hover:bg-red-950/30
                      "
                    >
                      <Trash2
                        size={16}
                      />
                    </button>

                  </div>

                </div>

              </div>
            )
          )}

        </div>
      )}

      {/* CREATE */}
      <CreateAlertModal
        isOpen={
          openCreate
        }
        onClose={() =>
          setOpenCreate(
            false
          )
        }
        onSuccess={
          loadAlerts
        }
      />

      {/* EDIT */}
      <EditAlertModal
        alert={
          selectedAlert
        }
        isOpen={openEdit}
        onClose={() => {

          setOpenEdit(
            false
          );

          setSelectedAlert(
            null
          );
        }}
        onSuccess={
          loadAlerts
        }
      />

      {/* DELETE */}
      <DeleteAlertModal
        isOpen={
          openDelete
        }
        loading={
          deleteLoading
        }
        onClose={() => {

          setOpenDelete(
            false
          );

          setSelectedAlert(
            null
          );
        }}
        onConfirm={
          handleDelete
        }
      />

    </div>
  );
}