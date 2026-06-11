import type {
  RequestStatus,
} from "../types/request.types";

// ==============================
// Props
// ==============================

type Props = {

  requestId: number;

  currentStatus: RequestStatus;

  isOpen: boolean;

  onClose: () => void;
};

// ==============================
// Couleurs statuts
// ==============================

const statusStyles: Record<RequestStatus, string> = {

  EN_ATTENTE:
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",

  EN_COURS:
    "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",

  VALIDE:
    "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",

  TERMINE:
    "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
  
  DELIVREE: 
    "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",

  ANNULE:
    "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",

  REFUSE:
    "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300",
};

// ==============================
// Modal statut demande
// ==============================

export default function RequestStatusModal({

  requestId,

  currentStatus,

  isOpen,

  onClose,
}: Props) {

  // ==============================
  // Modal fermé
  // ==============================

  if (!isOpen) return null;

  return (

    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">

      <div className="w-full max-w-md rounded-[24px] bg-white p-6 shadow-2xl dark:bg-slate-900">

        {/* HEADER */}

        <div className="mb-5">

          <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
            Statut de la demande
          </h3>

          <p className="mt-2 text-sm text-slate-500">
            Demande :
            <span className="font-semibold">
              {" "}
              #{requestId}
            </span>
          </p>
        </div>

        {/* CONTENT */}

        <div className="space-y-5">

          {/* STATUT ACTUEL */}

          <div>

            <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Statut actuel
            </label>

            <div
              className={`w-full rounded-2xl px-4 py-3 font-semibold ${
                statusStyles[currentStatus]
              }`}
            >
              {currentStatus}
            </div>
          </div>

          {/* INFO WORKFLOW */}

          <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600 dark:bg-slate-800 dark:text-slate-300">

            <p>
              Cette demande suit maintenant
              un workflow professionnel
              multi-centres avec gestion
              des participations donneurs.
            </p>
          </div>

          {/* ACTIONS */}

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