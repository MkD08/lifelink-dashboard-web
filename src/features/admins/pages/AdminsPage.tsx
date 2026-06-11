import { useEffect, useMemo, useState } from "react";

import { exportToCsv, exportToPdf } from "../../../utils/export";

import { useToast } from "../../auth/store/toast.store";

import { adminsService } from "../services/admins.service";

import type { Admin } from "../types/admin.types";

import AdminsTable from "../../../components/tables/AdminsTable";

import CreateAdminModal from "../components/CreateAdminModal";
import EditAdminModal from "../components/EditAdminModal";
import DisableAdminModal from "../components/DisableAdminModal";

export default function AdminsPage() {
  const { showToast } = useToast();

  const [admins, setAdmins] =
    useState<Admin[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [showCreateModal, setShowCreateModal] =
    useState(false);

  const [selectedAdminToEdit, setSelectedAdminToEdit] =
    useState<Admin | null>(null);

  const [selectedAdminToDisable, setSelectedAdminToDisable] =
    useState<Admin | null>(null);

  const loadAdmins = async () => {
    try {
      setLoading(true);
      setError("");

      const data =
        await adminsService.getAllAdmins();

      setAdmins(data);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Impossible de charger les administrateurs";

      setError(message);

      showToast(message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdmins();
  }, []);

  const handleEnableAdmin =
    async (
      admin: Admin
    ) => {
      try {
        await adminsService.enableAdmin(
          admin.id_utilisateur
        );

        showToast(
          "Administrateur réactivé avec succès.",
          "success"
        );

        await loadAdmins();
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Impossible de réactiver l'administrateur";

        showToast(
          message,
          "error"
        );
      }
    };

  const filteredAdmins =
    useMemo(() => {
      const term =
        search
          .trim()
          .toLowerCase();

      if (!term)
        return admins;

      return admins.filter(
        (admin) => {
          const id =
            String(
              admin.id_utilisateur
            );

          const fullName =
            `${admin.nom ?? ""} ${admin.prenom ?? ""}`
              .toLowerCase();

          const phone =
            admin.telephone?.toLowerCase() ??
            "";

          const email =
            admin.email?.toLowerCase() ??
            "";

          const ville =
            admin.ville?.toLowerCase() ??
            "";

          return (
            id.includes(term) ||
            fullName.includes(term) ||
            phone.includes(term) ||
            email.includes(term) ||
            ville.includes(term)
          );
        }
      );
    }, [
      admins,
      search,
    ]);

  const totalAdmins =
    admins.length;

  const activeAdmins =
    admins.filter(
      (a) => a.actif
    ).length;

  const inactiveAdmins =
    admins.filter(
      (a) => !a.actif
    ).length;

  const exportColumns = [
    {
      header: "ID",
      accessor: (
        a: Admin
      ) =>
        a.id_utilisateur,
    },
    {
      header:
        "Nom complet",
      accessor: (
        a: Admin
      ) =>
        `${a.nom ?? ""} ${a.prenom ?? ""}`,
    },
    {
      header:
        "Téléphone",
      accessor: (
        a: Admin
      ) =>
        a.telephone ||
        "—",
    },
    {
      header:
        "Email",
      accessor: (
        a: Admin
      ) =>
        a.email || "—",
    },
    {
      header:
        "Ville",
      accessor: (
        a: Admin
      ) =>
        a.ville || "—",
    },
    {
      header:
        "Statut",
      accessor: (
        a: Admin
      ) =>
        a.actif
          ? "Actif"
          : "Inactif",
    },
  ];

  return (
    <div className="space-y-6">

      {/* HEADER */}

      <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-md dark:border-slate-700 dark:bg-slate-900">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              Administrateurs
            </h2>

            <p className="mt-2 text-slate-500 dark:text-slate-400">
              Gestion complète des administrateurs.
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 lg:max-w-4xl lg:flex-row">

            <input
              type="text"
              placeholder="Rechercher..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              className="flex-1 rounded-2xl border border-slate-300 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />

            <button
              onClick={() =>
                setShowCreateModal(
                  true
                )
              }
              className="rounded-2xl bg-green-600 px-4 py-3 font-bold text-white hover:bg-green-700"
            >
              Nouvel admin
            </button>

            <button
              onClick={() =>
                exportToCsv(
                  "administrateurs",
                  filteredAdmins,
                  exportColumns
                )
              }
              className="rounded-2xl border border-slate-300 px-4 py-3 font-semibold dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            >
              Export CSV
            </button>

            <button
              onClick={() =>
                exportToPdf(
                  "administrateurs",
                  "Liste des administrateurs",
                  filteredAdmins,
                  exportColumns
                )
              }
              className="rounded-2xl bg-red-600 px-4 py-3 font-bold text-white"
            >
              Export PDF
            </button>

          </div>
        </div>
      </div>

      {/* STATS */}

      <div className="grid gap-4 md:grid-cols-3">

        <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-md dark:border-slate-700 dark:bg-slate-900">
          <p className="text-sm text-slate-500">
            Total
          </p>

          <h3 className="mt-2 text-3xl font-extrabold">
            {totalAdmins}
          </h3>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-md dark:border-slate-700 dark:bg-slate-900">
          <p className="text-sm text-slate-500">
            Actifs
          </p>

          <h3 className="mt-2 text-3xl font-extrabold text-green-600">
            {activeAdmins}
          </h3>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-md dark:border-slate-700 dark:bg-slate-900">
          <p className="text-sm text-slate-500">
            Désactivés
          </p>

          <h3 className="mt-2 text-3xl font-extrabold text-red-600">
            {inactiveAdmins}
          </h3>
        </div>

      </div>

      {/* ERROR */}

      {!loading && error && (
        <div className="rounded-[24px] border border-red-200 bg-red-50 p-6">
          {error}
        </div>
      )}

      {/* TABLE */}

      {!loading && (
        <AdminsTable
          admins={
            filteredAdmins
          }
          onEditClick={
            setSelectedAdminToEdit
          }
          onDisableClick={
            setSelectedAdminToDisable
          }
          onEnableClick={
            handleEnableAdmin
          }
        />
      )}

      {/* MODALS */}

      <CreateAdminModal
        isOpen={
          showCreateModal
        }
        onClose={() =>
          setShowCreateModal(
            false
          )
        }
        onCreated={
          loadAdmins
        }
      />

      <EditAdminModal
        admin={
          selectedAdminToEdit
        }
        isOpen={
          !!selectedAdminToEdit
        }
        onClose={() =>
          setSelectedAdminToEdit(
            null
          )
        }
        onUpdated={
          loadAdmins
        }
      />

      <DisableAdminModal
        admin={
          selectedAdminToDisable
        }
        isOpen={
          !!selectedAdminToDisable
        }
        onClose={() =>
          setSelectedAdminToDisable(
            null
          )
        }
        onDisabled={
          loadAdmins
        }
      />
    </div>
  );
}