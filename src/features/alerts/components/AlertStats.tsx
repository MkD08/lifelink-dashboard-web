import type { Alert } from "../types/alert.types";

interface Props {
  alerts: Alert[];
}

export default function AlertsStats({ alerts }: Props) {
  const stats = {
    total: alerts.length,
    urgent: alerts.filter((a) => a.type === "urgent").length,
    warning: alerts.filter((a) => a.type === "warning").length,
    info: alerts.filter((a) => a.type === "info").length,
  };

  return (
    <div className="grid grid-cols-4 gap-3">

      <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border">
        <p className="text-xs text-slate-500">Total</p>
        <h3 className="text-lg font-bold">{stats.total}</h3>
      </div>

      <div className="bg-red-50 p-3 rounded-xl border border-red-100">
        <p className="text-xs text-red-500">Urgent</p>
        <h3 className="text-lg font-bold text-red-600">{stats.urgent}</h3>
      </div>

      <div className="bg-yellow-50 p-3 rounded-xl border border-yellow-100">
        <p className="text-xs text-yellow-600">Warning</p>
        <h3 className="text-lg font-bold text-yellow-600">{stats.warning}</h3>
      </div>

      <div className="bg-blue-50 p-3 rounded-xl border border-blue-100">
        <p className="text-xs text-blue-600">Info</p>
        <h3 className="text-lg font-bold text-blue-600">{stats.info}</h3>
      </div>

    </div>
  );
}