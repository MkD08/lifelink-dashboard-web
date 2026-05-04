import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../features/auth/store/auth.store";
import { api } from "../lib/axios";
import type { Alert } from "../features/alerts/services/alerts.service";

/* =========================
   THEME DROPDOWN
========================= */
function ThemeDropdown() {
  const [open, setOpen] = useState(false);

  const applyTheme = (value: "light" | "dark" | "auto") => {
    const root = document.documentElement;
    root.classList.remove("dark");

    if (value === "dark") root.classList.add("dark");

    if (value === "auto") {
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        root.classList.add("dark");
      }
    }

    localStorage.setItem("theme", value);
  };

  useEffect(() => {
    const saved = (localStorage.getItem("theme") as any) || "auto";
    applyTheme(saved);
  }, []);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="rounded-2xl border border-slate-300 p-2 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-slate-700 dark:text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeWidth={2} d="M12 3v1m0 16v1m8.66-10H20M4 12H3"/>
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-40 rounded-2xl border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-900 z-50">
          {["light", "dark", "auto"].map((t) => (
            <button
              key={t}
              onClick={() => { applyTheme(t as any); setOpen(false); }}
              className="block w-full px-4 py-2 text-left text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {t}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* =========================
   NOTIFICATIONS DROPDOWN
========================= */
function NotificationsDropdown({ alerts }: { alerts: Alert[] }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const urgent = alerts.filter(a => a.type === "urgent");

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative rounded-2xl border border-slate-300 p-2 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
      >
        🔔

        {urgent.length > 0 && (
          <span className="absolute -top-2 -right-2 h-5 min-w-[20px] rounded-full bg-red-600 text-xs text-white flex items-center justify-center px-1">
            {urgent.length}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900 z-50">

          {/* HEADER */}
          <div className="p-4 border-b border-slate-200 dark:border-slate-700">
            <p className="font-bold text-slate-900 dark:text-white">
              Notifications
            </p>
          </div>

          {/* LIST */}
          <div className="max-h-80 overflow-y-auto">
            {alerts.length === 0 && (
              <p className="p-4 text-sm text-slate-500">
                Aucune notification
              </p>
            )}

            {alerts.slice(0, 5).map((alert) => (
              <div
                key={alert.id_alerte}
                className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                onClick={() => navigate("/alerts")}
              >
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  {alert.titre || "Notification"}
                </p>

                <p className="text-xs text-slate-500">
                  {alert.message || "—"}
                </p>
              </div>
            ))}
          </div>

          {/* FOOTER */}
          <div
            onClick={() => navigate("/alerts")}
            className="p-3 text-center text-sm font-semibold text-red-600 cursor-pointer hover:underline"
          >
            Voir toutes les notifications
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================
   TOPBAR
========================= */
export default function Topbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [alerts, setAlerts] = useState<Alert[]>([]);

  const fullName =
    [user?.nom, user?.prenom].filter(Boolean).join(" ") || "Utilisateur";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const loadAlerts = async () => {
    try {
      const res = await api.get("/alerts");
      setAlerts(res.data?.data ?? []);
    } catch {
      setAlerts([]);
    }
  };

  useEffect(() => {
    loadAlerts();
    const interval = setInterval(loadAlerts, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6 dark:border-slate-800 dark:bg-slate-900">

      {/* LEFT */}
      <div>
        <h1 className="text-lg font-extrabold text-slate-900 dark:text-white">
          Tableau de bord
        </h1>
        <p className="text-sm text-slate-500">
          Bienvenue, {fullName}
        </p>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-3">

        <ThemeDropdown />

        <NotificationsDropdown alerts={alerts} />

        <div className="rounded-2xl bg-slate-100 px-4 py-2 text-sm font-semibold dark:bg-slate-800 dark:text-white">
          {fullName}
        </div>

        <button
          onClick={handleLogout}
          className="rounded-2xl bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-700"
        >
          Déconnexion
        </button>

      </div>
    </header>
  );
}