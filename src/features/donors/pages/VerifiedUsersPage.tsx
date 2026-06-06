import { useEffect, useMemo, useState } from "react";

import DonorsTable from "../../../components/tables/DonorsTable";

import { verificationService } from "../services/verification.service";

import type { Donor } from "../types/donor.types";

import { exportToCsv, exportToPdf } from "../../../utils/export";

export default function VerifiedUsersPage() {
  const [users, setUsers] =
    useState<Donor[]>([]);

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const loadUsers = async () => {
    setLoading(true);
    setError("");

    try {
      const data =
        await verificationService.getVerifiedUsers();

      setUsers(data ?? []);

    } catch (err) {

      const message =
        err instanceof Error
          ? err.message
          : "Impossible de charger les utilisateurs";

      setError(message);

    } finally {

      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const filteredUsers =
    useMemo(() => {

      const term =
        search.trim().toLowerCase();

      if (!term) return users;

      return users.filter((user) => {

        const fullName =
          `${user.nom} ${user.prenom}`
            .toLowerCase();

        const phone =
          user.telephone?.toLowerCase() ?? "";

        const city =
          user.ville?.toLowerCase() ?? "";

        const quartier =
          user.quartier?.toLowerCase() ?? "";

        const blood =
          user.groupe_sanguin?.toLowerCase() ?? "";

        return (
          fullName.includes(term) ||
          phone.includes(term) ||
          city.includes(term) ||
          quartier.includes(term) ||
          blood.includes(term)
        );
      });

    }, [users, search]);

  const columns = [
    {
      header: "Nom complet",
      accessor: (d: Donor) =>
        `${d.nom} ${d.prenom}`,
    },
    {
      header: "Téléphone",
      accessor: (d: Donor) =>
        d.telephone || "—",
    },
    {
      header: "Ville",
      accessor: (d: Donor) =>
        d.ville || "—",
    },
    {
      header: "Quartier",
      accessor: (d: Donor) =>
        d.quartier || "—",
    },
    {
      header: "Groupe sanguin",
      accessor: (d: Donor) =>
        d.groupe_sanguin || "—",
    },
  ];

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-md dark:border-slate-700 dark:bg-slate-900">

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

          <div>

            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              Utilisateurs vérifiés
            </h2>

            <p className="mt-2 text-slate-500 dark:text-slate-400">
              Liste des utilisateurs dont le groupe sanguin a été validé.
            </p>

          </div>

          <div className="flex w-full flex-col gap-3 lg:max-w-4xl lg:flex-row">

            <input
              type="text"
              placeholder="Rechercher..."
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
                exportToCsv(
                  "utilisateurs-verifies",
                  filteredUsers,
                  columns
                )
              }
              className="rounded-2xl border border-slate-300 px-4 py-3 font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            >
              Export CSV
            </button>

            <button
              onClick={() =>
                exportToPdf(
                  "utilisateurs-verifies",
                  "Utilisateurs vérifiés",
                  filteredUsers,
                  columns
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
      <div className="grid gap-4 md:grid-cols-3">

        <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-md dark:border-slate-700 dark:bg-slate-900">

          <p className="text-sm text-slate-500">
            Utilisateurs vérifiés
          </p>

          <h3 className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white">
            {users.length}
          </h3>

        </div>

        <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-md dark:border-slate-700 dark:bg-slate-900">

          <p className="text-sm text-slate-500">
            Profils complets
          </p>

          <h3 className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white">
            {
              users.filter(
                (u) => u.profil_complet
              ).length
            }
          </h3>

        </div>

        <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-md dark:border-slate-700 dark:bg-slate-900">

          <p className="text-sm text-slate-500">
            Résultats filtrés
          </p>

          <h3 className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white">
            {filteredUsers.length}
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

      {/* TABLE */}
      {loading ? (

        <div className="rounded-[24px] border border-slate-200 bg-white p-10 text-center shadow-md dark:border-slate-700 dark:bg-slate-900">

          <p className="text-slate-500 dark:text-slate-400">
            Chargement...
          </p>

        </div>

      ) : filteredUsers.length === 0 ? (

        <div className="rounded-[24px] border border-slate-200 bg-white p-10 text-center shadow-md dark:border-slate-700 dark:bg-slate-900">

          <p className="text-slate-500 dark:text-slate-400">
            Aucun utilisateur vérifié.
          </p>

        </div>

      ) : (

        <DonorsTable
          donors={filteredUsers}
          canVerify={false}
          onVerifyClick={() => {}}
        />

      )}

    </div>
  );
}