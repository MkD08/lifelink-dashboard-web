import type { Admin } from "../../features/admins/types/admin.types";

type Props = {
  admins: Admin[];

  onEditClick: (admin: Admin) => void;

  onDisableClick: (admin: Admin) => void;

  onEnableClick: (admin: Admin) => void;
};

function getFullName(admin: Admin) {
  return (
    `${admin.nom ?? ""} ${admin.prenom ?? ""}`.trim() ||
    "—"
  );
}

export default function AdminsTable({
  admins,
  onEditClick,
  onDisableClick,
  onEnableClick,
}: Props) {
  return (
    <div className="w-full overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-md dark:border-slate-800 dark:bg-slate-900">
      <div className="w-full overflow-x-auto scrollbar-thin">
        <table className="min-w-[1000px] w-full">
          <thead className="bg-slate-50 dark:bg-slate-800">
            <tr className="text-left text-sm text-slate-600 dark:text-slate-300">
              <th className="px-5 py-4 font-semibold">
                ID
              </th>

              <th className="px-5 py-4 font-semibold">
                Administrateur
              </th>

              <th className="px-5 py-4 font-semibold">
                Téléphone
              </th>

              <th className="px-5 py-4 font-semibold">
                Email
              </th>

              <th className="px-5 py-4 font-semibold">
                Ville
              </th>

              <th className="px-5 py-4 font-semibold">
                Groupe
              </th>

              <th className="px-5 py-4 font-semibold">
                Statut
              </th>

              <th className="px-5 py-4 text-right font-semibold">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {admins.map((admin) => (
              <tr
                key={admin.id_utilisateur}
                className="border-t border-slate-100 text-sm text-slate-700 transition hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                <td className="px-5 py-4 font-bold text-slate-900 dark:text-white">
                  #{admin.id_utilisateur}
                </td>

                <td className="min-w-[220px] px-5 py-4">
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">
                      {getFullName(admin)}
                    </p>

                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Administrateur
                    </p>
                  </div>
                </td>

                <td className="px-5 py-4">
                  {admin.telephone || "—"}
                </td>

                <td className="px-5 py-4">
                  {admin.email || "—"}
                </td>

                <td className="px-5 py-4">
                  {[admin.ville, admin.quartier]
                    .filter(Boolean)
                    .join(" / ") || "—"}
                </td>

                <td className="px-5 py-4">
                  <span className="font-bold text-red-600 dark:text-red-400">
                    {admin.groupe_sanguin || "—"}
                  </span>
                </td>

                <td className="px-5 py-4">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                      admin.actif
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                        : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                    }`}
                  >
                    {admin.actif
                      ? "Actif"
                      : "Désactivé"}
                  </span>
                </td>

                <td className="px-5 py-4">
                  <div className="flex min-w-[220px] justify-end gap-2">
                    <button
                      onClick={() =>
                        onEditClick(admin)
                      }
                      className="rounded-xl bg-blue-600 px-3 py-2 text-xs font-bold text-white hover:bg-blue-700"
                    >
                      Modifier
                    </button>

                    {admin.actif ? (
                      <button
                        onClick={() =>
                          onDisableClick(admin)
                        }
                        className="rounded-xl bg-red-600 px-3 py-2 text-xs font-bold text-white hover:bg-red-700"
                      >
                        Désactiver
                      </button>
                    ) : (
                      <button
                        onClick={() =>
                          onEnableClick(admin)
                        }
                        className="rounded-xl bg-green-600 px-3 py-2 text-xs font-bold text-white hover:bg-green-700"
                      >
                        Réactiver
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}

            {admins.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className="px-5 py-10 text-center text-sm text-slate-500 dark:text-slate-400"
                >
                  Aucun administrateur trouvé.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}