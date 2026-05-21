import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  collectesService,
} from "../services/collectes.service";

import CollecteCard from "../components/CollecteCard";

import CreateCollecteModal from "../components/CreateCollecteModal";

import EditCollecteModal from "../components/EditCollecteModal";

import DeleteCollecteModal from "../components/DeleteCollecteModal";

import { useAuth } from "../../auth/store/auth.store";

import { useToast } from "../../auth/store/toast.store";

import {
  exportToCsv,
  exportToPdf,
} from "../../../utils/export";

import type {
  Collecte,
} from "../types/collecte.types";

/**
 * ==============================
 * PAGE COLLECTES
 * ==============================
 */

export default function CollectesPage() {

  const [
    data,
    setData,
  ] = useState<Collecte[]>([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    createOpen,
    setCreateOpen,
  ] = useState(false);

  const [
    editItem,
    setEditItem,
  ] = useState<Collecte | null>(
    null
  );

  const [
    deleteItem,
    setDeleteItem,
  ] = useState<Collecte | null>(
    null
  );

  const { user } =
    useAuth();

  const { showToast } =
    useToast();

  // ==============================
  // LOAD DATA
  // ==============================
  const load = async () => {

    try {

      setLoading(true);

      const res =
        await collectesService.getAll();

      const sorted =
        [...res].sort(
          (a, b) =>
            new Date(
              b.date_collecte
            ).getTime() -

            new Date(
              a.date_collecte
            ).getTime()
        );

      setData(sorted);

    } catch (err: any) {

      showToast(

        err.message ||
          "Erreur chargement",

        "error"
      );

    } finally {

      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // ==============================
  // FILTER
  // ==============================
  const filteredData =
    useMemo(() => {

      const term =
        search
          .trim()
          .toLowerCase();

      if (!term)
        return data;

      return data.filter(
        (c) => {

          return (

            c.titre
              ?.toLowerCase()
              .includes(term) ||

            c.ville
              ?.toLowerCase()
              .includes(term) ||

            c.lieu
              ?.toLowerCase()
              .includes(term) ||

            c.centre?.nom
              ?.toLowerCase()
              .includes(term)
          );
        }
      );
    }, [data, search]);

  // ==============================
  // EXPORT CONFIG
  // ==============================
  const collecteColumns = [

    {
      header: "ID",

      accessor: (
        c: Collecte
      ) =>
        c.id_collecte,
    },

    {
      header: "Titre",

      accessor: (
        c: Collecte
      ) =>
        c.titre,
    },

    {
      header: "Ville",

      accessor: (
        c: Collecte
      ) =>
        c.ville,
    },

    {
      header: "Lieu",

      accessor: (
        c: Collecte
      ) =>
        c.lieu,
    },

    {
      header: "Centre",

      accessor: (
        c: Collecte
      ) =>
        c.centre?.nom ||
        "—",
    },

    {
      header: "Date",

      accessor: (
        c: Collecte
      ) =>
        new Date(
          c.date_collecte
        ).toLocaleDateString(),
    },

    {
      header: "Début",

      accessor: (
        c: Collecte
      ) =>
        c.heure_debut,
    },

    {
      header: "Fin",

      accessor: (
        c: Collecte
      ) =>
        c.heure_fin,
    },

    {
      header: "Places",

      accessor: (
        c: Collecte
      ) =>
        c.places_max,
    },

    {
      header:
        "Participants",

      accessor: (
        c: Collecte
      ) =>
        c.inscriptions
          ?.length || 0,
    },
  ];

  // ==============================
  // STATS
  // ==============================
  const totalCollectes =
    data.length;

  const totalParticipants =
    data.reduce(

      (
        acc,
        c
      ) =>

        acc +
        (
          c.inscriptions
            ?.length || 0
        ),

      0
    );

  const upcomingCollectes =
    data.filter(
      (c) =>

        new Date(
          c.date_collecte
        ) >= new Date()
    ).length;

  // ==============================
  // UI
  // ==============================
  return (
    <div className="space-y-6">

      {/* HERO */}
      <div
        className="
          relative
          overflow-hidden
          rounded-[32px]
          bg-gradient-to-br
          from-red-600
          via-red-700
          to-rose-800
          p-6
          shadow-2xl
          sm:p-8
        "
      >

        {/* BUBBLES */}
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />

        <div className="absolute bottom-0 left-0 h-28 w-28 rounded-full bg-white/10" />

        <div className="absolute right-20 top-20 h-10 w-10 rounded-full bg-white/20" />

        {/* CONTENT */}
        <div className="relative z-10">

          <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">

            {/* LEFT */}
            <div>

              <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                Collectes de sang
              </h2>

              <p className="mt-3 max-w-2xl text-sm text-red-100 sm:text-base">

                Gérez toutes les
                collectes,
                participants et
                événements de don
                de sang depuis le
                dashboard LifeLink.
              </p>

              {/* STATS */}
              <div className="mt-6 flex flex-wrap gap-3">

                <div className="rounded-2xl bg-white/10 px-4 py-3 backdrop-blur">

                  <p className="text-xs text-red-100">
                    Collectes
                  </p>

                  <p className="text-2xl font-extrabold text-white">
                    {
                      totalCollectes
                    }
                  </p>
                </div>

                <div className="rounded-2xl bg-white/10 px-4 py-3 backdrop-blur">

                  <p className="text-xs text-red-100">
                    Participants
                  </p>

                  <p className="text-2xl font-extrabold text-white">
                    {
                      totalParticipants
                    }
                  </p>
                </div>

                <div className="rounded-2xl bg-white/10 px-4 py-3 backdrop-blur">

                  <p className="text-xs text-red-100">
                    À venir
                  </p>

                  <p className="text-2xl font-extrabold text-white">
                    {
                      upcomingCollectes
                    }
                  </p>
                </div>

              </div>
            </div>

            {/* CREATE BUTTON */}
            {user?.role_id !== 2 && (

              <button
                onClick={() =>
                  setCreateOpen(
                    true
                  )
                }
                className="
                  rounded-2xl
                  bg-white
                  px-6 py-4
                  text-lg
                  font-extrabold
                  text-red-700
                  shadow-lg
                  transition
                  hover:scale-[1.02]
                "
              >
                + Créer une collecte
              </button>
            )}
          </div>
        </div>
      </div>

      {/* TOOLBAR */}
      <div
        className="
          rounded-[24px]
          border border-slate-200
          bg-white
          p-5
          shadow-md
          dark:border-slate-800
          dark:bg-slate-900
        "
      >

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

          {/* SEARCH */}
          <div className="w-full lg:max-w-md">

            <input
              type="text"
              placeholder="Rechercher une collecte..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              className="
                w-full
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
            />
          </div>

          {/* EXPORTS */}
          <div className="flex flex-col gap-3 sm:flex-row">

            <button
              onClick={() =>
                exportToCsv(
                  "collectes",
                  filteredData,
                  collecteColumns
                )
              }
              className="
                rounded-2xl
                border border-slate-300
                px-4 py-3
                font-semibold
                text-slate-700
                transition
                hover:bg-slate-50
                dark:border-slate-700
                dark:text-white
                dark:hover:bg-slate-800
              "
            >
              Export CSV
            </button>

            <button
              onClick={async () => {

                await exportToPdf(

                  "collectes",

                  "Liste des collectes",

                  filteredData,

                  collecteColumns
                );
              }}
              className="
                rounded-2xl
                bg-red-600
                px-4 py-3
                font-bold
                text-white
                transition
                hover:bg-red-700
              "
            >
              Export PDF
            </button>

          </div>
        </div>
      </div>

      {/* CONTENT */}
      {loading ? (

        <div
          className="
            rounded-[24px]
            border border-slate-200
            bg-white
            p-10
            text-center
            shadow-md
            dark:border-slate-800
            dark:bg-slate-900
          "
        >

          <p className="text-slate-500 dark:text-slate-400">
            Chargement des collectes...
          </p>
        </div>

      ) : filteredData.length === 0 ? (

        <div
          className="
            rounded-[24px]
            border border-slate-200
            bg-white
            p-10
            text-center
            shadow-md
            dark:border-slate-800
            dark:bg-slate-900
          "
        >

          <p className="text-slate-500 dark:text-slate-400">
            Aucune collecte trouvée.
          </p>
        </div>

      ) : (

        <div
          className="
            grid gap-6
            sm:grid-cols-2
            2xl:grid-cols-3
          "
        >

          {filteredData.map(
            (c) => (

              <CollecteCard
                key={
                  c.id_collecte
                }

                collecte={c}

                onParticiper={async () => {

                  try {

                    if (
                      user?.id_utilisateur
                    ) {

                      await collectesService.participer(

                        c.id_collecte,

                        user.id_utilisateur
                      );

                      showToast(
                        "Participation enregistrée.",
                        "success"
                      );

                      await load();
                    }

                  } catch (err: any) {

                    showToast(

                      err.message ||
                        "Erreur participation",

                      "error"
                    );
                  }
                }}

                onEdit={() =>
                  setEditItem(
                    c
                  )
                }

                onDelete={() =>
                  setDeleteItem(
                    c
                  )
                }
              />
            )
          )}
        </div>
      )}

      {/* MODALS */}
      <CreateCollecteModal
        isOpen={
          createOpen
        }
        onClose={() =>
          setCreateOpen(
            false
          )
        }
        onCreated={load}
      />

      <EditCollecteModal
        collecte={
          editItem
        }
        isOpen={
          !!editItem
        }
        onClose={() =>
          setEditItem(
            null
          )
        }
        onUpdated={load}
      />

      <DeleteCollecteModal
        collecte={
          deleteItem
        }
        isOpen={
          !!deleteItem
        }
        onClose={() =>
          setDeleteItem(
            null
          )
        }
        onDeleted={load}
      />
    </div>
  );
}