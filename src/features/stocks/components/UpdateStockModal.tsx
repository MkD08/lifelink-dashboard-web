import { useEffect, useState } from "react";

type Props = {
  isOpen: boolean;
  isLoading?: boolean;
  centreId: number | null;
  currentGroup: string;
  currentQuantity: number;
  onClose: () => void;
  onSubmit: (quantite: number) => Promise<void>;
};

export default function UpdateStockModal({
  isOpen,
  isLoading = false,
  centreId,
  currentGroup,
  currentQuantity,
  onClose,
  onSubmit,
}: Props) {
  const [quantite, setQuantite] = useState(
    String(currentQuantity)
  );

  useEffect(() => {
    setQuantite(
      String(currentQuantity)
    );
  }, [currentQuantity]);

  if (!isOpen) return null;

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    await onSubmit(
      Number(quantite)
    );
  };

  return (
    <div
      className="
        fixed inset-0 z-[9999]
        flex items-center justify-center
        bg-black/50
        p-4
        backdrop-blur-sm
      "
    >

      {/* MODAL */}
      <div
        className="
          w-full max-w-md
          rounded-[28px]
          bg-white
          p-6
          shadow-2xl
          dark:bg-slate-900
          animate-in fade-in zoom-in
        "
      >

        {/* HEADER */}
        <div>
          <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Mettre à jour le stock
          </h3>

          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Modifier la quantité du stock sanguin.
          </p>
        </div>

        {/* INFOS */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2">

          <div className="rounded-2xl bg-slate-100 p-4 dark:bg-slate-800">
            <p className="text-xs text-slate-500">
              Centre
            </p>

            <p className="mt-2 text-lg font-bold text-slate-900 dark:text-white">
              #{centreId ?? "—"}
            </p>
          </div>

          <div className="rounded-2xl bg-red-50 p-4 dark:bg-red-900/20">
            <p className="text-xs text-slate-500">
              Groupe sanguin
            </p>

            <p className="mt-2 text-lg font-bold text-red-600 dark:text-red-400">
              {currentGroup}
            </p>
          </div>

        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="mt-6 space-y-5"
        >

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Nouvelle quantité
            </label>

            <input
              type="number"
              min="0"
              value={quantite}
              onChange={(e) =>
                setQuantite(
                  e.target.value
                )
              }
              className="
                w-full rounded-2xl
                border border-slate-300
                bg-white
                px-4 py-3
                outline-none
                focus:border-red-500

                dark:border-slate-700
                dark:bg-slate-800
                dark:text-white
              "
              required
            />
          </div>

          {/* ACTIONS */}
          <div className="flex flex-col gap-3 sm:flex-row">

            <button
              type="button"
              onClick={onClose}
              className="
                flex-1 rounded-2xl
                border border-slate-300
                px-4 py-3
                font-semibold
                text-slate-700
                transition
                hover:bg-slate-100

                dark:border-slate-700
                dark:text-white
                dark:hover:bg-slate-800
              "
            >
              Annuler
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="
                flex-1 rounded-2xl
                bg-red-600
                px-4 py-3
                font-bold text-white
                transition
                hover:bg-red-700
                disabled:opacity-60
              "
            >
              {isLoading
                ? "Mise à jour..."
                : "Valider"}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}