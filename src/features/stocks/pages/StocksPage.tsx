import { useEffect, useMemo, useState } from "react";

import { useAuth }
from "../../auth/store/auth.store";

import { useToast }
from "../../auth/store/toast.store";

import StocksTable
from "../../../components/tables/StocksTable";

import UpdateStockModal
from "../components/UpdateStockModal";

import CreateStockModal
from "../components/CreateStockModal";

import { stocksService }
from "../services/stocks.service";

import {
  exportToCsv,
  exportToPdf,
} from "../../../utils/export";

import type {
  BloodStock,
} from "../types/stock.types";

export default function StocksPage() {

  const { user } =
    useAuth();

  const { showToast } =
    useToast();

  const [stocks, setStocks] =
    useState<BloodStock[]>([]);

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [updating, setUpdating] =
    useState(false);

  const [error, setError] =
    useState("");

  const [
    selectedStock,
    setSelectedStock
  ] =
    useState<BloodStock | null>(
      null
    );

  const [
    createOpen,
    setCreateOpen
  ] =
    useState(false);

  const roleId =
    user?.role_id;

  const canUpdate =
    roleId === 1 ||
    roleId === 3 ||
    roleId === 4;

  // ==============================
  // LOAD STOCKS
  // ==============================

  const loadStocks =
    async () => {

      setLoading(true);

      setError("");

      try {

        const data =
          await stocksService.getAllStocks();

        setStocks(data);

      } catch (err) {

        const message =
          err instanceof Error
            ? err.message
            : "Impossible de charger les stocks";

        setError(message);

      } finally {

        setLoading(false);
      }
    };

  useEffect(() => {

    loadStocks();

  }, []);

  // ==============================
  // FILTER
  // ==============================

  const filteredStocks =
    useMemo(() => {

      const term =
        search
          .trim()
          .toLowerCase();

      if (!term)
        return stocks;

      return stocks.filter(
        (stock) => {

          const centreId =
            String(
              stock.centre_id ?? ""
            );

          const centre =
            stock.centre_nom
              ?.toLowerCase() ?? "";

          const ville =
            stock.ville
              ?.toLowerCase() ?? "";

          const blood =
            stock.groupe_sanguin
              .toLowerCase();

          return (
            centreId.includes(term)
            ||
            centre.includes(term)
            ||
            ville.includes(term)
            ||
            blood.includes(term)
          );
        }
      );
    }, [stocks, search]);

  // ==============================
  // STATS
  // ==============================

  const totalQuantity =
    stocks.reduce(
      (sum, stock) =>
        sum + stock.quantite,
      0
    );

  const criticalCount =
    stocks.filter(
      (stock) =>
        stock.quantite <= 5
    ).length;

  // ==============================
  // UPDATE STOCK
  // ==============================

  const handleUpdateSubmit =
    async (
      quantite: number
    ) => {

      if (!selectedStock)
        return;

      try {

        setUpdating(true);

        await stocksService.updateStock(

          selectedStock.groupe_sanguin,

          quantite
        );

        setSelectedStock(null);

        await loadStocks();

        showToast(
          "Stock mis à jour avec succès.",
          "success"
        );

      } catch (err) {

        const message =
          err instanceof Error
            ? err.message
            : "Impossible de mettre à jour le stock";

        setError(message);

        showToast(
          message,
          "error"
        );

      } finally {

        setUpdating(false);
      }
    };

  // ==============================
  // CREATE STOCK
  // ==============================

  const handleCreateStock =
    async (
      groupe: string,
      quantite: number
    ) => {

      try {

        setUpdating(true);

        await stocksService.updateStock(
          groupe,
          quantite
        );

        setCreateOpen(false);

        await loadStocks();

        showToast(
          "Stock créé avec succès.",
          "success"
        );

      } catch (err) {

        const message =
          err instanceof Error
            ? err.message
            : "Erreur création stock";

        showToast(
          message,
          "error"
        );

      } finally {

        setUpdating(false);
      }
    };

  // ==============================
  // EXPORT CONFIG
  // ==============================

  const stockColumns = [

    {
      header: "Centre ID",

      accessor: (
        s: BloodStock
      ) =>
        s.centre_id ?? "—",
    },

    {
      header: "Centre",

      accessor: (
        s: BloodStock
      ) =>
        s.centre_nom || "—",
    },

    {
      header: "Ville",

      accessor: (
        s: BloodStock
      ) =>
        s.ville || "—",
    },

    {
      header: "Groupe sanguin",

      accessor: (
        s: BloodStock
      ) =>
        s.groupe_sanguin,
    },

    {
      header: "Quantité",

      accessor: (
        s: BloodStock
      ) =>
        s.quantite,
    },
  ];

  return (

    <div className="space-y-6">

      {/* HERO */}

      <div
        className="
          rounded-[24px]
          border border-slate-200
          bg-white
          p-6
          shadow-md

          dark:border-slate-700
          dark:bg-slate-900
        "
      >

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

          {/* LEFT */}
          <div>

            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              Stocks sanguins
            </h2>

            <p className="mt-2 text-slate-500 dark:text-slate-400">
              Gestion sécurisée des stocks de sang par centre médical.
            </p>

          </div>

          {/* ACTIONS */}
          <div className="flex flex-col gap-3 lg:flex-row">

            <input
              type="text"
              placeholder="Rechercher..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              className="
                rounded-2xl
                border border-slate-300
                bg-white
                px-4 py-3
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
                  "stocks",
                  filteredStocks,
                  stockColumns
                )
              }
              className="
                rounded-2xl
                border border-slate-300
                px-4 py-3
                font-semibold
                text-slate-700
                hover:bg-slate-100

                dark:border-slate-700
                dark:text-white
              "
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

            {
              canUpdate && (

                <button
                  onClick={() =>
                    setCreateOpen(true)
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
                  + Ajouter stock
                </button>
              )
            }

          </div>
        </div>
      </div>

      {/* STATS */}

      <div className="grid gap-4 md:grid-cols-3">

        <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-md dark:border-slate-700 dark:bg-slate-900">

          <p className="text-sm text-slate-500 dark:text-slate-400">
            Total stocks
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

          <h3 className="mt-2 text-3xl font-extrabold text-red-600 dark:text-red-400">
            {criticalCount}
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
          onUpdateClick={(stock) =>
            setSelectedStock(stock)
          }
        />
      )}

      {/* UPDATE MODAL */}

      <UpdateStockModal
        isOpen={!!selectedStock}
        isLoading={updating}
        centreId={
          selectedStock?.centre_id
          ?? null
        }
        currentGroup={
          selectedStock?.groupe_sanguin
          ?? ""
        }
        currentQuantity={
          selectedStock?.quantite
          ?? 0
        }
        onClose={() =>
          setSelectedStock(null)
        }
        onSubmit={
          handleUpdateSubmit
        }
      />

      {/* CREATE MODAL */}

      <CreateStockModal
        isOpen={createOpen}
        isLoading={updating}
        onClose={() =>
          setCreateOpen(false)
        }
        onSubmit={
          handleCreateStock
        }
      />

    </div>
  );
}