import type { AuditLog } from "../../features/audits/types/audit.types";

type Props = {
  logs: AuditLog[];
};

function getActionBadge(action: string) {
  if (action.startsWith("STOCK")) {
    return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300";
  }

  if (action.startsWith("DON")) {
    return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300";
  }

  if (action.startsWith("DEMANDE")) {
    return "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300";
  }

  if (action.startsWith("CENTRE")) {
    return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300";
  }

  if (action.startsWith("COLLECTE")) {
    return "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300";
  }

  if (action.startsWith("ALERTE")) {
    return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300";
  }

  return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";
}

export default function AuditTable({ logs }: Props) {
  return (
    <div className="w-full overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-md dark:border-slate-800 dark:bg-slate-900">
      <div className="w-full overflow-x-auto">
        <table className="min-w-[1200px] w-full">
          <thead className="bg-slate-50 dark:bg-slate-800">
            <tr>
              <th className="px-5 py-4 text-left">Date</th>
              <th className="px-5 py-4 text-left">Action</th>
              <th className="px-5 py-4 text-left">Utilisateur</th>
              <th className="px-5 py-4 text-left">Description</th>
            </tr>
          </thead>

          <tbody>
            {logs.map((log) => (
              <tr
                key={log.id_journal}
                className="border-t border-slate-100 dark:border-slate-800"
              >
                <td className="px-5 py-4 whitespace-nowrap">
                  {new Date(log.date_action).toLocaleString("fr-FR")}
                </td>

                <td className="px-5 py-4">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${getActionBadge(
                      log.action
                    )}`}
                  >
                    {log.action}
                  </span>
                </td>

                <td className="px-5 py-4">
                  {log.utilisateur
                    ? `${log.utilisateur.nom ?? ""} ${
                        log.utilisateur.prenom ?? ""
                      }`
                    : "Système"}
                </td>

                <td className="px-5 py-4">
                  {log.description ?? "—"}
                </td>
              </tr>
            ))}

            {logs.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-5 py-10 text-center text-slate-500"
                >
                  Aucun audit trouvé.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}