import { useEffect, useState } from "react";

import { useToast } from "../../auth/store/toast.store";

import { adminsService } from "../services/admins.service";

import LocationSelect from "../../../components/common/LocationSelect";

import type {
  Admin,
  UpdateAdminPayload,
} from "../types/admin.types";

type Props = {
  admin: Admin | null;

  isOpen: boolean;

  onClose: () => void;

  onUpdated: () => Promise<void>;
};

export default function EditAdminModal({
  admin,
  isOpen,
  onClose,
  onUpdated,
}: Props) {
  const { showToast } = useToast();

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [form, setForm] =
    useState<UpdateAdminPayload>({
      nom: "",
      prenom: "",
      telephone: "",
      email: "",
      ville: "",
      quartier: "",
      groupe_sanguin: "",
      actif: true,
    });

  useEffect(() => {
    if (admin) {
      setForm({
        nom: admin.nom ?? "",
        prenom: admin.prenom ?? "",
        telephone:
          admin.telephone ?? "",
        email: admin.email ?? "",
        ville: admin.ville ?? "",
        quartier:
          admin.quartier ?? "",
        groupe_sanguin:
          admin.groupe_sanguin ?? "",
        actif: admin.actif,
      });
    }
  }, [admin]);

  if (!isOpen || !admin)
    return null;

  const updateField = (
    key: keyof UpdateAdminPayload,
    value: string | boolean
  ) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit =
    async (
      e: React.FormEvent
    ) => {
      e.preventDefault();

      setError("");

      try {
        setLoading(true);

        await adminsService.updateAdmin(
          admin.id_utilisateur,
          form
        );

        await onUpdated();

        onClose();

        showToast(
          "Administrateur modifié avec succès.",
          "success"
        );
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Impossible de modifier l'administrateur";

        setError(message);

        showToast(
          message,
          "error"
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-3xl rounded-[24px] bg-white p-6 shadow-2xl dark:bg-slate-900">
        <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
          Modifier administrateur
        </h3>

        <form
          onSubmit={handleSubmit}
          className="mt-6 grid gap-4 md:grid-cols-2"
        >
          <input
            type="text"
            placeholder="Nom"
            value={form.nom ?? ""}
            onChange={(e) =>
              updateField(
                "nom",
                e.target.value
              )
            }
            className="rounded-2xl border border-slate-300 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />

          <input
            type="text"
            placeholder="Prénom"
            value={form.prenom ?? ""}
            onChange={(e) =>
              updateField(
                "prenom",
                e.target.value
              )
            }
            className="rounded-2xl border border-slate-300 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />

          <input
            type="text"
            placeholder="Téléphone"
            value={form.telephone ?? ""}
            onChange={(e) =>
              updateField(
                "telephone",
                e.target.value
              )
            }
            className="rounded-2xl border border-slate-300 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />

          <input
            type="email"
            placeholder="Email"
            value={form.email ?? ""}
            onChange={(e) =>
              updateField(
                "email",
                e.target.value
              )
            }
            className="rounded-2xl border border-slate-300 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />

<div className="md:col-span-2">
<LocationSelect
  ville={form.ville ?? ""}
  quartier={form.quartier ?? ""}
  onVilleChange={(value) =>
    updateField(
      "ville",
      value
    )
  }
  onQuartierChange={(value) =>
    updateField(
      "quartier",
      value
    )
  }
/>
</div>

<select
  value={form.groupe_sanguin ?? ""}
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

          <label className="flex items-center gap-3 rounded-2xl border border-slate-300 px-4 py-3 dark:border-slate-700 dark:bg-slate-800">
            <input
              type="checkbox"
              checked={
                form.actif
              }
              onChange={(e) =>
                updateField(
                  "actif",
                  e.target.checked
                )
              }
            />

            <span className="text-sm font-semibold text-slate-700 dark:text-white">
              Administrateur actif
            </span>
          </label>

          {error && (
            <div className="md:col-span-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-700 dark:border-red-800 dark:bg-red-950/40 dark:text-red-400">
              {error}
            </div>
          )}

          <div className="md:col-span-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-2xl border border-slate-300 px-4 py-3 font-semibold dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            >
              Annuler
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-2xl bg-red-600 px-4 py-3 font-bold text-white"
            >
              {loading
                ? "Modification..."
                : "Enregistrer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}