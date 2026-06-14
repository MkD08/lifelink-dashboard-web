import { useState } from "react";
import { X } from "lucide-react";

import { staffManagementService } from "../services/staff-management.service";
import { useToast } from "../../auth/store/toast.store";
import LocationSelect from "../../../components/common/LocationSelect";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

const genders = [
  { label: "Masculin", value: "M" },
  { label: "Féminin", value: "F" },
];

export default function CreateStaffModal({
  isOpen,
  onClose,
  onSuccess,
}: Props) {
  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    genre: "M",
    date_naissance: "",
    telephone: "",
    email: "",
    password: "",
    ville: "",
    quartier: "",
  });

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const { showToast } = useToast();

  if (!isOpen) return null;

  const updateField = (
    key: string,
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const resetForm = () => {
    setForm({
      nom: "",
      prenom: "",
      genre: "M",
      date_naissance: "",
      telephone: "",
      email: "",
      password: "",
      ville: "",
      quartier: "",
    });
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setError("");

    try {
      setLoading(true);

      await staffManagementService.createStaff(
        form
      );

      resetForm();

      showToast(
        "Staff créé avec succès.",
        "success"
      );

      onSuccess();
      onClose();
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Impossible de créer le staff";

      setError(message);

      showToast(message, "error");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle =
    "rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-red-500 " +
    "bg-white text-slate-900 placeholder:text-slate-400 " +
    "dark:bg-slate-800 dark:border-slate-700 dark:text-white";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[95vh] w-full max-w-4xl overflow-y-auto rounded-[24px] bg-white p-6 shadow-2xl dark:bg-slate-900">

        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              Créer un staff
            </h2>

            <p className="mt-1 text-slate-500">
              Création d'un nouveau membre du staff.
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl p-2 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X size={20} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid gap-4 md:grid-cols-2"
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
            required
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
            required
          />

          <select
            value={form.genre}
            onChange={(e) =>
              updateField(
                "genre",
                e.target.value
              )
            }
            className={inputStyle}
          >
            {genders.map((gender) => (
              <option
                key={gender.value}
                value={gender.value}
              >
                {gender.label}
              </option>
            ))}
          </select>

          <input
            type="date"
            value={form.date_naissance}
            onChange={(e) =>
              updateField(
                "date_naissance",
                e.target.value
              )
            }
            className={inputStyle}
            required
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
            required
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
            required
          />

          <input
            type="password"
            placeholder="Mot de passe"
            value={form.password}
            onChange={(e) =>
              updateField(
                "password",
                e.target.value
              )
            }
            className={inputStyle}
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
                updateField(
                  "quartier",
                  value
                )
              }
            />
          </div>

          {error && (
            <div className="md:col-span-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
              {error}
            </div>
          )}

          <div className="md:col-span-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl border border-slate-300 px-5 py-3 font-semibold"
            >
              Annuler
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-2xl bg-red-600 px-5 py-3 font-bold text-white hover:bg-red-700"
            >
              {loading
                ? "Création..."
                : "Créer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}