import { useState } from "react";

type Props = {
  isOpen: boolean;

  isLoading?: boolean;

  onClose: () => void;

  onSubmit: (
    groupe: string,
    quantite: number
  ) => Promise<void>;
};

const bloodGroups = [
  "A+",
  "A-",
  "B+",
  "B-",
  "AB+",
  "AB-",
  "O+",
  "O-",
];

export default function CreateStockModal({
  isOpen,
  isLoading = false,
  onClose,
  onSubmit,
}: Props) {

  const [groupe, setGroupe] =
    useState("A+");

  const [quantite, setQuantite] =
    useState("");

  if (!isOpen) return null;

  const handleSubmit =
    async (
      e: React.FormEvent
    ) => {

      e.preventDefault();

      await onSubmit(
        groupe,
        Number(quantite)
      );
    };

  return (
    <div
      className="
        fixed inset-0 z-[9999]
        flex items-center justify-center
        bg-black/50
        p-4
      "
    >

      <div
        className="
          w-full max-w-md
          rounded-[28px]
          bg-white
          p-6
          shadow-2xl
          dark:bg-slate-900
        "
      >

        <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
          Ajouter un stock
        </h3>

        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Créer un nouveau stock sanguin.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-6 space-y-5"
        >

          {/* GROUPE */}
          <div>

            <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Groupe sanguin
            </label>

            <select
              value={groupe}
              onChange={(e) =>
                setGroupe(
                  e.target.value
                )
              }
              className="
                w-full rounded-2xl
                border border-slate-300
                bg-white
                px-4 py-3
                outline-none
                focus:border-red-500

                dark:border-slate-700
                dark:bg-slate-800
                dark:text-white
              "
            >
              {bloodGroups.map(
                (group) => (
                  <option
                    key={group}
                    value={group}
                  >
                    {group}
                  </option>
                )
              )}
            </select>

          </div>

          {/* QUANTITE */}
          <div>

            <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Quantité
            </label>

            <input
              type="number"
              min="0"
              value={quantite}
              onChange={(e) =>
                setQuantite(
                  e.target.value
                )
              }
              className="
                w-full rounded-2xl
                border border-slate-300
                bg-white
                px-4 py-3
                outline-none
                focus:border-red-500

                dark:border-slate-700
                dark:bg-slate-800
                dark:text-white
              "
              required
            />

          </div>

          {/* ACTIONS */}
          <div className="flex gap-3">

            <button
              type="button"
              onClick={onClose}
              className="
                flex-1 rounded-2xl
                border border-slate-300
                px-4 py-3
                font-semibold
                text-slate-700
                hover:bg-slate-100

                dark:border-slate-700
                dark:text-white
              "
            >
              Annuler
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="
                flex-1 rounded-2xl
                bg-red-600
                px-4 py-3
                font-bold
                text-white
                hover:bg-red-700
                disabled:opacity-60
              "
            >
              {isLoading
                ? "Création..."
                : "Créer"}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}