import type { Centre } from "../../features/centres/types/centre.types";

type Props = {
  centres: Centre[];
  isAdmin: boolean;
  onEditClick: (centre: Centre) => void;
  onDeleteClick: (centre: Centre) => void;
};

export default function CentresTable({
  centres,
  isAdmin,
  onEditClick,
  onDeleteClick,
}: Props) {
  return (
    <div className="overflow-hidden rounded-[24px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md">
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-slate-900">
          
          {/* HEADER */}
          <thead className="bg-slate-50 dark:bg-slate-800">
            <tr className="text-left text-sm text-slate-600 dark:text-slate-300">
              <th className="px-5 py-4 font-semibold">ID</th>
              <th className="px-5 py-4 font-semibold">Nom</th>
              <th className="px-5 py-4 font-semibold">Ville</th>
              <th className="px-5 py-4 font-semibold">Adresse</th>
              <th className="px-5 py-4 font-semibold">Téléphone</th>
              {isAdmin && <th className="px-5 py-4 font-semibold">Actions</th>}
            </tr>
          </thead>

          {/* BODY */}
          <tbody>
            {centres.map((centre) => (
              <tr
                key={centre.id_centre}
                className="border-t border-slate-100 dark:border-slate-800 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
              >
                <td className="px-5 py-4 font-semibold text-slate-900 dark:text-white">
                  #{centre.id_centre}
                </td>

                <td className="px-5 py-4">{centre.nom}</td>
                <td className="px-5 py-4">{centre.ville || "—"}</td>
                <td className="px-5 py-4">{centre.adresse || "—"}</td>
                <td className="px-5 py-4">{centre.telephone || "—"}</td>

                {isAdmin && (
                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      
                      {/* EDIT */}
                      <button
                        onClick={() => onEditClick(centre)}
                        className="rounded-xl bg-blue-600 px-3 py-2 text-xs font-bold text-white hover:bg-blue-700 transition"
                      >
                        Modifier
                      </button>

                      {/* DELETE */}
                      <button
                        onClick={() => onDeleteClick(centre)}
                        className="rounded-xl bg-red-600 px-3 py-2 text-xs font-bold text-white hover:bg-red-700 transition"
                      >
                        Supprimer
                      </button>

                    </div>
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