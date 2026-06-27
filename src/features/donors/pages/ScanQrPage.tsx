import { useLocation } from "react-router-dom";
import ScanQrCard from "../components/ScanQrCard";
export default function ScanQrPage() {
  const location = useLocation();

const mode =
  location.state?.mode ?? "donation";
  return (
    <div className="space-y-6">
      <div className="rounded-[24px] border border-slate-200 bg-white dark:bg-slate-900 p-6 shadow-md">
        <h1 className="text-2xl font-extrabold ttext-slate-900 dark:text-white">
          Scan QR
        </h1>
        <p className="mt-2 text-slate-500">
          Scannez ou collez un QR donneur pour valider un don.
        </p>
      </div>

      <ScanQrCard mode={mode} />
    </div>
  );
}