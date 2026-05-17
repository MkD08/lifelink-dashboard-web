import type { BloodRequest } from "../../features/requests/types/request.types";

type Props = {
  requests: BloodRequest[];
  canUpdate: boolean;
  onUpdateClick: (request: BloodRequest) => void;
};

function getStatusLabel(status: string) {
  const value = status.toLowerCase();

  if (value.includes("attente")) return "En attente";
  if (value.includes("valid")) return "Validée";
  if (value.includes("refus") || value.includes("reject")) return "Refusée";
  return status;
}

function getStatusClass(status: string) {
  const value = status.toLowerCase();

  if (value.includes("attente"))
    return "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300";

  if (value.includes("valid"))
    return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300";

  if (value.includes("refus") || value.includes("reject"))
    return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300";

  return "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300";
}

function formatDate(date: string) {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;

  return parsed.toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

export default function RequestsTable({
  requests,
  canUpdate,
  onUpdateClick,
}: Props) {
  return (
    <div className="overflow-hidden rounded-[24px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md">
      <div className="w-full overflow-x-auto scrollbar-thin">
      <table className="min-w-[950px] w-full bg-white dark:bg-slate-900">

          {/* HEADER */}
          <thead className="bg-slate-50 dark:bg-slate-800">
            <tr className="text-left text-sm text-slate-600 dark:text-slate-300">
              <th className="whitespace-nowrap px-5 py-4 font-semibold">ID</th>
              <th className="whitespace-nowrap px-5 py-4 font-semibold">Utilisateur</th>
              <th className="whitespace-nowrap whitespace-nowrap px-5 py-4 font-semibold">Groupe sanguin</th>
              <th className="whitespace-nowrap px-5 py-4 font-semibold">Ville</th>
              <th className="whitespace-nowrap px-5 py-4 font-semibold">Quantité</th>
              <th className="whitespace-nowrap px-5 py-4 font-semibold">Statut</th>
              <th className="whitespace-nowrap px-5 py-4 font-semibold">Date</th>
              {canUpdate && (
                <th className="whitespace-nowrap px-5 py-4 font-semibold">Action</th>
              )}
            </tr>
          </thead>

          {/* BODY */}
          <tbody>
            {requests.map((request) => (
              <tr
                key={request.id_demande}
                className="border-t border-slate-100 dark:border-slate-800 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
              >
                <td className="whitespace-nowrap px-5 py-4 font-semibold text-slate-900 dark:text-white">
                  #{request.id_demande}
                </td>

                <td className="whitespace-nowrap px-5 py-4">
                  #{request.utilisateur_id}
                </td>

                <td className="whitespace-nowrap px-5 py-4">
                  <span className="font-bold text-red-600 dark:text-red-400">
                    {request.groupe_sanguin}
                  </span>
                </td>

                <td className="whitespace-nowrap px-5 py-4">
                  {request.ville || "—"}
                </td>

                <td className="whitespace-nowrap px-5 py-4">
                  {request.quantite}
                </td>

                {/* STATUT */}
                <td className="whitespace-nowrap px-5 py-4">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${getStatusClass(
                      request.statut
                    )}`}
                  >
                    {getStatusLabel(request.statut)}
                  </span>
                </td>

                <td className="whitespace-nowrap px-5 py-4">
                  {formatDate(request.date_creation)}
                </td>

                {canUpdate && (
                  <td className="whitespace-nowrap px-5 py-4">
                    <button
                      onClick={() => onUpdateClick(request)}
                      className="rounded-xl bg-red-600 px-3 py-2 text-xs font-bold text-white hover:bg-red-700 transition"
                    >
                      Mettre à jour
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
}