import { useState } from "react";
import { collectesService } from "../services/collectes.service";
import { useToast } from "../../auth/store/toast.store";
import type { Collecte } from "../types/collecte.types";

type Props = {
  collecte: Collecte | null;
  isOpen: boolean;
  onClose: () => void;
  onDeleted: () => Promise<void>;
};

export default function DeleteCollecteModal({
  collecte,
  isOpen,
  onClose,
  onDeleted,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { showToast } = useToast();

  if (!isOpen || !collecte) return null;

  const handleDelete = async () => {
    setError("");

    try {
      setLoading(true);

      await collectesService.delete(collecte.id_collecte);
      await onDeleted();
      onClose();

      showToast("Collecte supprimée avec succès.", "success");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Impossible de supprimer";

      setError(message);
      showToast(message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-[24px] bg-white dark:bg-slate-900 p-6 shadow-2xl">

        <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
          Supprimer la collecte
        </h3>

        <p className="mt-3 text-sm text-slate-600">
          Voulez-vous vraiment supprimer{" "}
          <span className="font-bold">{collecte.titre}</span> ?
        </p>

        {error && (
          <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 rounded-2xl border border-slate-300 px-4 py-3 font-semibold"
          >
            Annuler
          </button>

          <button
            onClick={handleDelete}
            disabled={loading}
            className="flex-1 rounded-2xl bg-red-600 px-4 py-3 font-bold text-white"
          >
            {loading ? "Suppression..." : "Supprimer"}
          </button>
        </div>

      </div>
    </div>
  );
}