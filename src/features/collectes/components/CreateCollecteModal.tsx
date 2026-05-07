import { useState } from "react";
import { collectesService } from "../services/collectes.service";
import { useToast } from "../../auth/store/toast.store";

export default function CreateCollecteModal({
  isOpen,
  onClose,
  onCreated,
}: any) {
  const [form, setForm] = useState<any>({});
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const { showToast } = useToast();

  if (!isOpen) return null;

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const fd = new FormData();

      Object.entries(form).forEach(([k, v]) => {
        if (v !== undefined && v !== null) fd.append(k, String(v));
      });

      if (file) fd.append("image", file);

      await collectesService.create(fd);

      showToast("Collecte créée avec succès", "success");

      await onCreated();
      onClose();
    } catch (err: any) {
      showToast(err.message || "Erreur", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-3xl rounded-[24px] bg-white p-6 shadow-2xl dark:bg-slate-900">
        <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
          Créer une collecte
        </h3>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <input
            className="
              rounded-2xl
              border border-slate-300
              bg-white
              px-4 py-3
              text-slate-900
              outline-none
              focus:border-red-500

              dark:border-slate-700
              dark:bg-slate-800
              dark:text-white
              dark:placeholder:text-slate-400
            "
            placeholder="Titre"
            onChange={(e) =>
              setForm({ ...form, titre: e.target.value })
            }
          />

          <input
            className="
              rounded-2xl
              border border-slate-300
              bg-white
              px-4 py-3
              text-slate-900
              outline-none
              focus:border-red-500

              dark:border-slate-700
              dark:bg-slate-800
              dark:text-white
              dark:placeholder:text-slate-400
            "
            placeholder="Ville"
            onChange={(e) =>
              setForm({ ...form, ville: e.target.value })
            }
          />

          <input
            className="
              rounded-2xl
              border border-slate-300
              bg-white
              px-4 py-3
              text-slate-900
              outline-none
              focus:border-red-500

              dark:border-slate-700
              dark:bg-slate-800
              dark:text-white
              dark:placeholder:text-slate-400
            "
            placeholder="Lieu"
            onChange={(e) =>
              setForm({ ...form, lieu: e.target.value })
            }
          />

          <input
            className="
              rounded-2xl
              border border-slate-300
              bg-white
              px-4 py-3
              text-slate-900
              outline-none
              focus:border-red-500

              dark:border-slate-700
              dark:bg-slate-800
              dark:text-white
              dark:placeholder:text-slate-400
            "
            placeholder="Places"
            onChange={(e) =>
              setForm({ ...form, places_max: e.target.value })
            }
          />

          <input
            className="
              rounded-2xl
              border border-slate-300
              bg-white
              px-4 py-3
              text-slate-900
              outline-none
              focus:border-red-500

              dark:border-slate-700
              dark:bg-slate-800
              dark:text-white
              dark:placeholder:text-slate-400
            "
            placeholder="Latitude"
            onChange={(e) =>
              setForm({ ...form, latitude: e.target.value })
            }
          />

          <input
            className="
              rounded-2xl
              border border-slate-300
              bg-white
              px-4 py-3
              text-slate-900
              outline-none
              focus:border-red-500

              dark:border-slate-700
              dark:bg-slate-800
              dark:text-white
              dark:placeholder:text-slate-400
            "
            placeholder="Longitude"
            onChange={(e) =>
              setForm({ ...form, longitude: e.target.value })
            }
          />

          <input
            type="date"
            className="
              rounded-2xl
              border border-slate-300
              bg-white
              px-4 py-3
              text-slate-900
              outline-none
              focus:border-red-500

              dark:border-slate-700
              dark:bg-slate-800
              dark:text-white
            "
            onChange={(e) =>
              setForm({ ...form, date_collecte: e.target.value })
            }
          />

          <input
            type="time"
            className="
              rounded-2xl
              border border-slate-300
              bg-white
              px-4 py-3
              text-slate-900
              outline-none
              focus:border-red-500

              dark:border-slate-700
              dark:bg-slate-800
              dark:text-white
            "
            onChange={(e) =>
              setForm({ ...form, heure_debut: e.target.value })
            }
          />

          <input
            type="time"
            className="
              rounded-2xl
              border border-slate-300
              bg-white
              px-4 py-3
              text-slate-900
              outline-none
              focus:border-red-500

              dark:border-slate-700
              dark:bg-slate-800
              dark:text-white
            "
            onChange={(e) =>
              setForm({ ...form, heure_fin: e.target.value })
            }
          />

          <input
            type="file"
            className="
              rounded-2xl
              border border-slate-300
              bg-white
              px-4 py-3
              text-slate-900
              file:mr-4
              file:rounded-xl
              file:border-0
              file:bg-red-600
              file:px-4
              file:py-2
              file:font-semibold
              file:text-white
              outline-none

              dark:border-slate-700
              dark:bg-slate-800
              dark:text-white
            "
            onChange={(e) =>
              setFile(e.target.files?.[0] || null)
            }
          />

          <textarea
            className="
              col-span-2
              rounded-2xl
              border border-slate-300
              bg-white
              px-4 py-3
              text-slate-900
              outline-none
              focus:border-red-500

              dark:border-slate-700
              dark:bg-slate-800
              dark:text-white
              dark:placeholder:text-slate-400
            "
            placeholder="Description"
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-2xl border border-slate-300 px-4 py-3 font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          >
            Annuler
          </button>

          <button
            onClick={handleSubmit}
            className="flex-1 rounded-2xl bg-red-600 px-4 py-3 font-bold text-white"
          >
            {loading ? "Création..." : "Créer"}
          </button>
        </div>
      </div>
    </div>
  );
}