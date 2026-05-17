import type { BloodStock } from "../../features/stocks/types/stock.types";

type Props = {
  stocks: BloodStock[];
  canUpdate: boolean;
  onUpdateClick: (stock: BloodStock) => void;
};

export default function StocksTable({
  stocks,
  canUpdate,
  onUpdateClick,
}: Props) {
  return (
    <div className="overflow-hidden rounded-[24px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md">
      <div className="w-full overflow-x-auto scrollbar-thin">
      <table className="min-w-[900px] w-full bg-white dark:bg-slate-900">

          {/* HEADER */}
          <thead className="bg-slate-50 dark:bg-slate-800">
            <tr className="text-left text-sm text-slate-600 dark:text-slate-300">
              <th className="whitespace-nowrap px-5 py-4 font-semibold">Centre ID</th>
              <th className="whitespace-nowrap px-5 py-4 font-semibold">Centre</th>
              <th className="whitespace-nowrap px-5 py-4 font-semibold">Ville</th>
              <th className="whitespace-nowrap px-5 py-4 font-semibold">Groupe sanguin</th>
              <th className="whitespace-nowrap px-5 py-4 font-semibold">Quantité</th>
              {canUpdate && <th className="px-5 py-4 font-semibold">Action</th>}
            </tr>
          </thead>

          {/* BODY */}
          <tbody>
            {stocks.map((stock, index) => (
              <tr
                key={`${stock.centre_id}-${stock.groupe_sanguin}-${index}`}
                className="border-t border-slate-100 dark:border-slate-800 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
              >
                <td className="whitespace-nowrap px-5 py-4 font-semibold text-slate-900 dark:text-white">
                  #{stock.centre_id ?? "—"}
                </td>

                <td className="whitespace-nowrap px-5 py-4">
                  {stock.centre_nom || "—"}
                </td>

                <td className="whitespace-nowrap px-5 py-4">
                  {stock.ville || "—"}
                </td>

                <td className="whitespace-nowrap px-5 py-4">
                  <span className="font-bold text-red-600 dark:text-red-400">
                    {stock.groupe_sanguin}
                  </span>
                </td>

                {/* QUANTITÉ */}
                <td className="whitespace-nowrap px-5 py-4">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                      stock.quantite > 5
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                        : stock.quantite > 0
                        ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300"
                        : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                    }`}
                  >
                    {stock.quantite}
                  </span>
                </td>

                {canUpdate && (
                  <td className="whitespace-nowrap px-5 py-4">
                    <button
                      onClick={() => onUpdateClick(stock)}
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