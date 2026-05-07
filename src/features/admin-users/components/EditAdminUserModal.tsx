import { useEffect, useState } from "react";
import { useToast } from "../../auth/store/toast.store";
import { adminUsersService } from "../services/admin-users.service";
import type { AdminUser } from "../types/admin-user.types";

type Props = {
  user: AdminUser | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdated: () => Promise<void>;
};

const roles = [
  { label: "Admin", value: 1 },
  { label: "User", value: 2 },
  { label: "Staff", value: 3 },
  { label: "Directeur", value: 4 },
];

const bloodStatuses = [
  { label: "Non vérifié", value: "non_verifie" },
  { label: "Vérifié", value: "verifie" },
];

export default function EditAdminUserModal({
  user,
  isOpen,
  onClose,
  onUpdated,
}: Props) {
  const { showToast } = useToast();

  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    telephone: "",
    email: "",
    ville: "",
    quartier: "",
    role_id: "2",
    actif: true,
    groupe_sanguin: "",
    statut_groupe_sanguin: "non_verifie",
    centre_id: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      setForm({
        nom: user.nom ?? "",
        prenom: user.prenom ?? "",
        telephone: user.telephone ?? "",
        email: user.email ?? "",
        ville: user.ville ?? "",
        quartier: user.quartier ?? "",
        role_id: String(user.role_id ?? 2),
        actif: !!user.actif,
        groupe_sanguin: user.groupe_sanguin ?? "",
        statut_groupe_sanguin: user.statut_groupe_sanguin ?? "non_verifie",
        centre_id: user.centre_id ? String(user.centre_id) : "",
      });
    }
  }, [user]);

  if (!isOpen || !user) return null;

  const updateField = (key: string, value: string | boolean) => {
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

      await adminUsersService.updateUser(user.id_utilisateur, {
        nom: form.nom.trim() || null,
        prenom: form.prenom.trim() || null,
        telephone: form.telephone.trim() || null,
        email: form.email.trim() || null,
        ville: form.ville.trim() || null,
        quartier: form.quartier.trim() || null,
        role_id: Number(form.role_id),
        actif: form.actif,
        groupe_sanguin: form.groupe_sanguin.trim() || null,
        statut_groupe_sanguin: form.statut_groupe_sanguin || null,
        centre_id: form.centre_id ? Number(form.centre_id) : null,
      });

      await onUpdated();
      onClose();
      showToast("Utilisateur modifié avec succès.", "success");
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Impossible de modifier l'utilisateur";

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
          Modifier l’utilisateur
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
          />

          <input
            type="text"
            placeholder="Prénom"
            value={form.prenom}
            onChange={(e) => updateField("prenom", e.target.value)}
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

              dark:border-slate-700
              dark:bg-slate-800
              dark:text-white
              dark:placeholder:text-slate-400
            "
          />

          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => updateField("email", e.target.value)}
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
          />

          <input
            type="text"
            placeholder="Ville"
            value={form.ville}
            onChange={(e) => updateField("ville", e.target.value)}
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
          />

          <input
            type="text"
            placeholder="Quartier"
            value={form.quartier}
            onChange={(e) => updateField("quartier", e.target.value)}
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
          />

          <select
            value={form.role_id}
            onChange={(e) => updateField("role_id", e.target.value)}
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
            {roles.map((role) => (
              <option
                key={role.value}
                value={role.value}
                className="dark:bg-slate-800 dark:text-white"
              >
                {role.label}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Centre ID"
            value={form.centre_id}
            onChange={(e) => updateField("centre_id", e.target.value)}
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
          />

          <input
            type="text"
            placeholder="Groupe sanguin"
            value={form.groupe_sanguin}
            onChange={(e) => updateField("groupe_sanguin", e.target.value)}
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
          />

          <select
            value={form.statut_groupe_sanguin}
            onChange={(e) =>
              updateField("statut_groupe_sanguin", e.target.value)
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
            {bloodStatuses.map((status) => (
              <option
                key={status.value}
                value={status.value}
                className="dark:bg-slate-800 dark:text-white"
              >
                {status.label}
              </option>
            ))}
          </select>

          <label className="md:col-span-2 flex items-center gap-3 rounded-2xl border border-slate-300 px-4 py-3 dark:border-slate-700 dark:bg-slate-800">
            <input
              type="checkbox"
              checked={form.actif}
              onChange={(e) => updateField("actif", e.target.checked)}
              className="h-4 w-4"
            />

            <span className="text-sm font-semibold text-slate-700 dark:text-white">
              Utilisateur actif
            </span>
          </label>

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
              {loading ? "Modification..." : "Enregistrer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}