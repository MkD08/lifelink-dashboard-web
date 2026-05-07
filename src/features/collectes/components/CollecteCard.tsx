import { useAuth } from "../../auth/store/auth.store";
import { API_BASE_URL } from "../../../config/api-endpoints";

const BASE_URL = API_BASE_URL.replace("/api", "");

export default function CollecteCard({ collecte, onEdit, onDelete, onParticiper }: any) {
  const { user } = useAuth();
  const roleId = user?.role_id;

  const participants = collecte.inscriptions?.length || 0;

  return (
    <div className="overflow-hidden rounded-[24px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md hover:shadow-xl transition">

      {/* IMAGE */}
      <div className="relative">
        {collecte.image ? (
          <img
            src={`${BASE_URL}${collecte.image}`}
            className="h-48 w-full object-cover"
          />
        ) : (
          <div className="h-48 flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-400">
            Aucune image
          </div>
        )}

        {/* BADGE PARTICIPANTS */}
        <div className="absolute top-3 right-3 rounded-full bg-black/70 px-3 py-1 text-xs font-bold text-white backdrop-blur">
          {participants} participants
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-5">

        <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
          {collecte.titre}
        </h3>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {collecte.lieu}, {collecte.ville}
        </p>

        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
           {new Date(collecte.date_collecte).toLocaleDateString()}
        </p>

        <div className="mt-2 flex justify-between text-sm text-slate-600 dark:text-slate-300">
          <span>Début : {collecte.heure_debut}</span>
          <span>Fin : {collecte.heure_fin}</span>
        </div>

        {/* USER ACTION */}
        {roleId === 2 && (
          <button
            onClick={onParticiper}
            className="mt-4 w-full rounded-2xl bg-red-600 px-4 py-3 font-bold text-white hover:bg-red-700 transition"
          >
            Participer
          </button>
        )}

        {/* ADMIN ACTION */}
        {roleId !== 2 && (
          <div className="mt-4 flex gap-2">
            <button
              onClick={onEdit}
              className="flex-1 rounded-2xl border border-slate-300 dark:border-slate-700 px-4 py-3 font-semibold text-slate-700 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition"
            >
              Modifier
            </button>

            <button
              onClick={onDelete}
              className="flex-1 rounded-2xl bg-red-600 px-4 py-3 font-bold text-white hover:bg-red-700 transition"
            >
              Supprimer
            </button>
          </div>
        )}
      </div>
    </div>
  );
}