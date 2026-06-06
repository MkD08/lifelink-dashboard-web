import { useEffect, useRef, useState } from "react";

import { Html5Qrcode } from "html5-qrcode";

import {
  QrCode,
  Camera,
  X,
} from "lucide-react";

import { donorsService } from "../services/donors.service";

import { useToast } from "../../auth/store/toast.store";

import { useAuth } from "../../auth/store/auth.store";

export default function ScanQrCard() {
  const { user } = useAuth();

  const { showToast } = useToast();

  const scannerRef =
    useRef<any>(null);

  const [qrData, setQrData] =
    useState("");

  const [centreId, setCentreId] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [result, setResult] =
    useState<any>(null);

  const [cameraOpen, setCameraOpen] =
    useState(false);

  // =========================
  // AUTO CENTRE ID
  // =========================
  useEffect(() => {
    if (user?.centre_id) {
      setCentreId(
        String(user.centre_id)
      );
    }
  }, [user]);

  const isStaffOrDirector =
    user?.role_id === 3 ||
    user?.role_id === 4;

  // =========================
  // START CAMERA
  // =========================
  const startScanner = async () => {
    try {
      if (scannerRef.current) return;
  
      setCameraOpen(true);
  
      showToast(
        "Démarrage caméra...",
        "success"
      );
  
      setTimeout(async () => {
        const html5QrCode =
          new Html5Qrcode("qr-reader");
  
        scannerRef.current =
          html5QrCode;
  
        const cameras =
          await Html5Qrcode.getCameras();
  
        if (!cameras.length) {
          throw new Error(
            "Aucune caméra détectée"
          );
        }
  
        await html5QrCode.start(
          {
            facingMode: "environment",
          },
  
          {
            fps: 10,
  
            qrbox: {
              width: 250,
              height: 250,
            },
          },
  
          async (
            decodedText
          ) => {
            console.log(
              "QR DETECTED:",
              decodedText
            );
  
            setQrData(
              decodedText
            );
  
            await stopScanner();
  
            showToast(
              "QR détecté avec succès",
              "success"
            );
  
            await handleScan(
              decodedText
            );
          },
  
          () => {}
        );
      }, 300);
    } catch (err) {
      console.error(err);
  
      setCameraOpen(false);
  
      showToast(
        "Impossible d’ouvrir la caméra",
        "error"
      );
    }
  };

  // =========================
  // STOP CAMERA
  // =========================
  const stopScanner = async () => {
    try {
      if (scannerRef.current) {
        await scannerRef.current.stop();
  
        await scannerRef.current.clear();
  
        scannerRef.current = null;
      }
    } catch (err) {
      console.error(err);
    }
  
    setCameraOpen(false);
  };

  // =========================
  // HANDLE SCAN
  // =========================
  const handleScan =
    async (qr?: string) => {
      setError("");

      setResult(null);

      try {
        setLoading(true);

        console.log(
          "🚀 SEND QR:",
          qr || qrData
        );

        const data =
          await donorsService.scanQr(
            qr ||
              qrData.trim(),

            Number(
              centreId
            )
          );

        console.log(
          "✅ SCAN RESULT:",
          data
        );

        setResult(data);

        setQrData("");

        showToast(
          data?.message ||
            "QR scanné avec succès.",
          "success"
        );
      } catch (err) {
        console.error(
          "❌ SCAN ERROR:",
          err
        );

        const message =
          err instanceof Error
            ? err.message
            : "Impossible de scanner le QR";

        setError(message);

        if (
          message.includes(
            "période de récupération"
          )
        ) {
        
          showToast(
            "⚠️ Donneur temporairement inéligible",
            "info"
          );
        
        } else {
        
          showToast(
            message,
            "error"
          );
        }
      } finally {
        setLoading(false);
      }
    };

  // =========================
  // MANUAL SUBMIT
  // =========================
  const handleSubmit =
    async (
      e: React.FormEvent
    ) => {
      e.preventDefault();

      await handleScan();
    };

  return (
    <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-md dark:border-slate-800 dark:bg-slate-900">

      {/* HEADER */}
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
          Scanner QR donneur
        </h2>

        <p className="mt-2 text-slate-500 dark:text-slate-400">
          Scanner un QR code
          avec la caméra ou
          saisir manuellement
          l’identifiant du
          donneur.
        </p>
      </div>

      {/* CAMERA SECTION */}
      <div className="mt-6 rounded-[24px] border border-red-100 bg-red-50 p-6 dark:border-red-900/40 dark:bg-red-950/20">

        <div className="flex flex-col items-center justify-center text-center">

          {/* ICON */}
          <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-red-600 shadow-lg">

            <QrCode
              size={42}
              className="text-white"
            />

          </div>

          <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
            Scan QR avec caméra
          </h3>

          <p className="mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">
            Utilisez la caméra
            du téléphone ou du
            PC pour scanner
            automatiquement le
            QR code du donneur.
          </p>

          {/* BUTTONS */}
          {!cameraOpen ? (
            <button
              onClick={
                startScanner
              }
              className="mt-6 inline-flex items-center gap-3 rounded-2xl bg-red-600 px-8 py-4 text-lg font-bold text-white shadow-lg transition hover:bg-red-700"
            >
              <Camera size={22} />

              Scanner QR
            </button>
          ) : (
            <button
              onClick={
                stopScanner
              }
              className="mt-6 inline-flex items-center gap-3 rounded-2xl border border-red-300 bg-white px-8 py-4 text-lg font-bold text-red-700 transition hover:bg-red-100 dark:bg-slate-900"
            >
              <X size={22} />

              Fermer caméra
            </button>
          )}

        </div>

        {/* CAMERA */}
        {cameraOpen && (
          <div className="mt-6 overflow-hidden rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">

            <div className="mb-4 text-center">

              <p className="text-sm font-semibold text-green-600">
                📷 Caméra active...
              </p>

            </div>

            <div
              id="qr-reader"
              className="min-h-[320px] overflow-hidden rounded-2xl"
            />

          </div>
        )}
      </div>

      {/* MANUAL INPUT */}
      <div className="mt-8">

        <div className="mb-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Saisie manuelle
          </h3>

          <p className="text-sm text-slate-500 dark:text-slate-400">
            Utiliser l’ID du
            QR code si la caméra
            n’est pas disponible.
          </p>
        </div>

        <form
          onSubmit={
            handleSubmit
          }
          className="grid gap-4 md:grid-cols-2"
        >

          {/* QR INPUT */}
          <input
            type="text"
            placeholder="QR data / ID utilisateur"
            value={qrData}
            onChange={(e) =>
              setQrData(
                e.target.value
              )
            }
            className="rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-red-500 md:col-span-2 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            required
          />

          {/* CENTRE */}
          <input
            type="number"
            placeholder="Centre ID"
            value={centreId}
            onChange={(e) =>
              setCentreId(
                e.target.value
              )
            }
            disabled={
              isStaffOrDirector
            }
            className={`
              rounded-2xl border px-4 py-3 outline-none transition focus:border-red-500

              ${
                isStaffOrDirector
                  ? "cursor-not-allowed bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500"
                  : "border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              }
            `}
            required
          />

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={loading}
            className="rounded-2xl bg-slate-900 px-4 py-3 font-bold text-white transition hover:bg-slate-800 disabled:opacity-60 dark:bg-white dark:text-slate-900"
          >
            {loading
              ? "Validation..."
              : "Valider"}
          </button>

        </form>
      </div>

      {/* ERROR */}
      {error && (
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-900/40 dark:bg-red-950/20 dark:text-red-300">
          {error}
        </div>
      )}

      {/* RESULT */}
      {result && (
        <div className="mt-6 rounded-[24px] border border-green-200 bg-green-50 p-5 dark:border-green-900/40 dark:bg-green-950/20">

          <h3 className="text-lg font-extrabold text-green-700 dark:text-green-300">
            Scan réussi
          </h3>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">

            <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
              <p className="text-sm text-slate-500">
                Message
              </p>

              <p className="mt-2 font-bold text-slate-900 dark:text-white">
                {result?.message ||
                  "—"}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
              <p className="text-sm text-slate-500">
                Succès
              </p>

              <p className="mt-2 font-bold text-slate-900 dark:text-white">
                {result?.success
                  ? "Oui"
                  : "Non"}
              </p>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}