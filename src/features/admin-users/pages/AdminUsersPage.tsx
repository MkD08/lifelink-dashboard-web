import { useEffect, useMemo, useState } from "react";
import { exportToCsv, exportToPdf } from "../../../utils/export";
import AdminUsersTable from "../../../components/tables/AdminUsersTable";
import { adminUsersService } from "../services/admin-users.service";
import type { AdminUser } from "../types/admin-user.types";
import EditAdminUserModal from "../components/EditAdminUserModal";
import DeleteAdminUserModal from "../components/DeleteAdminUserModal";
import { useToast } from "../../auth/store/toast.store";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedUserToEdit, setSelectedUserToEdit] =
    useState<AdminUser | null>(null);

  const [selectedUserToDelete, setSelectedUserToDelete] =
    useState<AdminUser | null>(null);

  const { showToast } = useToast();

  const loadUsers = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await adminUsersService.getAllUsers();
      setUsers(data);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Impossible de charger les utilisateurs";

      setError(message);

      showToast(message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleReactivateUser = async (user: AdminUser) => {
    try {
      await adminUsersService.updateUser(user.id_utilisateur, {
        actif: true,
      });

      showToast("Utilisateur réactivé avec succès.");

      await loadUsers();
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Impossible de réactiver l'utilisateur";

      showToast(message, "error");
    }
  };

  const filteredUsers = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) return users;

    return users.filter((user) => {
      const id = String(user.id_utilisateur);

      const fullName =
        `${user.nom ?? ""} ${user.prenom ?? ""}`.toLowerCase();

      const phone = user.telephone?.toLowerCase() ?? "";
      const email = user.email?.toLowerCase() ?? "";
      const ville = user.ville?.toLowerCase() ?? "";
      const role = user.role?.nom_role?.toLowerCase() ?? "";

      return (
        id.includes(term) ||
        fullName.includes(term) ||
        phone.includes(term) ||
        email.includes(term) ||
        ville.includes(term) ||
        role.includes(term)
      );
    });
  }, [users, search]);

  const userColumns = [
    {
      header: "ID",
      accessor: (u: AdminUser) => u.id_utilisateur,
    },
    {
      header: "Nom complet",
      accessor: (u: AdminUser) =>
        `${u.nom ?? ""} ${u.prenom ?? ""}`.trim(),
    },
    {
      header: "Téléphone",
      accessor: (u: AdminUser) => u.telephone || "—",
    },
    {
      header: "Email",
      accessor: (u: AdminUser) => u.email || "—",
    },
    {
      header: "Ville",
      accessor: (u: AdminUser) => u.ville || "—",
    },
    {
      header: "Rôle",
      accessor: (u: AdminUser) =>
        u.role?.nom_role || u.role_id,
    },
    {
      header: "Actif",
      accessor: (u: AdminUser) =>
        u.actif ? "Oui" : "Non",
    },
  ];

  const totalUsers = users.length;

  const activeUsers = users.filter(
    (u) => u.actif
  ).length;

  const inactiveUsers = users.filter(
    (u) => !u.actif
  ).length;

  const staffCount = users.filter(
    (u) => u.role_id === 3
  ).length;

  const directorsCount = users.filter(
    (u) => u.role_id === 4
  ).length;

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-md dark:border-slate-700 dark:bg-slate-900">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              Utilisateurs
            </h2>

            <p className="mt-2 text-slate-500 dark:text-slate-400">
              Gestion complète des utilisateurs
              par l’administrateur.
            </p>
          </div>

          <div className="flex w-full max-w-4xl gap-3">
            <input
              type="text"
              placeholder="Rechercher par nom, téléphone, email, ville, rôle..."
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
                dark:placeholder:text-slate-400
              "
            />

            <button
              onClick={() =>
                exportToCsv(
                  "utilisateurs",
                  filteredUsers,
                  userColumns
                )
              }
              className="rounded-2xl border border-slate-300 px-4 py-3 font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700"
            >
              Export CSV
            </button>

            <button
              onClick={() =>
                exportToPdf(
                  "utilisateurs",
                  "Liste des utilisateurs",
                  filteredUsers,
                  userColumns
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
      <div className="grid gap-4 md:grid-cols-5">
        <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-md dark:border-slate-700 dark:bg-slate-900">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Total utilisateurs
          </p>

          <h3 className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white">
            {totalUsers}
          </h3>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-md dark:border-slate-700 dark:bg-slate-900">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Actifs
          </p>

          <h3 className="mt-2 text-3xl font-extrabold text-green-600">
            {activeUsers}
          </h3>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-md dark:border-slate-700 dark:bg-slate-900">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Désactivés
          </p>

          <h3 className="mt-2 text-3xl font-extrabold text-red-600">
            {inactiveUsers}
          </h3>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-md dark:border-slate-700 dark:bg-slate-900">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Staff
          </p>

          <h3 className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white">
            {staffCount}
          </h3>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-md dark:border-slate-700 dark:bg-slate-900">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Directeurs
          </p>

          <h3 className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white">
            {directorsCount}
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
            Chargement des utilisateurs...
          </p>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="rounded-[24px] border border-slate-200 bg-white p-10 text-center shadow-md dark:border-slate-700 dark:bg-slate-900">
          <p className="text-slate-500 dark:text-slate-400">
            Aucun utilisateur trouvé.
          </p>
        </div>
      ) : (
        <AdminUsersTable
          users={filteredUsers}
          onEditClick={(user) =>
            setSelectedUserToEdit(user)
          }
          onDeleteClick={(user) =>
            setSelectedUserToDelete(user)
          }
          onReactivateClick={handleReactivateUser}
        />
      )}

      {/* MODALS */}
      <EditAdminUserModal
        user={selectedUserToEdit}
        isOpen={!!selectedUserToEdit}
        onClose={() =>
          setSelectedUserToEdit(null)
        }
        onUpdated={loadUsers}
      />

      <DeleteAdminUserModal
        user={selectedUserToDelete}
        isOpen={!!selectedUserToDelete}
        onClose={() =>
          setSelectedUserToDelete(null)
        }
        onDeleted={loadUsers}
      />
    </div>
  );
}