import { useEffect, useState } from "react";

import {
  Bell,
  AlertTriangle,
  Info,
  CheckCircle2,
} from "lucide-react";

import { notificationsService }
  from "../services/notifications.service";

import type {
  Notification,
  NotificationType,
} from "../types/notification.types";

import { useToast }
  from "../../auth/store/toast.store";

// ==============================
// Styles types notifications
// ==============================

const typeStyles:
  Record<NotificationType, string> = {

  info:
    "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",

  warning:
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",

  urgent:
    "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",

  DEMANDE_SANG:
    "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",

  PARTICIPATION_DEMANDE:
    "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
};

// ==============================
// Icônes notifications
// ==============================

function getNotificationIcon(
  type: NotificationType
) {

  switch (type) {

    case "urgent":

      return (
        <AlertTriangle size={18} />
      );

    case "DEMANDE_SANG":

      return (
        <Bell size={18} />
      );

    case "PARTICIPATION_DEMANDE":

      return (
        <CheckCircle2 size={18} />
      );

    default:

      return (
        <Info size={18} />
      );
  }
}

// ==============================
// PAGE
// ==============================

export default function NotificationsPage() {

  const [notifications,
    setNotifications] =
    useState<Notification[]>([]);

  const [loading,
    setLoading] =
    useState(true);

  const { showToast } =
    useToast();

  // ==============================
  // LOAD NOTIFICATIONS
  // ==============================

  const loadNotifications =
    async () => {

      try {

        setLoading(true);

        const data =
          await notificationsService
            .getMyNotifications();

        const sorted =
          [...data].sort(

            (a, b) =>

              new Date(
                b.date_creation
              ).getTime()

              -

              new Date(
                a.date_creation
              ).getTime()
          );

        setNotifications(sorted);

      } catch (err: any) {

        showToast(
          err.message ||
          "Erreur chargement notifications",
          "error"
        );

      } finally {

        setLoading(false);
      }
    };

  // ==============================
  // MARK AS READ
  // ==============================

  const markAsRead =
    async (id: number) => {

      try {

        await notificationsService
          .markAsRead(id);

        await loadNotifications();

      } catch {

        showToast(
          "Erreur mise à jour notification",
          "error"
        );
      }
    };

    const markAllAsRead =
  async () => {

    try {

      await notificationsService
        .markAllAsRead();

      showToast(
        "Toutes les notifications ont été marquées comme lues",
        "success"
      );

      await loadNotifications();

    } catch (err: any) {

      showToast(
        err.message ||
        "Erreur",
        "error"
      );
    }
  };

const deleteAllReadNotifications =
  async () => {

    try {

      await notificationsService
        .deleteAllReadNotifications();

      showToast(
        "Notifications supprimées",
        "success"
      );

      await loadNotifications();

    } catch (err: any) {

      showToast(
        err.message ||
        "Erreur",
        "error"
      );
    }
  };

  useEffect(() => {

    loadNotifications();

  }, []);

  return (

    <div className="space-y-6">

      {/* HEADER */}

      <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-md dark:border-slate-700 dark:bg-slate-900">

        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
          Notifications
        </h2>

        <p className="mt-2 text-slate-500 dark:text-slate-400">
          Notifications du système médical et des demandes de sang.
        </p>
      </div>
      <div className="mt-4 flex flex-wrap gap-3">

  <button
    onClick={markAllAsRead}
    className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
  >
    Tout marquer comme lu
  </button>

  <button
    onClick={deleteAllReadNotifications}
    className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
  >
    Supprimer les notifications lues
  </button>

</div>

      {/* CONTENT */}

      {loading ? (

        <div className="rounded-[24px] border border-slate-200 bg-white p-6 text-center text-slate-500 shadow-md dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">

          Chargement...
        </div>

      ) : notifications.length === 0 ? (

        <div className="rounded-[24px] border border-slate-200 bg-white p-6 text-center shadow-md dark:border-slate-700 dark:bg-slate-900">

          <Bell
            size={40}
            className="mx-auto text-slate-400"
          />

          <p className="mt-3 text-slate-500 dark:text-slate-400">
            Aucune notification
          </p>
        </div>

      ) : (

        <div className="space-y-4">

          {notifications.map((notif) => (

            <div
              key={notif.id_notification}
              onClick={() =>
                markAsRead(
                  notif.id_notification
                )
              }
              className={`cursor-pointer rounded-[24px] border border-slate-200 bg-white p-5 shadow-md transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800 ${
                !notif.lu
                  ? "border-l-4 border-l-red-600"
                  : ""
              }`}
            >

              <div className="flex items-start gap-4">

                {/* ICON */}

                <div
                  className={`rounded-2xl p-3 ${
                    typeStyles[notif.type]
                  }`}
                >
                  {
                    getNotificationIcon(
                      notif.type
                    )
                  }
                </div>

                {/* CONTENT */}

                <div className="flex-1">

                  <div className="flex items-start justify-between gap-4">

                    <div>

                      <h3 className="font-extrabold text-slate-900 dark:text-white">

                        {notif.titre ||
                          "Notification"}
                      </h3>

                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">

                        {notif.message}
                      </p>
                    </div>

                    {!notif.lu && (

                      <span className="h-3 w-3 rounded-full bg-red-600" />
                    )}
                  </div>

                  {/* META */}

                  <div className="mt-3 flex flex-wrap items-center gap-2">

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${
                        typeStyles[notif.type]
                      }`}
                    >
                      {notif.type}
                    </span>

                    {notif.ville && (

                      <span className="text-xs text-slate-400">
                        {notif.ville}
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
          ))}
        </div>
      )}
    </div>
  );
}