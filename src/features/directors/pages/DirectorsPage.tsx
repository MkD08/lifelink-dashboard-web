import { useEffect, useMemo, useState } from "react";

import { exportToCsv, exportToPdf } from "../../../utils/export";

import AdminUsersTable from "../../../components/tables/AdminUsersTable";

import { directorsService } from "../services/directors.service";

import type { Director } from "../types/director.types";

import DeleteAdminUserModal from "../../admin-users/components/DeleteAdminUserModal";
import EditAdminUserModal from "../../admin-users/components/EditAdminUserModal";

import CreateDirectorForm from "../components/CreateDirectorForm";

import { useToast } from "../../auth/store/toast.store";

export default function DirectorsPage() {
  const { showToast } = useToast();

  const [directors, setDirectors] = useState<
    Director[]
  >([]);

  const [search, setSearch] = useState("");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] =
  useState(false);

  const [
    selectedDirectorToEdit,
    setSelectedDirectorToEdit,
  ] = useState<Director | null>(null);

  const [
    selectedDirectorToDelete,
    setSelectedDirectorToDelete,
  ] = useState<Director | null>(null);

  /**
   * LOAD DIRECTORS
   */
  const loadDirectors = async () => {
    setLoading(true);
    setError("");

    try {
      const data =
        await directorsService.getAllDirectors();

      setDirectors(data);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Impossible de charger les directeurs";

      setError(message);

      showToast(message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDirectors();
  }, []);

  /**
   * REACTIVATE
   */
  const handleReactivateDirector =
    async (director: Director) => {
      try {
        await directorsService.reactivateDirector(
          director.id_utilisateur
        );

        showToast(
          "Directeur réactivé avec succès.",
          "success"
        );

        await loadDirectors();
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Impossible de réactiver le directeur";

        showToast(message, "error");
      }
    };

  /**
   * FILTER
   */
  const filteredDirectors = useMemo(() => {
    const term =
      search.trim().toLowerCase();

    if (!term) return directors;

    return directors.filter(
      (director) => {
        const id = String(
          director.id_utilisateur
        );

        const fullName =
          `${director.nom ?? ""} ${
            director.prenom ?? ""
          }`.toLowerCase();

        const phone =
          director.telephone?.toLowerCase() ??
          "";

        const email =
          director.email?.toLowerCase() ?? "";

        const ville =
          director.ville?.toLowerCase() ?? "";

        return (
          id.includes(term) ||
          fullName.includes(term) ||
          phone.includes(term) ||
          email.includes(term) ||
          ville.includes(term)
        );
      }
    );
  }, [directors, search]);

  /**
   * EXPORT COLUMNS
   */
  const directorColumns = [
    {
      header: "ID",
      accessor: (u: Director) =>
        u.id_utilisateur,
    },

    {
      header: "Nom complet",
      accessor: (u: Director) =>
        `${u.nom ?? ""} ${
          u.prenom ?? ""
        }`.trim(),
    },

    {
      header: "Téléphone",
      accessor: (u: Director) =>
        u.telephone || "—",
    },

    {
      header: "Email",
      accessor: (u: Director) =>
        u.email || "—",
    },

    {
      header: "Ville",
      accessor: (u: Director) =>
        u.ville || "—",
    },

    {
      header: "Centre",
      accessor: (u: any) =>
        u.centre?.nom || "—",
    },

    {
      header: "Actif",
      accessor: (u: Director) =>
        u.actif ? "Oui" : "Non",
    },
  ];

  /**
   * STATS
   */
  const totalDirectors =
    directors.length;

  const activeDirectors =
    directors.filter((u) => u.actif)
      .length;

  const inactiveDirectors =
    directors.filter((u) => !u.actif)
      .length;

  const assignedCentres =
    new Set(
      directors.map((d: any) =>
        d.centre?.id_centre
      )
    ).size;

  return (
    <div className="space-y-6">
      

      {/* HEADER */}
      <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-md dark:border-slate-700 dark:bg-slate-900">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              Directeurs
            </h2>

            <p className="mt-2 text-slate-500 dark:text-slate-400">
              Gestion complète des directeurs
              des centres de santé.
            </p>
          </div>

          {/* SEARCH + EXPORT */}
          <div className="flex w-full flex-col gap-3 lg:max-w-5xl lg:flex-row">
            <input
              type="text"
              placeholder="Rechercher directeur..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
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
              "
            />
            <button
  onClick={() =>
    setIsCreateModalOpen(true)
  }
  className="
    rounded-2xl
    bg-red-600
    px-5 py-3
    font-bold
    text-white
    transition
    hover:bg-red-700
  "
>
  Créer un directeur
</button>

            <button
              onClick={() =>
                exportToCsv(
                  "directeurs",
                  filteredDirectors,
                  directorColumns
                )
              }
              className="rounded-2xl border border-slate-300 px-4 py-3 font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            >
              Export CSV
            </button>

            <button
              onClick={() =>
                exportToPdf(
                  "directeurs",
                  "Liste des directeurs",
                  filteredDirectors,
                  directorColumns
                )
              }
              className="rounded-2xl bg-red-600 px-4 py-3 font-bold text-white hover:bg-red-700"
            >
              Export PDF
            </button>
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-md dark:border-slate-700 dark:bg-slate-900">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Total directeurs
          </p>

          <h3 className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white">
            {totalDirectors}
          </h3>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-md dark:border-slate-700 dark:bg-slate-900">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Actifs
          </p>

          <h3 className="mt-2 text-3xl font-extrabold text-green-600">
            {activeDirectors}
          </h3>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-md dark:border-slate-700 dark:bg-slate-900">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Désactivés
          </p>

          <h3 className="mt-2 text-3xl font-extrabold text-red-600">
            {inactiveDirectors}
          </h3>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-md dark:border-slate-700 dark:bg-slate-900">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Centres assignés
          </p>

          <h3 className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white">
            {assignedCentres}
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
            Chargement des directeurs...
          </p>
        </div>
      ) : filteredDirectors.length ===
        0 ? (
        <div className="rounded-[24px] border border-slate-200 bg-white p-10 text-center shadow-md dark:border-slate-700 dark:bg-slate-900">
          <p className="text-slate-500 dark:text-slate-400">
            Aucun directeur trouvé.
          </p>
        </div>
      ) : (
        <AdminUsersTable
          users={filteredDirectors}
          onEditClick={(director) =>
            setSelectedDirectorToEdit(
              director
            )
          }
          onDeleteClick={(director) =>
            setSelectedDirectorToDelete(
              director
            )
          }
          onReactivateClick={
            handleReactivateDirector
          }
        />
      )}
      {/* CREATE DIRECTOR MODAL */}
{isCreateModalOpen && (
  <div
    className="
      fixed inset-0 z-[9999]
      flex items-center justify-center
      bg-black/50
      p-4
      backdrop-blur-sm
    "
  >
    <div
      className="
        relative
        max-h-[95vh]
        w-full
        max-w-3xl
        overflow-y-auto
        rounded-[28px]
        bg-white
        p-6
        shadow-2xl
        dark:bg-slate-900
      "
    >

      {/* CLOSE */}
      <button
        onClick={() =>
          setIsCreateModalOpen(false)
        }
        className="
          absolute right-4 top-4
          rounded-xl
          bg-slate-100
          px-3 py-2
          text-sm font-bold
          hover:bg-slate-200

          dark:bg-slate-800
          dark:text-white
        "
      >
        ✕
      </button>

      <CreateDirectorForm />

    </div>
  </div>
)}

      {/* MODALS */}
      <EditAdminUserModal
        user={selectedDirectorToEdit}
        isOpen={!!selectedDirectorToEdit}
        onClose={() =>
          setSelectedDirectorToEdit(
            null
          )
        }
        onUpdated={loadDirectors}
      />

      <DeleteAdminUserModal
        user={selectedDirectorToDelete}
        isOpen={
          !!selectedDirectorToDelete
        }
        onClose={() =>
          setSelectedDirectorToDelete(
            null
          )
        }
        onDeleted={loadDirectors}
      />
    </div>
  );
}