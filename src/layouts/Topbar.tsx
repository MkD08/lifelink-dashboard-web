import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import {
  Bell,
  CheckCircle2,
  Menu,
  Moon,
  AlertTriangle,
  Info,
} from "lucide-react";

import { useAuth } from "../features/auth/store/auth.store";

import { api } from "../lib/axios";

import type { Alert } from "../features/alerts/services/alerts.service";

/* =========================
   THEME DROPDOWN
========================= */
function ThemeDropdown() {
  const [open, setOpen] =
    useState(false);

  const applyTheme = (
    value:
      | "light"
      | "dark"
      | "auto"
  ) => {
    const root =
      document.documentElement;

    root.classList.remove(
      "dark"
    );

    if (value === "dark") {
      root.classList.add(
        "dark"
      );
    }

    if (value === "auto") {
      if (
        window.matchMedia(
          "(prefers-color-scheme: dark)"
        ).matches
      ) {
        root.classList.add(
          "dark"
        );
      }
    }

    localStorage.setItem(
      "theme",
      value
    );
  };

  useEffect(() => {
    const saved =
      (localStorage.getItem(
        "theme"
      ) as any) || "auto";

    applyTheme(saved);
  }, []);

  return (
    <div className="relative">
      <button
        onClick={() =>
          setOpen(!open)
        }
        className="rounded-2xl border border-slate-300 p-2 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
      >
        <Moon
          size={18}
          className="text-slate-700 dark:text-white"
        />
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-40 rounded-2xl border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-900">

          {[
            "light",
            "dark",
            "auto",
          ].map((t) => (
            <button
              key={t}
              onClick={() => {
                applyTheme(
                  t as any
                );

                setOpen(false);
              }}
              className="block w-full px-4 py-2 text-left text-sm capitalize hover:bg-slate-100 dark:hover:bg-slate-800"
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
   ALERT STYLE
========================= */
function getAlertStyle(
  type: string
) {
  switch (type) {
    case "urgent":
      return {
        icon: (
          <AlertTriangle
            size={18}
          />
        ),

        badge:
          "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
      };

    case "warning":
      return {
        icon: (
          <AlertTriangle
            size={18}
          />
        ),

        badge:
          "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
      };

    default:
      return {
        icon: (
          <Info size={18} />
        ),

        badge:
          "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
      };
  }
}

/* =========================
   NOTIFICATIONS
========================= */
function NotificationsDropdown({
  alerts,
  reloadAlerts,
}: {
  alerts: Alert[];

  reloadAlerts: () => Promise<void>;
}) {
  const [open, setOpen] =
    useState(false);

  const navigate =
    useNavigate();

  // 🔥 unread only
  const unreadAlerts =
    alerts.filter(
      (a: any) =>
        !a.is_read
    );

  // =========================
  // MARK AS READ
  // =========================
  const markAsRead =
    async (
      id: number
    ) => {
      try {
        await api.put(
          `/alertes/${id}/read`
        );

        await reloadAlerts();

        navigate("/alerts");
      } catch (
        error
      ) {
        console.error(
          "❌ READ ERROR:",
          error
        );
      }
    };

  return (
    <div className="relative">
      {/* BUTTON */}
      <button
        onClick={() =>
          setOpen(!open)
        }
        className="relative rounded-2xl border border-slate-300 p-2 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
      >
        <Bell
          size={18}
          className="text-slate-700 dark:text-white"
        />

        {/* BADGE */}
        {unreadAlerts.length >
          0 && (
          <span className="absolute -right-2 -top-2 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-600 px-1 text-xs font-bold text-white">
            {
              unreadAlerts.length
            }
          </span>
        )}
      </button>

      {/* DROPDOWN */}
      {open && (
        <div className="absolute right-0 z-50 mt-2 w-96 overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900">

          {/* HEADER */}
          <div className="flex items-center justify-between border-b border-slate-200 p-4 dark:border-slate-700">

            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-white">
                Notifications
              </h3>

              <p className="text-xs text-slate-500">
                {
                  unreadAlerts.length
                }{" "}
                non lues
              </p>
            </div>

            <div className="rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700 dark:bg-red-900/30 dark:text-red-300">
              {
                unreadAlerts.length
              }
            </div>
          </div>

          {/* LIST */}
          <div className="max-h-[400px] overflow-y-auto">

            {alerts.length ===
              0 && (
              <div className="p-6 text-center">
                <CheckCircle2
                  size={40}
                  className="mx-auto text-green-500"
                />

                <p className="mt-3 text-sm text-slate-500">
                  Aucune notification
                </p>
              </div>
            )}

            {alerts
              .slice(0, 10)
              .map((alert: any) => {
                const style =
                  getAlertStyle(
                    alert.type
                  );

                return (
                  <div
                    key={
                      alert.id_alerte
                    }
                    onClick={() =>
                      markAsRead(
                        alert.id_alerte
                      )
                    }
                    className={`cursor-pointer border-b border-slate-100 p-4 transition hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800 ${
                      !alert.is_read
                        ? "bg-red-50/40 dark:bg-red-950/10"
                        : ""
                    }`}
                  >

                    <div className="flex items-start gap-3">

                      {/* ICON */}
                      <div
                        className={`mt-1 rounded-full p-2 ${style.badge}`}
                      >
                        {
                          style.icon
                        }
                      </div>

                      {/* CONTENT */}
                      <div className="flex-1">

                        <div className="flex items-center justify-between gap-3">

                          <h4 className="font-bold text-slate-900 dark:text-white">
                            {
                              alert.titre
                            }
                          </h4>

                          {!alert.is_read && (
                            <span className="h-2 w-2 rounded-full bg-red-600" />
                          )}
                        </div>

                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                          {
                            alert.message
                          }
                        </p>

                        <div className="mt-2 flex items-center gap-2">

                          <span
                            className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase ${style.badge}`}
                          >
                            {
                              alert.type
                            }
                          </span>

                          {alert.groupe_sanguin && (
                            <span className="text-xs text-slate-400">
                              {
                                alert.groupe_sanguin
                              }
                            </span>
                          )}

                          {alert.ville && (
                            <span className="text-xs text-slate-400">
                              •{" "}
                              {
                                alert.ville
                              }
                            </span>
                          )}
                        </div>

                      </div>

                    </div>

                  </div>
                );
              })}
          </div>

          {/* FOOTER */}
          <div
            onClick={() => {
              setOpen(false);

              navigate(
                "/alerts"
              );
            }}
            className="cursor-pointer border-t border-slate-200 p-4 text-center text-sm font-bold text-red-600 hover:bg-red-50 dark:border-slate-700 dark:hover:bg-red-950/20"
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
type Props = {
  onMenuClick?: () => void;
};

export default function Topbar({
  onMenuClick,
}: Props) {
  const navigate =
    useNavigate();

  const { user, logout } =
    useAuth();

  const [alerts, setAlerts] =
    useState<Alert[]>([]);

  const fullName =
    [user?.nom, user?.prenom]
      .filter(Boolean)
      .join(" ") ||
    "Utilisateur";

  /* =========================
     LOGOUT
  ========================= */
  const handleLogout = () => {
    logout();

    navigate("/login");
  };

  /* =========================
     LOAD ALERTS
  ========================= */
  const loadAlerts =
    async () => {
      try {
        const res =
          await api.get(
            "/alertes"
          );

        setAlerts(
          res.data?.data ??
            []
        );
      } catch (
        error
      ) {
        console.error(
          "❌ ALERT LOAD ERROR:",
          error
        );

        setAlerts([]);
      }
    };

  useEffect(() => {
    loadAlerts();

    const interval =
      setInterval(
        loadAlerts,
        15000
      );

    return () =>
      clearInterval(
        interval
      );
  }, []);

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6 dark:border-slate-800 dark:bg-slate-900">

      {/* LEFT */}
      <div className="flex items-center gap-3">

        {/* MOBILE MENU */}
        <button
          onClick={
            onMenuClick
          }
          className="rounded-2xl border border-slate-300 p-2 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800 lg:hidden"
        >
          <Menu size={20} />
        </button>

        <div>
          <h1 className="text-base font-extrabold text-slate-900 dark:text-white sm:text-lg">
            Tableau de bord
          </h1>

          <p className="hidden text-sm text-slate-500 sm:block">
            Bienvenue,{" "}
            {fullName}
          </p>
        </div>

      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-2 sm:gap-3">

        <ThemeDropdown />

        <NotificationsDropdown
          alerts={alerts}
          reloadAlerts={
            loadAlerts
          }
        />

        {/* USER */}
        <div className="hidden rounded-2xl bg-slate-100 px-4 py-2 text-sm font-semibold dark:bg-slate-800 dark:text-white md:block">
          {fullName}
        </div>

        {/* LOGOUT */}
        <button
          onClick={
            handleLogout
          }
          className="rounded-2xl bg-red-600 px-3 py-2 text-sm font-bold text-white hover:bg-red-700 sm:px-4"
        >
          Déconnexion
        </button>

      </div>
    </header>
  );
}