type Props = {
    isOpen: boolean;
  
    loading?: boolean;
  
    alertTitle?: string;
  
    onClose: () => void;
  
    onConfirm: () => void;
  };
  
  export default function DeleteAlertModal({
    isOpen,
  
    loading = false,
  
    alertTitle,
  
    onClose,
  
    onConfirm,
  }: Props) {
  
    if (!isOpen)
      return null;
  
    return (
      <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/50 px-4">
  
        <div className="w-full max-w-md rounded-[28px] bg-white p-6 shadow-2xl dark:bg-slate-900">
  
          {/* HEADER */}
          <div>
  
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              Supprimer l’alerte
            </h2>
  
            <p className="mt-3 text-slate-500 dark:text-slate-400">
  
              Cette action est irréversible.
  
              <br />
  
              Voulez-vous vraiment supprimer cette alerte ?
  
            </p>
  
          </div>
  
          {/* ALERT INFO */}
          {alertTitle && (
  
            <div className="mt-5 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 dark:border-red-900 dark:bg-red-950/20">
  
              <p className="text-sm font-semibold text-red-700 dark:text-red-400">
  
                {alertTitle}
  
              </p>
  
            </div>
          )}
  
          {/* ACTIONS */}
          <div className="mt-6 flex gap-3">
  
            {/* CANCEL */}
            <button
              onClick={onClose}
              disabled={loading}
              className="
                flex-1
                rounded-2xl
                border border-slate-300
                px-4 py-3
                font-semibold
                text-slate-700
                transition
                hover:bg-slate-100
                disabled:opacity-60
  
                dark:border-slate-700
                dark:bg-slate-800
                dark:text-white
                dark:hover:bg-slate-700
              "
            >
              Annuler
            </button>
  
            {/* DELETE */}
            <button
              onClick={onConfirm}
              disabled={loading}
              className="
                flex-1
                rounded-2xl
                bg-red-600
                px-4 py-3
                font-bold
                text-white
                transition
                hover:bg-red-700
                disabled:opacity-60
              "
            >
              {loading
                ? "Suppression..."
                : "Supprimer"}
            </button>
  
          </div>
  
        </div>
  
      </div>
    );
  }