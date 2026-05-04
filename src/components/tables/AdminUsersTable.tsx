import type { AdminUser } from "../../features/admin-users/types/admin-user.types";

type Props = {
  users: AdminUser[];
  onEditClick: (user: AdminUser) => void;
  onDeleteClick: (user: AdminUser) => void;
  onReactivateClick: (user: AdminUser) => void;
};

function getFullName(user: AdminUser) {
  return `${user.nom ?? ""} ${user.prenom ?? ""}`.trim() || "—";
}

function getRoleBadge(role?: string) {
  switch (role) {
    case "admin":
      return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300";
    case "staff":
      return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300";
    case "directeur":
      return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300";
    default:
      return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";
  }
}

export default function AdminUsersTable({
  users,
  onEditClick,
  onDeleteClick,
  onReactivateClick,
}: Props) {
  return (
    <div className="overflow-hidden rounded-[24px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md">
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-slate-900">

          {/* HEADER */}
          <thead className="bg-slate-50 dark:bg-slate-800">
            <tr className="text-left text-sm text-slate-600 dark:text-slate-300">
              <th className="px-5 py-4 font-semibold">ID</th>
              <th className="px-5 py-4 font-semibold">Utilisateur</th>
              <th className="px-5 py-4 font-semibold">Téléphone</th>
              <th className="px-5 py-4 font-semibold">Email</th>
              <th className="px-5 py-4 font-semibold">Ville</th>
              <th className="px-5 py-4 font-semibold">Groupe</th>
              <th className="px-5 py-4 font-semibold">Rôle</th>
              <th className="px-5 py-4 font-semibold">Statut</th>
              <th className="px-5 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>

          {/* BODY */}
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id_utilisateur}
                className="border-t border-slate-100 dark:border-slate-800 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
              >
                <td className="px-5 py-4 font-bold text-slate-900 dark:text-white">
                  #{user.id_utilisateur}
                </td>

                <td className="px-5 py-4">
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">
                      {getFullName(user)}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {user.genre || "—"}
                    </p>
                  </div>
                </td>

                <td className="px-5 py-4">{user.telephone || "—"}</td>

                <td className="px-5 py-4">{user.email || "—"}</td>

                <td className="px-5 py-4">
                  {[user.ville, user.quartier].filter(Boolean).join(" / ") || "—"}
                </td>

                <td className="px-5 py-4">
                  <span className="font-bold text-red-600 dark:text-red-400">
                    {user.groupe_sanguin || "—"}
                  </span>
                </td>

                <td className="px-5 py-4">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${getRoleBadge(
                      user.role?.nom_role
                    )}`}
                  >
                    {user.role?.nom_role || "Utilisateur"}
                  </span>
                </td>

                <td className="px-5 py-4">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                      user.actif
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                        : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                    }`}
                  >
                    {user.actif ? "Actif" : "Désactivé"}
                  </span>
                </td>

                <td className="px-5 py-4">
                  <div className="flex justify-end gap-2">
                    
                    <button
                      onClick={() => onEditClick(user)}
                      className="rounded-xl bg-blue-600 px-3 py-2 text-xs font-bold text-white hover:bg-blue-700 transition"
                    >
                      Modifier
                    </button>

                    {user.actif ? (
                      <button
                        onClick={() => onDeleteClick(user)}
                        className="rounded-xl bg-red-600 px-3 py-2 text-xs font-bold text-white hover:bg-red-700 transition"
                      >
                        Désactiver
                      </button>
                    ) : (
                      <button
                        onClick={() => onReactivateClick(user)}
                        className="rounded-xl bg-green-600 px-3 py-2 text-xs font-bold text-white hover:bg-green-700 transition"
                      >
                        Réactiver
                      </button>
                    )}

                  </div>
                </td>
              </tr>
            ))}

            {users.length === 0 && (
              <tr>
                <td
                  colSpan={9}
                  className="px-5 py-10 text-center text-sm text-slate-500 dark:text-slate-400"
                >
                  Aucun utilisateur trouvé.
                </td>
              </tr>
            )}
          </tbody>

        </table>
      </div>
    </div>
  );
}