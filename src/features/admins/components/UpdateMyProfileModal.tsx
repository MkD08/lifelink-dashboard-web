import LocationSelect from "../../../components/common/LocationSelect";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  loading: boolean;
  profileForm: {
    nom: string;
    prenom: string;
    telephone: string;
    email: string;
    ville: string;
    quartier: string;
    groupe_sanguin: string;
  };
  updateField: (
    key: string,
    value: string
  ) => void;
  onSubmit: (
    e: React.FormEvent
  ) => Promise<void>;
};

export default function UpdateMyProfileModal({
  isOpen,
  onClose,
  loading,
  profileForm,
  updateField,
  onSubmit,
}: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-3xl rounded-[24px] bg-white p-6 shadow-2xl dark:bg-slate-900">
        <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
          Modifier mon profil
        </h3>

        <form
          onSubmit={onSubmit}
          className="mt-6 grid gap-4 md:grid-cols-2"
        >
          <input
            type="text"
            placeholder="Nom"
            value={profileForm.nom}
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
            value={profileForm.prenom}
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
            value={profileForm.telephone}
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
            value={profileForm.email}
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
              ville={profileForm.ville}
              quartier={profileForm.quartier}
              onVilleChange={(value) =>
                updateField(
                  "ville",
                  value
                )
              }
              onQuartierChange={(
                value
              ) =>
                updateField(
                  "quartier",
                  value
                )
              }
            />
          </div>

          <select
            value={
              profileForm.groupe_sanguin
            }
            onChange={(e) =>
              updateField(
                "groupe_sanguin",
                e.target.value
              )
            }
            className="md:col-span-2 rounded-2xl border border-slate-300 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          >
            <option value="">
              Groupe sanguin
            </option>

            <option value="O-">
              O-
            </option>
            <option value="O+">
              O+
            </option>
            <option value="A-">
              A-
            </option>
            <option value="A+">
              A+
            </option>
            <option value="B-">
              B-
            </option>
            <option value="B+">
              B+
            </option>
            <option value="AB-">
              AB-
            </option>
            <option value="AB+">
              AB+
            </option>
          </select>

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
                ? "Enregistrement..."
                : "Enregistrer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}