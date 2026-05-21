import { useEffect, useState } from "react";

import { api } from "../../../lib/axios";

import { useToast } from "../../auth/store/toast.store";

import { directorsService } from "../services/directors.service";

import LocationSelect from "../../../components/common/LocationSelect";

import type { Director } from "../types/director.types";

type Props = {
  director: Director | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdated: () => Promise<void>;
};

interface Centre {
  id_centre: number;
  nom: string;
  ville: string;
}

export default function EditDirectorModal({
  director,
  isOpen,
  onClose,
  onUpdated,
}: Props) {
  const { showToast } = useToast();

  const [centres, setCentres] = useState<
    Centre[]
  >([]);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] = useState("");

  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    telephone: "",
    email: "",
    ville: "",
    quartier: "",
    centre_id: 0,
  });

  /**
   * LOAD CENTRES
   */
  const loadCentres = async () => {
    try {
      const response =
        await api.get("/centres");

      const data =
        response.data?.data ??
        response.data ??
        [];

      setCentres(
        Array.isArray(data) ? data : []
      );
    } catch (err) {
      console.error(
        "❌ Impossible charger centres",
        err
      );
    }
  };

  useEffect(() => {
    if (!director) return;

    setForm({
      nom: director.nom || "",
      prenom: director.prenom || "",
      telephone:
        director.telephone || "",
      email: director.email || "",
      ville: director.ville || "",
      quartier:
        director.quartier || "",
      centre_id:
        (director as any).centre_id ||
        0,
    });

    loadCentres();
  }, [director]);

  const updateField = (
    key: string,
    value: string | number
  ) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  /**
   * SUBMIT
   */
  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!director) return;

    setError("");

    try {
      setLoading(true);

      await directorsService.updateDirector(
        director.id_utilisateur,
        form
      );

      showToast(
        "Directeur modifié avec succès.",
        "success"
      );

      await onUpdated();

      onClose();
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Impossible de modifier le directeur";

      setError(message);

      showToast(message, "error");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !director) return null;

  const inputStyle =
    "rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-red-500 " +
    "bg-white text-slate-900 placeholder:text-slate-400 " +
    "dark:bg-slate-800 dark:border-slate-700 dark:text-white";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-2xl rounded-[24px] bg-white p-6 shadow-2xl dark:bg-slate-900">
        <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
          Modifier directeur
        </h3>

        <form
          onSubmit={handleSubmit}
          className="mt-6 grid gap-4 md:grid-cols-2"
        >
          <input
            type="text"
            placeholder="Nom"
            value={form.nom}
            onChange={(e) =>
              updateField(
                "nom",
                e.target.value
              )
            }
            className={inputStyle}
          />

          <input
            type="text"
            placeholder="Prénom"
            value={form.prenom}
            onChange={(e) =>
              updateField(
                "prenom",
                e.target.value
              )
            }
            className={inputStyle}
          />

          <input
            type="text"
            placeholder="Téléphone"
            value={form.telephone}
            onChange={(e) =>
              updateField(
                "telephone",
                e.target.value
              )
            }
            className={inputStyle}
          />

          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) =>
              updateField(
                "email",
                e.target.value
              )
            }
            className={inputStyle}
          />

          {/* LOCALISATION */}
<div className="md:col-span-2">

<LocationSelect
  ville={form.ville}
  quartier={form.quartier}

  onVilleChange={(value) =>
    updateField("ville", value)
  }

  onQuartierChange={(value) =>
    updateField("quartier", value)
  }
/>

</div>

          {/* CENTRE */}
          <select
            value={form.centre_id}
            onChange={(e) =>
              updateField(
                "centre_id",
                Number(e.target.value)
              )
            }
            className={`${inputStyle} md:col-span-2`}
          >
            <option value={0}>
              Sélectionner un centre
            </option>

            {centres.map((centre) => (
              <option
                key={centre.id_centre}
                value={centre.id_centre}
              >
                {centre.nom} (
                {centre.ville})
              </option>
            ))}
          </select>

          {/* ERROR */}
          {error && (
            <div className="md:col-span-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
              {error}
            </div>
          )}

          {/* ACTIONS */}
          <div className="md:col-span-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-2xl border border-slate-300 px-4 py-3 font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-white dark:hover:bg-slate-800"
            >
              Annuler
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-2xl bg-red-600 px-4 py-3 font-bold text-white hover:bg-red-700 disabled:opacity-60"
            >
              {loading
                ? "Modification..."
                : "Modifier directeur"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}