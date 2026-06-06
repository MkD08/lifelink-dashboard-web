import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  Bell,
  CheckCircle2,
  Menu,
  Moon,
  AlertTriangle,
  Info,
} from "lucide-react";

import {
  useAuth,
} from "../features/auth/store/auth.store";

import type {
  Notification,
  NotificationType,
} from "../features/notifications/types/notification.types";

import {
  notificationsService,
} from "../features/notifications/services/notifications.service";

import {
  alertsService,
} from "../features/alerts/services/alerts.service";

/* =========================
   THEME DROPDOWN
========================= */
function ThemeDropdown() {

  const [open, setOpen] =
    useState(false);

  const dropdownRef =
    useRef<HTMLDivElement>(null);

  // =========================
  // CLICK OUTSIDE
  // =========================
  useEffect(() => {

    const handleClickOutside =
      (event: MouseEvent) => {

        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(
            event.target as Node
          )
        ) {

          setOpen(false);
        }
      };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {

      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };

  }, []);

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

    <div
      ref={dropdownRef}
      className="relative"
    >

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

<div
className="
  absolute right-0 top-full z-[9999] mt-3

  w-44 sm:w-48

  overflow-visible
  rounded-2xl

  border border-slate-200
  bg-white
  shadow-2xl

  dark:border-slate-700
  dark:bg-slate-900
"
>

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
              className="
  block w-full
  px-4 py-3
  text-left text-sm font-medium
  capitalize
  transition
  hover:bg-slate-100
  dark:hover:bg-slate-800
"
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
   NOTIFICATION STYLE
