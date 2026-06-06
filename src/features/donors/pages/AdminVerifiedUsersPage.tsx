import { useEffect, useMemo, useState } from "react";

import { verificationService } from "../services/verification.service";

import { exportToCsv, exportToPdf } from "../../../utils/export";

export default function AdminVerifiedUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const loadUsers = async () => {
    setLoading(true);
    setError("");

    try {
      const data =
        await verificationService.getAllVerifiedUsers();

      setUsers(data ?? []);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Impossible de charger les données";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const term =
      search.trim().toLowerCase();

    if (!term) return users;

    return users.filter((user) => {
      return (
        `${user.nom} ${user.prenom}`
          .toLowerCase()
          .includes(term) ||
        (user.telephone ?? "")
          .toLowerCase()
          .includes(term) ||
        (user.ville ?? "")
          .toLowerCase()
          .includes(term) ||
        (user.groupe_sanguin ?? "")
          .toLowerCase()
          .includes(term) ||
        (
          user.centre_verificateur
            ?.nom ?? ""
        )
          .toLowerCase()
          .includes(term)
      );
    });
  }, [users, search]);

  const columns = [
    {
      header: "Utilisateur",
      accessor: (u: any) =>
        `${u.nom} ${u.prenom}`,
    },
    {
      header: "Téléphone",
      accessor: (u: any) =>
        u.telephone || "—",
    },
    {
      header: "Ville",
      accessor: (u: any) =>
        u.ville || "—",
    },
    {
      header: "Groupe",
      accessor: (u: any) =>
        u.groupe_sanguin || "—",
    },
    {
      header: "Centre vérificateur",
      accessor: (u: any) =>
        u.centre_verificateur?.nom ||
        "—",
    },
    {
      header: "Date",
      accessor: (u: any) =>
        new Date(
          u.date_mise_a_jour
        ).toLocaleDateString(),
    },
  ];

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-md dark:border-slate-700 dark:bg-slate-900">

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              Historique des vérifications
            </h2>

            <p className="mt-2 text-slate-500 dark:text-slate-400">
              Tous les utilisateurs dont le groupe sanguin a été validé.
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
                  "historique-verifications",
                  filteredUsers,
                  columns
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
                  "historique-verifications",
                  "Historique des vérifications",
                  filteredUsers,
                  columns
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
      <div className="grid gap-4 md:grid-cols-3">

        <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-md dark:border-slate-700 dark:bg-slate-900">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Utilisateurs vérifiés
          </p>

          <h3 className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white">
            {users.length}
          </h3>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-md dark:border-slate-700 dark:bg-slate-900">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Centres impliqués
          </p>

          <h3 className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white">
            {
              new Set(
                users.map(
                  (u) =>
                    u.centre_verificateur_id
                )
              ).size
            }
          </h3>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-md dark:border-slate-700 dark:bg-slate-900">
          <p className="text-sm text-slate-500 dark:text-slate-400">
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
      <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-md dark:border-slate-700 dark:bg-slate-900">

        <div className="overflow-x-auto">

          <table className="min-w-[1200px] w-full">

            <thead className="bg-slate-50 dark:bg-slate-800">

              <tr>

                <th className="px-5 py-4 text-left font-semibold">
                  Utilisateur
                </th>

                <th className="px-5 py-4 text-left font-semibold">
                  Téléphone
                </th>

                <th className="px-5 py-4 text-left font-semibold">
                  Ville
                </th>

                <th className="px-5 py-4 text-left font-semibold">
                  Groupe
                </th>

                <th className="px-5 py-4 text-left font-semibold">
                  Centre vérificateur
                </th>

                <th className="px-5 py-4 text-left font-semibold">
                  Date vérification
                </th>

              </tr>

            </thead>

            <tbody>

              {loading ? (

                <tr>
                  <td
                    colSpan={6}
                    className="p-10 text-center"
                  >
                    Chargement...
                  </td>
                </tr>

              ) : filteredUsers.length === 0 ? (

                <tr>
                  <td
                    colSpan={6}
                    className="p-10 text-center"
                  >
                    Aucun utilisateur trouvé.
                  </td>
                </tr>

              ) : (

                filteredUsers.map((user) => (

                  <tr
                    key={user.id_utilisateur}
                    className="
                      border-t border-slate-100
                      text-sm
                      hover:bg-slate-50

                      dark:border-slate-800
                      dark:hover:bg-slate-800
                    "
                  >

                    <td className="px-5 py-4 font-semibold">
                      {user.nom} {user.prenom}
                    </td>

                    <td className="px-5 py-4">
                      {user.telephone || "—"}
                    </td>

                    <td className="px-5 py-4">
                      {user.ville || "—"}
                    </td>

                    <td className="px-5 py-4">
                      <span className="font-bold text-red-600">
                        {user.groupe_sanguin}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      {
                        user
                          .centre_verificateur
                          ?.nom
                      }
                    </td>

                    <td className="px-5 py-4">
                      {new Date(
                        user.date_mise_a_jour
                      ).toLocaleDateString()}
                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}