import { useEffect, useState } from "react";
import type { Centre } from "../types/centre.types";
import { centresService } from "../services/centres.service";
import { useToast } from "../../auth/store/toast.store";

type Props = {
  centre: Centre | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdated: () => Promise<void>;
};

export default function EditCentreModal({
  centre,
  isOpen,
  onClose,
  onUpdated,
}: Props) {
  const [form, setForm] = useState({
    nom: "",
    ville: "",
    adresse: "",
    latitude: "",
    longitude: "",
    telephone: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { showToast } = useToast();

  useEffect(() => {
    if (centre) {
      setForm({
        nom: centre.nom ?? "",
        ville: centre.ville ?? "",
        adresse: centre.adresse ?? "",
        latitude:
          centre.latitude !== null && centre.latitude !== undefined
            ? String(centre.latitude)
            : "",
        longitude:
          centre.longitude !== null && centre.longitude !== undefined
            ? String(centre.longitude)
            : "",
        telephone: centre.telephone ?? "",
      });
    }
  }, [centre]);

  if (!isOpen || !centre) return null;

  const updateField = (key: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);

      await centresService.updateCentre(centre.id_centre, {
        nom: form.nom.trim(),
        ville: form.ville.trim(),
        adresse: form.adresse.trim(),
        latitude: Number(form.latitude),
        longitude: Number(form.longitude),
        telephone: form.telephone.trim() || null,
      });

      await onUpdated();
      onClose();

      showToast("Centre modifié avec succès.", "success");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Impossible de modifier le centre";

      setError(message);
      showToast(message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-2xl rounded-[24px] bg-white dark:bg-slate-900 p-6 shadow-2xl">
        <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
          Modifier le centre
        </h3>

        <form onSubmit={handleSubmit} className="mt-6 grid gap-4 md:grid-cols-2">
          <input
            type="text"
            placeholder="Nom du centre"
            value={form.nom}
            onChange={(e) => updateField("nom", e.target.value)}
            className="rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-red-500"
            required
          />

          <input
            type="text"
            placeholder="Ville"
            value={form.ville}
            onChange={(e) => updateField("ville", e.target.value)}
            className="rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-red-500"
            required
          />

          <input
            type="text"
            placeholder="Adresse"
            value={form.adresse}
            onChange={(e) => updateField("adresse", e.target.value)}
            className="rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-red-500 md:col-span-2"
            required
          />

          <input
            type="number"
            step="any"
            placeholder="Latitude"
            value={form.latitude}
            onChange={(e) => updateField("latitude", e.target.value)}
            className="rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-red-500"
            required
          />

          <input
            type="number"
            step="any"
            placeholder="Longitude"
            value={form.longitude}
            onChange={(e) => updateField("longitude", e.target.value)}
            className="rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-red-500"
            required
          />

          <input
            type="text"
            placeholder="Téléphone"
            value={form.telephone}
            onChange={(e) => updateField("telephone", e.target.value)}
            className="rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-red-500 md:col-span-2"
          />

          {error && (
            <div className="md:col-span-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {error}
            </div>
          )}

          <div className="md:col-span-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 rounded-2xl border border-slate-300 px-4 py-3 font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
            >
              Annuler
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-2xl bg-red-600 px-4 py-3 font-bold text-white hover:bg-red-700 disabled:opacity-60"
            >
              {loading ? "Modification..." : "Enregistrer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}