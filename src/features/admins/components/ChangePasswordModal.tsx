import { useState } from "react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  loading: boolean;
  passwordForm: {
    old_password: string;
    new_password: string;
    confirm_password: string;
  };
  updateField: (
    key: string,
    value: string
  ) => void;
  onSubmit: (
    e: React.FormEvent
  ) => Promise<void>;
};

export default function ChangePasswordModal({
  isOpen,
  onClose,
  loading,
  passwordForm,
  updateField,
  onSubmit,
}: Props) {
  const [showOld, setShowOld] =
    useState(false);

  const [showNew, setShowNew] =
    useState(false);

  const [showConfirm, setShowConfirm] =
    useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-xl rounded-[24px] bg-white p-6 shadow-2xl dark:bg-slate-900">
        <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
          Modifier le mot de passe
        </h3>

        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Choisissez un mot de passe sécurisé pour protéger votre compte.
        </p>

        <form
          onSubmit={onSubmit}
          className="mt-6 space-y-4"
        >
          {/* Ancien mot de passe */}

          <div className="relative">
            <input
              type={
                showOld
                  ? "text"
                  : "password"
              }
              placeholder="Ancien mot de passe"
              value={
                passwordForm.old_password
              }
              onChange={(e) =>
                updateField(
                  "old_password",
                  e.target.value
                )
              }
              className="
                w-full
                rounded-2xl
                border border-slate-300
                px-4 py-3 pr-14
                outline-none
                focus:border-blue-500

                dark:border-slate-700
                dark:bg-slate-800
                dark:text-white
              "
            />

            <button
              type="button"
              onClick={() =>
                setShowOld(!showOld)
              }
              className="
                absolute
                right-4
                top-1/2
                -translate-y-1/2
                text-sm
                font-semibold
                text-slate-500
                hover:text-slate-700

                dark:text-slate-400
                dark:hover:text-white
              "
            >
              {showOld
                ? "Masquer"
                : "Afficher"}
            </button>
          </div>

          {/* Nouveau mot de passe */}

          <div className="relative">
            <input
              type={
                showNew
                  ? "text"
                  : "password"
              }
              placeholder="Nouveau mot de passe"
              value={
                passwordForm.new_password
              }
              onChange={(e) =>
                updateField(
                  "new_password",
                  e.target.value
                )
              }
              className="
                w-full
                rounded-2xl
                border border-slate-300
                px-4 py-3 pr-14
                outline-none
                focus:border-blue-500

                dark:border-slate-700
                dark:bg-slate-800
                dark:text-white
              "
            />

            <button
              type="button"
              onClick={() =>
                setShowNew(!showNew)
              }
              className="
                absolute
                right-4
                top-1/2
                -translate-y-1/2
                text-sm
                font-semibold
                text-slate-500
                hover:text-slate-700

                dark:text-slate-400
                dark:hover:text-white
              "
            >
              {showNew
                ? "Masquer"
                : "Afficher"}
            </button>
          </div>

          {/* Confirmation */}

          <div className="relative">
            <input
              type={
                showConfirm
                  ? "text"
                  : "password"
              }
              placeholder="Confirmer le mot de passe"
              value={
                passwordForm.confirm_password
              }
              onChange={(e) =>
                updateField(
                  "confirm_password",
                  e.target.value
                )
              }
              className="
                w-full
                rounded-2xl
                border border-slate-300
                px-4 py-3 pr-20
                outline-none
                focus:border-blue-500

                dark:border-slate-700
                dark:bg-slate-800
                dark:text-white
              "
            />

            <button
              type="button"
              onClick={() =>
                setShowConfirm(
                  !showConfirm
                )
              }
              className="
                absolute
                right-4
                top-1/2
                -translate-y-1/2
                text-sm
                font-semibold
                text-slate-500
                hover:text-slate-700

                dark:text-slate-400
                dark:hover:text-white
              "
            >
              {showConfirm
                ? "Masquer"
                : "Afficher"}
            </button>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="
                flex-1
                rounded-2xl
                border border-slate-300
                px-4 py-3
                font-semibold

                dark:border-slate-700
                dark:bg-slate-800
                dark:text-white
              "
            >
              Annuler
            </button>

            <button
              type="submit"
              disabled={loading}
              className="
                flex-1
                rounded-2xl
                bg-blue-600
                px-4 py-3
                font-bold
                text-white
                hover:bg-blue-700
                disabled:opacity-60
              "
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