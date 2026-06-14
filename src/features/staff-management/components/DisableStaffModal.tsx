import { staffManagementService } from "../services/staff-management.service";
import { useToast } from "../../auth/store/toast.store";

import type { Staff } from "../types/staff-management.types";

type Props = {
  isOpen: boolean;
  staff: Staff | null;
  onClose: () => void;
  onSuccess: () => void;
};

export default function DisableStaffModal({
  isOpen,
  staff,
  onClose,
  onSuccess,
}: Props) {
  const { showToast } = useToast();

  if (!isOpen || !staff) return null;

  const handleDisable = async () => {
    try {
      await staffManagementService.disableStaff(
        staff.id_utilisateur
      );

      showToast(
        "Staff désactivé avec succès.",
        "success"
      );

      onSuccess();
      onClose();
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Impossible de désactiver le staff";

      showToast(message, "error");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-[24px] bg-white p-6 shadow-2xl dark:bg-slate-900">
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
          Désactiver le staff
        </h2>

        <p className="mt-4 text-slate-600 dark:text-slate-300">
          Voulez-vous vraiment désactiver :
        </p>

        <p className="mt-2 font-bold text-red-600">
          {staff.nom} {staff.prenom}
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-2xl border border-slate-300 px-4 py-2"
          >
            Annuler
          </button>

          <button
            onClick={handleDisable}
            className="rounded-2xl bg-red-600 px-4 py-2 font-bold text-white hover:bg-red-700"
          >
            Désactiver
          </button>
        </div>
      </div>
    </div>
  );
}