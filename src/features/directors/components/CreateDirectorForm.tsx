import { useEffect, useState } from "react";
import { api } from "../../../lib/axios";

import { directorsService } from "../services/directors.service";

import { useToast } from "../../auth/store/toast.store";

const genders = [
  { label: "Masculin", value: "M" },
  { label: "Féminin", value: "F" },
];

interface Centre {
  id_centre: number;
  nom: string;
  ville: string;
}

export default function CreateDirectorForm() {
  const { showToast } = useToast();

  const [centres, setCentres] = useState<Centre[]>([]);

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
    centre_id: 0,
  });

  const [loading, setLoading] = useState(false);
  const [loadingCentres, setLoadingCentres] =
    useState(true);

  const [error, setError] = useState("");

  /**
   * LOAD CENTRES
   */
  const loadCentres = async () => {
    try {
      setLoadingCentres(true);

      const response = await api.get("/centres");

      const data =
        response.data?.data ??
        response.data ??
        [];

      setCentres(
        Array.isArray(data) ? data : []
      );
    } catch (err) {
      console.error(
        "❌ Impossible charger centres",
        err
      );

      showToast(
        "Impossible de charger les centres",
        "error"
      );
    } finally {
      setLoadingCentres(false);
    }
  };

  useEffect(() => {
    loadCentres();
  }, []);

  /**
   * UPDATE FIELD
   */
  const updateField = (
    key: string,
    value: string | number
  ) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  /**
   * RESET
   */
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
      centre_id: 0,
    });
  };

  /**
   * SUBMIT
   */
  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setError("");

    try {
      setLoading(true);

      await directorsService.createDirector(
        form
      );

      resetForm();

      showToast(
        "Directeur créé avec succès.",
        "success"
      );
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Impossible de créer le directeur";

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
    <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-md dark:border-slate-800 dark:bg-slate-900">
      <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
        Créer un directeur
      </h2>

      <p className="mt-2 text-slate-500 dark:text-slate-400">
        Création et assignation d’un directeur
        à un centre de santé.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-6 grid gap-4 md:grid-cols-2"
      >
        {/* NOM */}
        <input
          type="text"
          placeholder="Nom"
          value={form.nom}
          onChange={(e) =>
            updateField("nom", e.target.value)
          }
          className={inputStyle}
          required
        />

        {/* PRENOM */}
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

        {/* GENRE */}
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

        {/* DATE */}
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

        {/* TELEPHONE */}
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

        {/* EMAIL */}
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

        {/* PASSWORD */}
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

        {/* VILLE */}
        <input
          type="text"
          placeholder="Ville"
          value={form.ville}
          onChange={(e) =>
            updateField(
              "ville",
              e.target.value
            )
          }
          className={inputStyle}
          required
        />

        {/* QUARTIER */}
        <input
          type="text"
          placeholder="Quartier"
          value={form.quartier}
          onChange={(e) =>
            updateField(
              "quartier",
              e.target.value
            )
          }
          className={`${inputStyle} md:col-span-2`}
          required
        />

        {/* CENTRE */}
        <select
          value={form.centre_id}
          onChange={(e) =>
            updateField(
              "centre_id",
              Number(e.target.value)
            )
          }
          className={`${inputStyle} md:col-span-2`}
          required
        >
          <option value={0}>
            {loadingCentres
              ? "Chargement centres..."
              : "Sélectionner un centre"}
          </option>

          {centres.map((centre) => (
            <option
              key={centre.id_centre}
              value={centre.id_centre}
            >
              {centre.nom} ({centre.ville})
            </option>
          ))}
        </select>

        {/* ERROR */}
        {error && (
          <div className="md:col-span-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
            {error}
          </div>
        )}

        {/* BUTTON */}
        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-red-600 py-3 font-bold text-white transition hover:bg-red-700 disabled:opacity-60"
          >
            {loading
              ? "Création..."
              : "Créer le directeur"}
          </button>
        </div>
      </form>
    </div>
  );
}