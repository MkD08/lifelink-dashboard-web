import { useState } from "react";

import { useToast } from "../../auth/store/toast.store";

import { directorsService } from "../services/directors.service";

import type { Director } from "../types/director.types";

type Props = {
  director: Director | null;
  isOpen: boolean;
  onClose: () => void;
  onDeleted: () => Promise<void>;
};

export default function DeleteDirectorModal({
  director,
  isOpen,
  onClose,
  onDeleted,
}: Props) {
  const { showToast } = useToast();

  const [loading, setLoading] =
    useState(false);

  const [error, setError] = useState("");

  if (!isOpen || !director)
    return null;

  const fullName =
    `${director.nom ?? ""} ${
      director.prenom ?? ""
    }`.trim() || "Directeur";

  /**
   * DELETE
   */
  const handleDelete = async () => {
    setError("");

    try {
      setLoading(true);

      await directorsService.deleteDirector(
        director.id_utilisateur
      );

      await onDeleted();

      onClose();

      showToast(
        "Directeur désactivé avec succès.",
        "success"
      );
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Impossible de désactiver le directeur";

      setError(message);

      showToast(message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-[24px] bg-white p-6 shadow-2xl dark:bg-slate-900">
        <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
          Désactiver directeur
        </h3>

        <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
          Voulez-vous vraiment désactiver
          le compte de{" "}
          <span className="font-bold">
            {fullName}
          </span>{" "}
          ?
        </p>

        {error && (
          <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
            {error}
          </div>
        )}

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex-1 rounded-2xl border border-slate-300 px-4 py-3 font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60 dark:border-slate-700 dark:text-white dark:hover:bg-slate-800"
          >
            Annuler
          </button>

          <button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="flex-1 rounded-2xl bg-red-600 px-4 py-3 font-bold text-white hover:bg-red-700 disabled:opacity-60"
          >
            {loading
              ? "Désactivation..."
              : "Désactiver"}
          </button>
        </div>
      </div>
    </div>
  );
}