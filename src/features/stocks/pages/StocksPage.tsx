import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../auth/store/auth.store";
import { useToast } from "../../auth/store/toast.store";
import StocksTable from "../../../components/tables/StocksTable";
import UpdateStockModal from "../components/UpdateStockModal";
import { stocksService } from "../services/stocks.service";
import { exportToCsv, exportToPdf } from "../../../utils/export";
import type { BloodStock } from "../types/stock.types";

export default function StocksPage() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [stocks, setStocks] = useState<BloodStock[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");
  const [selectedStock, setSelectedStock] = useState<BloodStock | null>(null);

  const roleId = user?.role_id;
  const canUpdate = roleId === 1 || roleId === 3 || roleId === 4;

  const loadStocks = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await stocksService.getAllStocks();
      setStocks(data);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Impossible de charger les stocks";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStocks();
  }, []);

  const filteredStocks = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) return stocks;

    return stocks.filter((stock) => {
      const centreId = String(stock.centre_id ?? "");
      const centre = stock.centre_nom?.toLowerCase() ?? "";
      const ville = stock.ville?.toLowerCase() ?? "";
      const blood = stock.groupe_sanguin.toLowerCase();

      return (
        centreId.includes(term) ||
        centre.includes(term) ||
        ville.includes(term) ||
        blood.includes(term)
      );
    });
  }, [stocks, search]);

  const totalQuantity = stocks.reduce(
    (sum, stock) => sum + stock.quantite,
    0
  );

  const criticalCount = stocks.filter(
    (stock) => stock.quantite === 0
  ).length;

  const handleUpdateSubmit = async (quantite: number) => {
    if (!selectedStock?.centre_id) return;

    try {
      setUpdating(true);

      await stocksService.updateStock(
        selectedStock.centre_id,
        selectedStock.groupe_sanguin,
        quantite
      );

      setSelectedStock(null);
      await loadStocks();

      showToast("Stock mis à jour avec succès.", "success");
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Impossible de mettre à jour le stock";

      setError(message);
      showToast(message, "error");
    } finally {
      setUpdating(false);
    }
  };

  const stockColumns = [
    {
      header: "Centre ID",
      accessor: (s: BloodStock) => s.centre_id ?? "—",
    },
    {
      header: "Centre",
      accessor: (s: BloodStock) => s.centre_nom || "—",
    },
    {
      header: "Ville",
      accessor: (s: BloodStock) => s.ville || "—",
    },
    {
      header: "Groupe sanguin",
      accessor: (s: BloodStock) => s.groupe_sanguin,
    },
    {
      header: "Quantité",
      accessor: (s: BloodStock) => s.quantite,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-md dark:border-slate-700 dark:bg-slate-900">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              Stocks sanguins
            </h2>

            <p className="mt-2 text-slate-500 dark:text-slate-400">
              Vue globale des stocks par centre et groupe sanguin.
            </p>
          </div>

          <div className="flex w-full max-w-4xl gap-3">
            <input
              type="text"
              placeholder="Rechercher par centre, ville, groupe..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
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
                  "stocks",
                  filteredStocks,
                  stockColumns
                )
              }
              className="rounded-2xl border border-slate-300 px-4 py-3 font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700"
            >
              Export CSV
            </button>

            <button
              onClick={() =>
                exportToPdf(
                  "stocks",
                  "Liste des stocks",
                  filteredStocks,
                  stockColumns
                )
              }
              className="rounded-2xl bg-red-600 px-4 py-3 font-bold text-white hover:bg-red-700"
            >
              Export PDF
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-md dark:border-slate-700 dark:bg-slate-900">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Total lignes stock
          </p>

          <h3 className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white">
            {stocks.length}
          </h3>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-md dark:border-slate-700 dark:bg-slate-900">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Quantité totale
          </p>

          <h3 className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white">
            {totalQuantity}
          </h3>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-md dark:border-slate-700 dark:bg-slate-900">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Stocks critiques
          </p>

          <h3 className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white">
            {criticalCount}
          </h3>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-md dark:border-slate-700 dark:bg-slate-900">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Résultats filtrés
          </p>

          <h3 className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white">
            {filteredStocks.length}
          </h3>
        </div>
      </div>

      {!loading && error && (
        <div className="rounded-[24px] border border-red-200 bg-red-50 p-6 shadow-md dark:border-red-800 dark:bg-red-950/40">
          <p className="font-semibold text-red-700 dark:text-red-400">
            {error}
          </p>
        </div>
      )}

      {loading ? (
        <div className="rounded-[24px] border border-slate-200 bg-white p-10 text-center shadow-md dark:border-slate-700 dark:bg-slate-900">
          <p className="text-slate-500 dark:text-slate-400">
            Chargement des stocks...
          </p>
        </div>
      ) : filteredStocks.length === 0 ? (
        <div className="rounded-[24px] border border-slate-200 bg-white p-10 text-center shadow-md dark:border-slate-700 dark:bg-slate-900">
          <p className="text-slate-500 dark:text-slate-400">
            Aucun stock trouvé.
          </p>
        </div>
      ) : (
        <StocksTable
          stocks={filteredStocks}
          canUpdate={canUpdate}
          onUpdateClick={(stock) => setSelectedStock(stock)}
        />
      )}

      <UpdateStockModal
        isOpen={!!selectedStock}
        isLoading={updating}
        centreId={selectedStock?.centre_id ?? null}
        currentGroup={selectedStock?.groupe_sanguin ?? ""}
        currentQuantity={selectedStock?.quantite ?? 0}
        onClose={() => setSelectedStock(null)}
        onSubmit={handleUpdateSubmit}
      />
    </div>
  );
}