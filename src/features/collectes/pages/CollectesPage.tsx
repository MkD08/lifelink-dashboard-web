import { useEffect, useState } from "react";
import { collectesService } from "../services/collectes.service";
import CollecteCard from "../components/CollecteCard";
import CreateCollecteModal from "../components/CreateCollecteModal";
import EditCollecteModal from "../components/EditCollecteModal";
import DeleteCollecteModal from "../components/DeleteCollecteModal";
import { useAuth } from "../../auth/store/auth.store";
import { useToast } from "../../auth/store/toast.store";

import { exportToCsv, exportToPdf } from "../../../utils/export";

export default function CollectesPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [createOpen, setCreateOpen] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [deleteItem, setDeleteItem] = useState<any>(null);

  const { user } = useAuth();
  const { showToast } = useToast();

  // ==============================
  // LOAD DATA
  // ==============================
  const load = async () => {
    try {
      setLoading(true);

      const res = await collectesService.getAll();

      const sorted = [...res].sort(
        (a, b) =>
          new Date(b.date_collecte).getTime() -
          new Date(a.date_collecte).getTime()
      );

      setData(sorted);
    } catch (err: any) {
      showToast(err.message || "Erreur chargement", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // ==============================
  // EXPORT CONFIG
  // ==============================
  const collecteColumns = [
    {
      header: "ID",
      accessor: (c: any) => c.id_collecte,
    },
    {
      header: "Titre",
      accessor: (c: any) => c.titre,
    },
    {
      header: "Ville",
      accessor: (c: any) => c.ville,
    },
    {
      header: "Lieu",
      accessor: (c: any) => c.lieu,
    },
    {
      header: "Date",
      accessor: (c: any) =>
        new Date(c.date_collecte).toLocaleDateString(),
    },
    {
      header: "Début",
      accessor: (c: any) => c.heure_debut,
    },
    {
      header: "Fin",
      accessor: (c: any) => c.heure_fin,
    },
    {
      header: "Places",
      accessor: (c: any) => c.places_max,
    },
    {
      header: "Participants",
      accessor: (c: any) => c.inscriptions?.length || 0,
    },
  ];

  // ==============================
  // UI
  // ==============================
  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="rounded-[24px] border border-slate-200 bg-white dark:bg-slate-900 p-6 shadow-md">
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
          Collectes de sang
        </h2>

        <p className="mt-2 text-slate-500">
          Gérez et consultez toutes les collectes disponibles.
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-3">

          {/* CSV */}
          <button
            onClick={() =>
              exportToCsv("collectes", data, collecteColumns)
            }
            className="rounded-2xl border border-slate-300 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50 dark:text-white dark:border-slate-700 dark:hover:bg-slate-800"
          >
            Export CSV
          </button>

          {/* PDF */}
          <button
            onClick={async () => {
              await exportToPdf(
                "collectes",
                "Liste des collectes",
                data,
                collecteColumns
              );
            }}
            className="rounded-2xl bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700"
          >
            Export PDF
          </button>

          {/* CREATE */}
          {user?.role_id !== 2 && (
            <button
              onClick={() => setCreateOpen(true)}
              className="ml-auto rounded-2xl bg-red-600 px-4 py-2 font-bold text-white hover:bg-red-700"
            >
              Créer une collecte
            </button>
          )}
        </div>
      </div>

      {/* CONTENT */}
      {loading ? (
        <div className="rounded-[24px] border border-slate-200 bg-white dark:bg-slate-900 p-6 text-center text-slate-500 shadow-md">
          Chargement...
        </div>
      ) : data.length === 0 ? (
        <div className="rounded-[24px] border border-slate-200 bg-white dark:bg-slate-900 p-6 text-center text-slate-500 shadow-md">
          Aucune collecte disponible
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {data.map((c: any) => (
            <CollecteCard
              key={c.id_collecte}
              collecte={c}
              onParticiper={() =>
                user?.id_utilisateur &&
                collectesService.participer(
                  c.id_collecte,
                  user.id_utilisateur
                )
              }
              onEdit={() => setEditItem(c)}
              onDelete={() => setDeleteItem(c)}
            />
          ))}
        </div>
      )}

      {/* MODALS */}
      <CreateCollecteModal
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={load}
      />

      <EditCollecteModal
        collecte={editItem}
        isOpen={!!editItem}
        onClose={() => setEditItem(null)}
        onUpdated={load}
      />

      <DeleteCollecteModal
        collecte={deleteItem}
        isOpen={!!deleteItem}
        onClose={() => setDeleteItem(null)}
        onDeleted={load}
      />

    </div>
  );
}