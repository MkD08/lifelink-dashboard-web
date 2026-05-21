import { useState } from "react";
import { centresService } from "../services/centres.service";
import { useToast } from "../../auth/store/toast.store";
import LocationSelect from "../../../components/common/LocationSelect";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => Promise<void>;
};

export default function CreateCentreModal({
  isOpen,
  onClose,
  onCreated,
}: Props) {
  const [form, setForm] = useState({
    nom: "",
    ville: "",
    adresse: "",
    quartier: "",
    latitude: "",
    longitude: "",
    telephone: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { showToast } = useToast();

  if (!isOpen) return null;

  const updateField = (key: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const resetForm = () => {
    setForm({
      nom: "",
      ville: "",
      adresse: "",
      quartier: "",
      latitude: "",
      longitude: "",
      telephone: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);

      await centresService.createCentre({
        nom: form.nom.trim(),
        ville: form.ville.trim(),
        adresse:
  (
    form.adresse ||
    `${form.quartier}${form.quartier ? ", " : ""}${form.ville}`
  ).trim(),
        latitude: Number(form.latitude),
        longitude: Number(form.longitude),
        telephone: form.telephone.trim() || null,
      });

      await onCreated();
      resetForm();
      onClose();

      showToast("Centre créé avec succès.", "success");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Impossible de créer le centre";

      setError(message);
      showToast(message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-2xl rounded-[24px] bg-white p-6 shadow-2xl dark:bg-slate-900">
        <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
          Créer un centre
        </h3>

        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Cette action est réservée à l’administrateur.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-6 grid gap-4 md:grid-cols-2"
        >
          <input
            type="text"
            placeholder="Nom du centre"
            value={form.nom}
            onChange={(e) => updateField("nom", e.target.value)}
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
            required
          />

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

            <input
              type="text"
              placeholder="Adresse complète"
              value={
                form.adresse ||
                `${form.quartier}${form.quartier ? ", " : ""}${form.ville}`
              }
              onChange={(e) =>
                updateField("adresse", e.target.value)
              }
            className="
              rounded-2xl
              border border-slate-300
              bg-white
              px-4 py-3
              text-slate-900
              outline-none
              focus:border-red-500
              md:col-span-2

              dark:border-slate-700
              dark:bg-slate-800
              dark:text-white
              dark:placeholder:text-slate-400
            "
            required
          />

          <input
            type="number"
            step="any"
            placeholder="Latitude"
            value={form.latitude}
            onChange={(e) => updateField("latitude", e.target.value)}
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
            required
          />

          <input
            type="number"
            step="any"
            placeholder="Longitude"
            value={form.longitude}
            onChange={(e) => updateField("longitude", e.target.value)}
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
            required
          />

          <input
            type="text"
            placeholder="Téléphone"
            value={form.telephone}
            onChange={(e) => updateField("telephone", e.target.value)}
            className="
              rounded-2xl
              border border-slate-300
              bg-white
              px-4 py-3
              text-slate-900
              outline-none
              focus:border-red-500
              md:col-span-2

              dark:border-slate-700
              dark:bg-slate-800
              dark:text-white
              dark:placeholder:text-slate-400
            "
          />

          {error && (
            <div className="md:col-span-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-800 dark:bg-red-950/40 dark:text-red-400">
              {error}
            </div>
          )}

          <div className="md:col-span-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 rounded-2xl border border-slate-300 px-4 py-3 font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700"
            >
              Annuler
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-2xl bg-red-600 px-4 py-3 font-bold text-white hover:bg-red-700 disabled:opacity-60"
            >
              {loading ? "Création..." : "Créer le centre"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}