import { useState } from "react";
import { useToast } from "../../auth/store/toast.store";
import { adminUsersService } from "../services/admin-users.service";
import type { AdminUser } from "../types/admin-user.types";

type Props = {
  user: AdminUser | null;
  isOpen: boolean;
  onClose: () => void;
  onDeleted: () => Promise<void>;
};

export default function DeleteAdminUserModal({
  user,
  isOpen,
  onClose,
  onDeleted,
}: Props) {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen || !user) return null;

  const fullName = `${user.nom ?? ""} ${user.prenom ?? ""}`.trim() || "Utilisateur";

  const handleDelete = async () => {
    setError("");

    try {
      setLoading(true);

      await adminUsersService.deleteUser(user.id_utilisateur);
      await onDeleted();
      onClose();

      showToast("Utilisateur désactiver avec succès.", "success");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Impossible de désactiver l'utilisateur";

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
        Désactiver l’utilisateur
        </h3>

        <p className="mt-3 text-sm text-slate-600">
          Voulez-vous vraiment désactiver ce compte{" "}
          <span className="font-bold">{fullName}</span> ?
        </p>

        {error && (
          <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex-1 rounded-2xl border border-slate-300 px-4 py-3 font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
          >
            Annuler
          </button>

          <button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="flex-1 rounded-2xl bg-red-600 px-4 py-3 font-bold text-white hover:bg-red-700 disabled:opacity-60"
          >
            {loading ? "Désactivation..." : "Désactiver utilisateur"}
          </button>
        </div>
      </div>
    </div>
  );
}