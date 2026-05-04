import type { RequestStatus } from "../types/request.types";

type Props = {
  requestId: number;
  currentStatus: RequestStatus;
  isOpen: boolean;
  onClose: () => void;
};

export default function RequestStatusModal({
  requestId,
  currentStatus,
  isOpen,
  onClose,
}: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-[24px] bg-white dark:bg-slate-900 p-6 shadow-2xl">
        <div className="mb-5">
          <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
            Statut de la demande
          </h3>
          <p className="mt-2 text-sm text-slate-500">
            Demande : <span className="font-semibold">#{requestId}</span>
          </p>
        </div>

        <div className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Statut actuel
            </label>

            <div
              className={`w-full rounded-2xl px-4 py-3 font-semibold ${
                currentStatus === "satisfaite"
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {currentStatus}
            </div>
          </div>

          <div className="flex">
            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-2xl bg-red-600 px-4 py-3 font-bold text-white hover:bg-red-700"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}