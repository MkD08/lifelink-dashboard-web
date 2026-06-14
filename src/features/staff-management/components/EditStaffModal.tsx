import { useEffect, useState } from "react";
import { X } from "lucide-react";

import { staffManagementService } from "../services/staff-management.service";
import { useToast } from "../../auth/store/toast.store";
import LocationSelect from "../../../components/common/LocationSelect";

import type { Staff } from "../types/staff-management.types";

type Props = {
  isOpen: boolean;
  staff: Staff | null;
  onClose: () => void;
  onSuccess: () => void;
};

const genders = [
  { label: "Masculin", value: "M" },
  { label: "Féminin", value: "F" },
];

export default function EditStaffModal({
  isOpen,
  staff,
  onClose,
  onSuccess,
}: Props) {
  const { showToast } = useToast();

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    genre: "M",
    telephone: "",
    email: "",
    ville: "",
    quartier: "",
  });

  useEffect(() => {
    if (!staff) return;

    setForm({
      nom: staff.nom || "",
      prenom: staff.prenom || "",
      genre: staff.genre || "M",
      telephone: staff.telephone || "",
      email: staff.email || "",
      ville: staff.ville || "",
      quartier: staff.quartier || "",
    });
  }, [staff]);

  if (!isOpen || !staff) return null;

  const updateField = (
    key: string,
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setError("");

    try {
      setLoading(true);

      await staffManagementService.updateStaff(
        staff.id_utilisateur,
        form
      );

      showToast(
        "Staff modifié avec succès.",
        "success"
      );

      onSuccess();
      onClose();
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Impossible de modifier le staff";

      setError(message);

      showToast(message, "error");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle =
    "rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 " +
    "bg-white text-slate-900 dark:bg-slate-800 dark:border-slate-700 dark:text-white";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[95vh] w-full max-w-4xl overflow-y-auto rounded-[24px] bg-white p-6 shadow-2xl dark:bg-slate-900">

        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Modifier le staff
          </h2>

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
            value={form.nom}
            onChange={(e) =>
              updateField("nom", e.target.value)
            }
            className={inputStyle}
            placeholder="Nom"
            required
          />

          <input
            value={form.prenom}
            onChange={(e) =>
              updateField("prenom", e.target.value)
            }
            className={inputStyle}
            placeholder="Prénom"
            required
          />

          <select
            value={form.genre}
            onChange={(e) =>
              updateField("genre", e.target.value)
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
            value={form.telephone}
            onChange={(e) =>
              updateField(
                "telephone",
                e.target.value
              )
            }
            className={inputStyle}
            placeholder="Téléphone"
            required
          />

          <input
            type="email"
            value={form.email}
            onChange={(e) =>
              updateField("email", e.target.value)
            }
            className={inputStyle}
            placeholder="Email"
            required
          />

          <div />

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
            <div className="md:col-span-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
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
              className="rounded-2xl bg-blue-600 px-5 py-3 font-bold text-white hover:bg-blue-700"
            >
              {loading
                ? "Modification..."
                : "Modifier"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}