========================= */
function getNotificationStyle(
  type: NotificationType | string
) {

  switch (type) {

    case "urgent":

      return {

        icon: (
          <AlertTriangle size={18} />
        ),

        badge:
          "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
      };

    case "warning":

      return {

        icon: (
          <AlertTriangle size={18} />
        ),

        badge:
          "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
      };

    case "DEMANDE_SANG":

      return {

        icon: (
          <Bell size={18} />
        ),

        badge:
          "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
      };

    case "PARTICIPATION_DEMANDE":

      return {

        icon: (
          <CheckCircle2 size={18} />
        ),

        badge:
          "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
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
   NOTIFICATIONS DROPDOWN
========================= */
function NotificationsDropdown({
  notifications,
  reloadNotifications,
}: {
  notifications: any[];

  reloadNotifications:
    () => Promise<void>;
}) {

  const [open, setOpen] =
    useState(false);

  const dropdownRef =
    useRef<HTMLDivElement>(null);

  // =========================
  // CLICK OUTSIDE
  // =========================
  useEffect(() => {

    const handleClickOutside =
      (event: MouseEvent) => {

        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(
            event.target as Node
          )
        ) {

          setOpen(false);
        }
      };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {

      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };

  }, []);

  // =========================
  // SORT RECENT FIRST
  // =========================
  const sortedNotifications =
    useMemo(() => {

      return [...notifications]
        .sort(

          (a, b) =>

            new Date(
              b.date_creation
            ).getTime()

            -

            new Date(
              a.date_creation
            ).getTime()
        );

    }, [notifications]);

  // =========================
  // UNREAD
  // =========================
  const unreadNotifications =
    sortedNotifications.filter(
      (n) => !n.lu
    );

  // =========================
  // MARK AS READ
  // =========================
  const markAsRead =
    async (
      notif: any
    ) => {

      try {

        if (
          notif.source ===
          "notification"
        ) {

          await notificationsService
            .markAsRead(
              notif.id_notification
            );
        }

        if (
          notif.source ===
          "alert"
        ) {

          await alertsService
            .markAsRead(
              notif.id_notification
            );
        }

        await reloadNotifications();

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

    <div
      ref={dropdownRef}
      className="relative"
    >

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
        {unreadNotifications.length > 0 && (

          <span className="absolute -right-2 -top-2 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-600 px-1 text-xs font-bold text-white">

            {
              unreadNotifications.length
            }
          </span>
        )}
      </button>

      {/* DROPDOWN */}
      {open && (

<div
  className="
    fixed

    right-3 top-20
    z-[9999]

    w-[calc(100vw-24px)]
    max-w-sm

    overflow-hidden
    rounded-[24px]

    border border-slate-200
    bg-white
    shadow-2xl

    dark:border-slate-700
    dark:bg-slate-900

    sm:right-6
  "
>

          {/* HEADER */}
          <div className="flex items-center justify-between border-b border-slate-200 p-4 dark:border-slate-700">

            <div>

              <h3 className="font-extrabold text-slate-900 dark:text-white">
                Notifications
              </h3>

              <p className="text-xs text-slate-500">

                {
                  unreadNotifications.length
                }{" "}
                non lues
              </p>
            </div>

            <div className="rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700 dark:bg-red-900/30 dark:text-red-300">

              {
                unreadNotifications.length
              }
            </div>
          </div>

          {/* LIST */}
          <div className="max-h-[70vh] overflow-y-auto">

            {sortedNotifications.length === 0 && (

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

            {sortedNotifications
              .slice(0, 10)
              .map((notif) => {

                const style =
                  getNotificationStyle(
                    notif.type
                  );

                return (

                  <div
                    key={
                      notif.id_notification
                    }
                    onClick={() =>
                      markAsRead(
                        notif
                      )
                    }
                    className={`cursor-pointer border-b border-slate-100 p-4 transition hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800 ${
                      !notif.lu
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

                            {notif.titre ||
                              "Notification"}
                          </h4>

                          {!notif.lu && (

                            <span className="h-2 w-2 rounded-full bg-red-600" />
                          )}
                        </div>

                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">

                          {
                            notif.message
                          }
                        </p>

                        <div className="mt-2 flex flex-wrap items-center gap-2">

                          <span
                            className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase ${style.badge}`}
                          >
                            {
                              notif.type
                            }
                          </span>

                          {notif.ville && (

                            <span className="text-xs text-slate-400">

                              • {notif.ville}
                            </span>
                          )}

                          {notif.quartier && (

                            <span className="text-xs text-slate-400">

                              • {notif.quartier}
                            </span>
                          )}

                          <span className="text-xs text-slate-400">

                            •{" "}

                            {new Date(
                              notif.date_creation
                            ).toLocaleString()}
                          </span>
                        </div>

                      </div>

                    </div>

                  </div>
                );
              })}
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

  // =========================
  // NOTIFICATIONS
  // =========================
  const [
    notifications,
    setNotifications,
  ] = useState<Notification[]>([]);

  // =========================
  // ALERTS
  // =========================
  const [
    alerts,
    setAlerts,
  ] = useState<any[]>([]);

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
     LOAD NOTIFICATIONS
  ========================= */
  const loadNotifications =
    async () => {

      try {

        const data =
          await notificationsService
            .getMyNotifications();

        setNotifications(
          data ?? []
        );

      } catch (
        error
      ) {

        console.error(
          "❌ NOTIFICATIONS ERROR:",
          error
        );

        setNotifications([]);
      }
    };

  /* =========================
     LOAD ALERTS
  ========================= */
  const loadAlerts =
    async () => {

      try {

        const data =
          await alertsService
            .getAlerts();

        setAlerts(
          data ?? []
        );

      } catch (
        error
      ) {

        console.error(
          "❌ ALERTS ERROR:",
          error
        );

        setAlerts([]);
      }
    };

  /* =========================
     AUTO REFRESH
  ========================= */
  useEffect(() => {

    loadNotifications();

    loadAlerts();

    const interval =
      setInterval(() => {

        loadNotifications();

        loadAlerts();

      }, 15000);

    return () =>
      clearInterval(
        interval
      );

  }, []);

  // =========================
  // MERGED DATA
  // =========================
  const mergedNotifications =
  useMemo(() => {

    return [

      ...notifications.map(
        (n) => ({
          ...n,
          source: "notification",
        })
      ),

      ...alerts
        .filter(
          (a) =>
            a.created_by !==
            user?.id_utilisateur
        )
        .map(
          (a) => ({
            ...a,
            source: "alert",
            lu: a.is_read,
            id_notification:
              a.id_alerte,
          })
        ),
    ]
      .sort(
        (a, b) =>
          new Date(
            b.date_creation
          ).getTime()

          -

          new Date(
            a.date_creation
          ).getTime()
      );

  }, [
    notifications,
    alerts,
    user,
  ]);

  return (

    <header
  className="
    relative z-40

    flex h-16
    items-center justify-between

    overflow-visible

    border-b border-slate-200
    bg-white

    px-3 sm:px-6

    dark:border-slate-800
    dark:bg-slate-900
  "
>

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
      <div className="flex items-center gap-2 overflow-visible">

        {/* THEME */}
        <ThemeDropdown />

        {/* NOTIFICATIONS */}
        <NotificationsDropdown
          notifications={
            mergedNotifications
          }
          reloadNotifications={
            async () => {

              await loadNotifications();

              await loadAlerts();
            }
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