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
  const [quantite, setQuantite] = useState(String(currentQuantity));

  useEffect(() => {
    setQuantite(String(currentQuantity));
  }, [currentQuantity]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(Number(quantite));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-[24px] bg-white dark:bg-slate-900 p-6 shadow-2xl">
        <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
          Mettre à jour le stock
        </h3>

        <div className="mt-4 space-y-2 text-sm text-slate-600">
          <p>
            Centre : <span className="font-semibold">#{centreId ?? "—"}</span>
          </p>
          <p>
            Groupe sanguin : <span className="font-semibold">{currentGroup}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Nouvelle quantité
            </label>
            <input
              type="number"
              min="0"
              value={quantite}
              onChange={(e) => setQuantite(e.target.value)}
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-red-500"
              required
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-2xl border border-slate-300 px-4 py-3 font-semibold text-slate-700 hover:bg-slate-50"
            >
              Annuler
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 rounded-2xl bg-red-600 px-4 py-3 font-bold text-white hover:bg-red-700 disabled:opacity-60"
            >
              {isLoading ? "Mise à jour..." : "Valider"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}