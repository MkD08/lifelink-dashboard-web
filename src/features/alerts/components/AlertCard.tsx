import type { Alert } from "../types/alert.types";

interface Props {
  alert: Alert;
}

export default function AlertCard({ alert }: Props) {
  const badgeColor =
    alert.type === "urgent"
      ? "bg-red-100 text-red-700"
      : alert.type === "warning"
      ? "bg-yellow-100 text-yellow-700"
      : "bg-blue-100 text-blue-700";

  return (
    <div className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border flex items-start justify-between hover:shadow-md transition">

      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-sm">{alert.titre}</h3>

          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${badgeColor}`}>
            {alert.type}
          </span>
        </div>

        <p className="text-xs text-slate-500">
          {alert.message}
        </p>

        <div className="text-[11px] text-slate-400">
          {alert.centre?.nom ?? "Sans centre"} • {alert.ville} • {alert.groupe_sanguin}
        </div>
      </div>
    </div>
  );
}