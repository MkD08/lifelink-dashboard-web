import { useState } from "react";
import { staffManagementService } from "../services/staff-management.service";
import { useToast } from "../../auth/store/toast.store";

const genders = [
  { label: "Masculin", value: "M" },
  { label: "Féminin", value: "F" },
];

export default function CreateStaffForm() {
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

  const updateField = (key: string, value: string) => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);

      await staffManagementService.createStaff(form);

      resetForm();
      showToast("Staff créé avec succès.", "success");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Impossible de créer le staff";

      setError(message);
      showToast(message, "error");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle =
    "rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-red-500 " +
    "bg-white text-slate-900 placeholder:text-slate-400 " +
    "dark:bg-slate-800 dark:border-slate-700 dark:text-white dark:placeholder:text-slate-400";

  return (
    <div className="rounded-[24px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-md">
      
      <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
        Créer un staff
      </h2>

      <p className="mt-2 text-slate-500 dark:text-slate-400">
        Formulaire réservé au directeur pour créer un nouveau membre du staff.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 grid gap-4 md:grid-cols-2">

        <input
          type="text"
          placeholder="Nom"
          value={form.nom}
          onChange={(e) => updateField("nom", e.target.value)}
          className={inputStyle}
          required
        />

        <input
          type="text"
          placeholder="Prénom"
          value={form.prenom}
          onChange={(e) => updateField("prenom", e.target.value)}
          className={inputStyle}
          required
        />

        <select
          value={form.genre}
          onChange={(e) => updateField("genre", e.target.value)}
          className={inputStyle}
        >
          {genders.map((gender) => (
            <option key={gender.value} value={gender.value}>
              {gender.label}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={form.date_naissance}
          onChange={(e) => updateField("date_naissance", e.target.value)}
          className={inputStyle}
          required
        />

        <input
          type="text"
          placeholder="Téléphone"
          value={form.telephone}
          onChange={(e) => updateField("telephone", e.target.value)}
          className={inputStyle}
          required
        />

        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => updateField("email", e.target.value)}
          className={inputStyle}
          required
        />

        <input
          type="password"
          placeholder="Mot de passe"
          value={form.password}
          onChange={(e) => updateField("password", e.target.value)}
          className={inputStyle}
          required
        />

        <input
          type="text"
          placeholder="Ville"
          value={form.ville}
          onChange={(e) => updateField("ville", e.target.value)}
          className={inputStyle}
          required
        />

        <input
          type="text"
          placeholder="Quartier"
          value={form.quartier}
          onChange={(e) => updateField("quartier", e.target.value)}
          className={`${inputStyle} md:col-span-2`}
          required
        />

        {error && (
          <div className="md:col-span-2 rounded-2xl border border-red-200 bg-red-50 dark:bg-red-900/20 px-4 py-3 text-sm font-medium text-red-700 dark:text-red-400">
            {error}
          </div>
        )}

        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-red-600 py-3 font-bold text-white hover:bg-red-700 disabled:opacity-60 transition"
          >
            {loading ? "Création..." : "Créer le staff"}
          </button>
        </div>
      </form>
    </div>
  );
}