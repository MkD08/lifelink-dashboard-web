import { useState } from "react";

import { useToast } from "../../auth/store/toast.store";

import { adminsService } from "../services/admins.service";

import type { Admin } from "../types/admin.types";

type Props = {
  admin: Admin | null;

  isOpen: boolean;

  onClose: () => void;

  onDisabled: () => Promise<void>;
};

export default function DisableAdminModal({
  admin,
  isOpen,
  onClose,
  onDisabled,
}: Props) {
  const { showToast } = useToast();

  const [loading, setLoading] =
    useState(false);

  if (!isOpen || !admin)
    return null;

  const handleDisable =
    async () => {
      try {
        setLoading(true);

        await adminsService.disableAdmin(
          admin.id_utilisateur
        );

        await onDisabled();

        onClose();

        showToast(
          "Administrateur désactivé avec succès.",
          "success"
        );
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Impossible de désactiver l'administrateur";

        showToast(
          message,
          "error"
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-lg rounded-[24px] bg-white p-6 shadow-2xl dark:bg-slate-900">
        <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
          Désactiver administrateur
        </h3>

        <p className="mt-4 text-slate-600 dark:text-slate-400">
          Voulez-vous vraiment
          désactiver :

          <span className="font-bold">
            {" "}
            {admin.nom}{" "}
            {admin.prenom}
          </span>
          ?
        </p>

        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-2xl border border-slate-300 px-4 py-3 font-semibold dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          >
            Annuler
          </button>

          <button
            onClick={handleDisable}
            disabled={loading}
            className="flex-1 rounded-2xl bg-red-600 px-4 py-3 font-bold text-white"
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