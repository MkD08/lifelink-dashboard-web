import type { Staff } from "../../features/staff-management/types/staff-management.types";

type Props = {
  users: Staff[];
  onEditClick: (user: Staff) => void;
  onDeleteClick: (user: Staff) => void;
  onReactivateClick: (user: Staff) => void;
};

function getFullName(user: Staff) {
  return `${user.nom ?? ""} ${user.prenom ?? ""}`.trim() || "—";
}

export default function StaffTable({
  users,
  onEditClick,
  onDeleteClick,
  onReactivateClick,
}: Props) {
  return (
    <div className="w-full overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-md dark:border-slate-800 dark:bg-slate-900">
      <div className="w-full overflow-x-auto scrollbar-thin">
        <table className="min-w-[1150px] w-full">
          <thead className="bg-slate-50 dark:bg-slate-800">
            <tr className="text-left text-sm text-slate-600 dark:text-slate-300">
              <th className="whitespace-nowrap px-5 py-4 font-semibold">
                ID
              </th>

              <th className="whitespace-nowrap px-5 py-4 font-semibold">
                Staff
              </th>

              <th className="whitespace-nowrap px-5 py-4 font-semibold">
                Téléphone
              </th>

              <th className="whitespace-nowrap px-5 py-4 font-semibold">
                Email
              </th>

              <th className="whitespace-nowrap px-5 py-4 font-semibold">
                Ville
              </th>

              <th className="whitespace-nowrap px-5 py-4 font-semibold">
                Groupe
              </th>

              <th className="whitespace-nowrap px-5 py-4 font-semibold">
                Centre
              </th>

              <th className="whitespace-nowrap px-5 py-4 font-semibold">
                Statut
              </th>

              <th className="whitespace-nowrap px-5 py-4 text-right font-semibold">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr
                key={user.id_utilisateur}
                className="border-t border-slate-100 text-sm text-slate-700 transition hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                <td className="whitespace-nowrap px-5 py-4 font-bold text-slate-900 dark:text-white">
                  #{user.id_utilisateur}
                </td>

                <td className="min-w-[220px] px-5 py-4">
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">
                      {getFullName(user)}
                    </p>

                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {user.genre || "—"}
                    </p>
                  </div>
                </td>

                <td className="whitespace-nowrap px-5 py-4">
                  {user.telephone || "—"}
                </td>

                <td className="whitespace-nowrap px-5 py-4">
                  {user.email || "—"}
                </td>

                <td className="whitespace-nowrap px-5 py-4">
                  {[user.ville, user.quartier]
                    .filter(Boolean)
                    .join(" / ") || "—"}
                </td>

                <td className="whitespace-nowrap px-5 py-4">
                  <span className="font-bold text-red-600 dark:text-red-400">
                    {user.groupe_sanguin || "—"}
                  </span>
                </td>

                <td className="whitespace-nowrap px-5 py-4">
                  {user.centre_sante?.nom || "—"}
                </td>

                <td className="whitespace-nowrap px-5 py-4">
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
                  <div className="flex min-w-[220px] justify-end gap-2">
                    <button
                      onClick={() => onEditClick(user)}
                      className="rounded-xl bg-blue-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-blue-700"
                    >
                      Modifier
                    </button>

                    {user.actif ? (
                      <button
                        onClick={() => onDeleteClick(user)}
                        className="rounded-xl bg-red-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-red-700"
                      >
                        Désactiver
                      </button>
                    ) : (
                      <button
                        onClick={() => onReactivateClick(user)}
                        className="rounded-xl bg-green-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-green-700"
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
                  Aucun staff trouvé.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}