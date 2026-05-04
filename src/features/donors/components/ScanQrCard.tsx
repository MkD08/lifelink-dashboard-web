import { useState, useEffect } from "react";
import { donorsService } from "../services/donors.service";
import { useToast } from "../../auth/store/toast.store";
import { useAuth } from "../../auth/store/auth.store";

export default function ScanQrCard() {
  const { user } = useAuth();

  const [qrData, setQrData] = useState("");
  const [centreId, setCentreId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<any>(null);

  const { showToast } = useToast();

  // 🔥 AUTO SET CENTRE ID
  useEffect(() => {
    if (user?.centre_id) {
      setCentreId(String(user.centre_id));
    }
  }, [user]);

  const isStaffOrDirector = user?.role_id === 2 || user?.role_id === 4;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setResult(null);

    try {
      setLoading(true);

      const data = await donorsService.scanQr(
        qrData.trim(),
        Number(centreId)
      );

      setResult(data);
      setQrData("");

      showToast(data?.message || "QR scanné avec succès.", "success");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Impossible de scanner le QR";

      setError(message);
      showToast(message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-[24px] border border-slate-200 bg-white dark:bg-slate-900 p-6 shadow-md">
      <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
        Scanner un QR donneur
      </h2>

      <p className="mt-2 text-slate-500">
        Permet de valider un don à partir du QR du donneur.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 grid gap-4 md:grid-cols-2">
        
        {/* QR INPUT */}
        <input
          type="text"
          placeholder="QR data"
          value={qrData}
          onChange={(e) => setQrData(e.target.value)}
          className="rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-red-500 md:col-span-2 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
          required
        />

        {/* CENTRE ID */}
        <input
          type="number"
          placeholder="Centre ID"
          value={centreId}
          onChange={(e) => setCentreId(e.target.value)}
          disabled={isStaffOrDirector}
          className={`rounded-2xl border px-4 py-3 outline-none focus:border-red-500 
            ${isStaffOrDirector 
              ? "bg-slate-100 text-slate-400 cursor-not-allowed dark:bg-slate-800 dark:text-slate-500" 
              : "border-slate-300 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
            }`}
          required
        />

        {/* BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className="rounded-2xl bg-red-600 px-4 py-3 font-bold text-white hover:bg-red-700 disabled:opacity-60 transition"
        >
          {loading ? "Scan en cours..." : "Scanner le QR"}
        </button>
      </form>

      {/* ERROR */}
      {error && (
        <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      {/* RESULT */}
      {result && (
        <div className="mt-6 rounded-[24px] border border-slate-200 bg-slate-50 dark:bg-slate-800 p-5">
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
            Résultat
          </h3>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white dark:bg-slate-900 p-4">
              <p className="text-sm text-slate-500">Message</p>
              <p className="mt-2 font-bold text-slate-900 dark:text-white">
                {result?.message || "—"}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white dark:bg-slate-900 p-4">
              <p className="text-sm text-slate-500">Succès</p>
              <p className="mt-2 font-bold text-slate-900 dark:text-white">
                {result?.success ? "Oui" : "Non"}
              </p>
            </div>
          </div>

          {result?.don && (
            <div className="mt-4 rounded-2xl border border-slate-200 bg-white dark:bg-slate-900 p-4">
              <p className="text-sm text-slate-500">Don créé</p>
              <pre className="mt-2 overflow-x-auto text-xs text-slate-700 dark:text-slate-300">
                {JSON.stringify(result.don, null, 2)}
              </pre>
            </div>
          )}

          {result?.certificat && (
            <div className="mt-4 rounded-2xl border border-slate-200 bg-white dark:bg-slate-900 p-4">
              <p className="text-sm text-slate-500">Certificat</p>
              <pre className="mt-2 overflow-x-auto text-xs text-slate-700 dark:text-slate-300">
                {JSON.stringify(result.certificat, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}