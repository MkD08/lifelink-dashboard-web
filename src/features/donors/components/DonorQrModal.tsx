type Props = {
    isOpen: boolean;
    donorName: string;
    qrValue: string | null;
    loading?: boolean;
    error?: string;
    onClose: () => void;
  };
  
  export default function DonorQrModal({
    isOpen,
    donorName,
    qrValue,
    loading = false,
    error = "",
    onClose,
  }: Props) {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
        <div className="w-full max-w-lg rounded-[24px] bg-white dark:bg-slate-900 p-6 shadow-2xl">
          <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
            QR du donneur
          </h3>
          <p className="mt-2 text-sm text-slate-500">{donorName}</p>
  
          <div className="mt-6 rounded-[24px] border border-slate-200 bg-slate-50 p-6">
            {loading ? (
              <div className="py-16 text-center text-slate-500">
                Génération du QR...
              </div>
            ) : error ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {error}
              </div>
            ) : qrValue ? (
              <div className="flex flex-col items-center gap-4">
                <img
                  src={qrValue}
                  alt="QR code donneur"
                  className="h-64 w-64 rounded-2xl border border-slate-200 bg-white dark:bg-slate-900 p-3"
                />
              </div>
            ) : (
              <div className="py-16 text-center text-slate-500">
                Aucun QR disponible.
              </div>
            )}
          </div>
  
          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="rounded-2xl border border-slate-300 px-4 py-3 font-semibold text-slate-700 hover:bg-slate-50"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    );
  }