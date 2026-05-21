import { useAuth } from "../../auth/store/auth.store";

import { API_BASE_URL } from "../../../config/api-endpoints";

const BASE_URL =
  API_BASE_URL.replace(
    "/api",
    ""
  );

const themes: Record<
  string,
  string
> = {
  red: "from-red-500 via-red-600 to-rose-700",

  blue: "from-cyan-500 via-blue-600 to-indigo-700",

  green:
    "from-emerald-500 via-green-600 to-teal-700",

  purple:
    "from-purple-500 via-fuchsia-600 to-pink-700",

  orange:
    "from-orange-400 via-orange-500 to-amber-600",
};

export default function CollecteCard({
  collecte,
  onEdit,
  onDelete,
  onParticiper,
}: any) {
  const { user } = useAuth();

  const roleId =
    user?.role_id;

  const participants =
    collecte.inscriptions
      ?.length || 0;

  const theme =
    themes[
      collecte.theme || "red"
    ];

  return (
    <div
      className="
        overflow-hidden
        rounded-[28px]
        border border-slate-200
        bg-white
        shadow-md
        transition
        hover:-translate-y-1
        hover:shadow-2xl

        dark:border-slate-800
        dark:bg-slate-900
      "
    >
      {/* COVER */}
      <div className="relative h-56 overflow-hidden">

        {/* IMAGE */}
        {collecte.image ? (
          <img
            src={`${BASE_URL}${collecte.image}`}
            className="
              h-full
              w-full
              object-cover
            "
          />
        ) : (
          <div
            className={`
              relative
              h-full
              overflow-hidden
              bg-gradient-to-br
              ${theme}
            `}
          >
            {/* BUBBLES */}
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />

            <div className="absolute bottom-0 left-0 h-28 w-28 rounded-full bg-white/10" />

            <div className="absolute right-10 top-20 h-10 w-10 rounded-full bg-white/20" />

            <div className="absolute bottom-12 right-20 h-16 w-16 rounded-full bg-white/10" />

            {/* CENTER ICON */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white">

              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/20 backdrop-blur">

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={
                      2
                    }
                    d="M12 21C12 21 5 13.5 5 9a7 7 0 1114 0c0 4.5-7 12-7 12z"
                  />
                </svg>
              </div>

              <p className="mt-4 text-lg font-extrabold">
                {
                  collecte.titre
                }
              </p>
            </div>
          </div>
        )}

        {/* OVERLAY */}
        <div className="absolute inset-0 bg-black/10" />

        {/* PARTICIPANTS */}
        <div
          className="
            absolute right-4 top-4
            rounded-full
            bg-black/70
            px-4 py-2
            text-xs
            font-bold
            text-white
            backdrop-blur
          "
        >
          {participants}{" "}
          participants
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-5">

        {/* TITLE */}
        <h3
          className="
            line-clamp-1
            text-xl
            font-extrabold
            text-slate-900

            dark:text-white
          "
        >
          {collecte.titre}
        </h3>

        {/* LOCATION */}
        <p
          className="
            mt-2
            text-sm
            text-slate-500

            dark:text-slate-400
          "
        >
          📍{" "}
          {collecte.lieu},{" "}
          {collecte.ville}
        </p>

        {/* DATE */}
        <div
          className="
            mt-4
            flex items-center
            justify-between
            rounded-2xl
            bg-slate-50
            px-4 py-3

            dark:bg-slate-800
          "
        >
          <div>
            <p className="text-xs text-slate-500">
              Date
            </p>

            <p className="font-bold text-slate-900 dark:text-white">
              {new Date(
                collecte.date_collecte
              ).toLocaleDateString()}
            </p>
          </div>

          <div className="text-right">
            <p className="text-xs text-slate-500">
              Horaire
            </p>

            <p className="font-bold text-slate-900 dark:text-white">
              {
                collecte.heure_debut
              }{" "}
              -{" "}
              {
                collecte.heure_fin
              }
            </p>
          </div>
        </div>

        {/* DESCRIPTION */}
        {collecte.description && (
          <p
            className="
              mt-4
              line-clamp-3
              text-sm
              text-slate-600

              dark:text-slate-300
            "
          >
            {
              collecte.description
            }
          </p>
        )}

        {/* USER ACTION */}
        {roleId === 2 && (
          <button
            onClick={
              onParticiper
            }
            className="
              mt-5
              w-full
              rounded-2xl
              bg-red-600
              px-4 py-3
              font-bold
              text-white
              transition
              hover:bg-red-700
            "
          >
            Participer
          </button>
        )}

        {/* ADMIN ACTIONS */}
        {roleId !== 2 && (
          <div className="mt-5 flex gap-3">

            <button
              onClick={onEdit}
              className="
                flex-1
                rounded-2xl
                border border-slate-300
                px-4 py-3
                font-semibold
                text-slate-700
                transition
                hover:bg-slate-50

                dark:border-slate-700
                dark:text-white
                dark:hover:bg-slate-800
              "
            >
              Modifier
            </button>

            <button
              onClick={onDelete}
              className="
                flex-1
                rounded-2xl
                bg-red-600
                px-4 py-3
                font-bold
                text-white
                transition
                hover:bg-red-700
              "
            >
              Supprimer
            </button>
          </div>
        )}
      </div>
    </div>
  );
}