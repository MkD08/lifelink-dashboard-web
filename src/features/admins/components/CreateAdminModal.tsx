import { useState } from "react";
import { useToast } from "../../auth/store/toast.store";
import { adminsService } from "../services/admins.service";
import type { CreateAdminPayload } from "../types/admin.types";
import LocationSelect from "../../../components/common/LocationSelect";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => Promise<void>;
};

export default function CreateAdminModal({
  isOpen,
  onClose,
  onCreated,
}: Props) {
  const { showToast } = useToast();

  const [form, setForm] = useState<CreateAdminPayload>({
    nom: "",
    prenom: "",
    email: "",
    password: "",
    telephone: "",
    ville: "",
    quartier: "",
    groupe_sanguin: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const updateField = (key: keyof CreateAdminPayload, value: string) => {
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

      if (!form.nom || !form.prenom || !form.email || !form.password) {
        throw new Error("Nom, prénom, email et mot de passe sont obligatoires.");
      }

      await adminsService.createAdmin(form);

      await onCreated();
      onClose();
      showToast("Administrateur créé avec succès.", "success");
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Impossible de créer l'administrateur";

      setError(message);
      showToast(message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-3xl rounded-[24px] bg-white p-6 shadow-2xl dark:bg-slate-900">
        <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
          Créer un administrateur
        </h3>

        <form
          onSubmit={handleSubmit}
          className="mt-6 grid gap-4 md:grid-cols-2"
        >
          <input
            type="text"
            placeholder="Nom"
            value={form.nom}
            onChange={(e) => updateField("nom", e.target.value)}
            className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-red-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-400"
          />

          <input
            type="text"
            placeholder="Prénom"
            value={form.prenom}
            onChange={(e) => updateField("prenom", e.target.value)}
            className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-red-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-400"
          />

          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => updateField("email", e.target.value)}
            className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-red-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-400"
          />

          <input
            type="password"
            placeholder="Mot de passe"
            value={form.password}
            onChange={(e) => updateField("password", e.target.value)}
            className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-red-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-400"
          />

          <input
            type="text"
            placeholder="Téléphone"
            value={form.telephone}
            onChange={(e) => updateField("telephone", e.target.value)}
            className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-red-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-400"
          />

<div className="md:col-span-2">
<LocationSelect
  ville={form.ville ?? ""}
  quartier={form.quartier ?? ""}
  onVilleChange={(value) =>
    updateField("ville", value)
  }
  onQuartierChange={(value) =>
    updateField("quartier", value)
  }
/>
</div>

<select
  value={form.groupe_sanguin}
  onChange={(e) =>
    updateField(
      "groupe_sanguin",
      e.target.value
    )
  }
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
>
  <option value="">
    Groupe sanguin
  </option>

  <option value="O-">O-</option>
  <option value="O+">O+</option>
  <option value="A-">A-</option>
  <option value="A+">A+</option>
  <option value="B-">B-</option>
  <option value="B+">B+</option>
  <option value="AB-">AB-</option>
  <option value="AB+">AB+</option>
</select>

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
              {loading ? "Création..." : "Créer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}