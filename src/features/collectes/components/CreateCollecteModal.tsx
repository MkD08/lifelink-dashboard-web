import {
  useState,
} from "react";

import {
  collectesService,
} from "../services/collectes.service";

import {
  useToast,
} from "../../auth/store/toast.store";

import LocationSelect from "../../../components/common/LocationSelect";

/**
 * ==============================
 * THEMES
 * ==============================
 */
const themes = [

  {
    id: "red",

    name: "Rouge Blood",

    gradient:
      "from-red-500 via-red-600 to-rose-700",
  },

  {
    id: "blue",

    name: "Blue Medical",

    gradient:
      "from-cyan-500 via-blue-600 to-indigo-700",
  },

  {
    id: "green",

    name: "Green Health",

    gradient:
      "from-emerald-500 via-green-600 to-teal-700",
  },

  {
    id: "purple",

    name: "Purple Donation",

    gradient:
      "from-purple-500 via-fuchsia-600 to-pink-700",
  },

  {
    id: "orange",

    name: "Orange Sunset",

    gradient:
      "from-orange-400 via-orange-500 to-amber-600",
  },
];

type Props = {

  isOpen: boolean;

  onClose: () => void;

  onCreated: () => Promise<void>;
};

/**
 * ==============================
 * CREATE MODAL
 * ==============================
 */

export default function CreateCollecteModal({

  isOpen,

  onClose,

  onCreated,

}: Props) {

  const [
    form,
    setForm,
  ] = useState<any>({

    theme: "red",

    ville: "",

    quartier: "",
  });

  const [
    loading,
    setLoading,
  ] = useState(false);

  const { showToast } =
    useToast();

  if (!isOpen)
    return null;

  // ==============================
  // SUBMIT
  // ==============================
  const handleSubmit =
  async () => {

    try {

      // 🔥 AUTO LIEU
      const autoLieu =
        form.lieu?.trim() ||

        `${form.quartier}${form.quartier ? ", " : ""}${form.ville}`;

      // VALIDATION
      if (!form.titre) {

        showToast(
          "Le titre est obligatoire",
          "error"
        );

        return;
      }

      if (!form.ville) {

        showToast(
          "La ville est obligatoire",
          "error"
        );

        return;
      }

      // 🔥 VALIDATION AUTO LIEU
      if (!autoLieu.trim()) {

        showToast(
          "Le lieu est obligatoire",
          "error"
        );

        return;
      }

      if (!form.date_collecte) {

        showToast(
          "La date est obligatoire",
          "error"
        );

        return;
      }

      setLoading(true);

      /**
       * ==============================
       * PAYLOAD
       * centre_id vient du backend JWT
       * ==============================
       */
      const payload = {

        ...form,

        // 🔥 LIEU AUTO
        lieu: autoLieu,

        latitude:
          form.latitude
            ? Number(
                form.latitude
              )
            : 0,

        longitude:
          form.longitude
            ? Number(
                form.longitude
              )
            : 0,

        places_max:
          form.places_max
            ? Number(
                form.places_max
              )
            : null,

        date_collecte:
          new Date(
            form.date_collecte
          ).toISOString(),
      };

      console.log(
        "🚀 CREATE PAYLOAD:",
        payload
      );

      await collectesService.create(
        payload
      );

      showToast(
        "Collecte créée avec succès",
        "success"
      );

      await onCreated();

      onClose();

      // RESET
      setForm({

        theme: "red",

        ville: "",

        quartier: "",

        lieu: "",
      });

    } catch (err: any) {

      console.error(err);

      console.log(
        "❌ SERVER:",
        err?.response?.data
      );

      showToast(

        err?.response?.data
          ?.message ||

        err?.message ||

        "Erreur serveur",

        "error"
      );

    } finally {

      setLoading(false);
    }
  };

  return (
    <div
      className="
        fixed inset-0 z-50
        flex items-start justify-center
        overflow-y-auto
        bg-black/50
        p-4
      "
    >

      <div
        className="
          my-10
          w-full
          max-w-4xl
          rounded-[28px]
          bg-white
          p-5
          shadow-2xl
          dark:bg-slate-900
          sm:p-6
        "
      >

        {/* HEADER */}
        <div className="flex items-start justify-between gap-4">

          <div>

            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              Créer une collecte
            </h3>

            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">

              Ajouter une nouvelle
              collecte de sang avec
              un design moderne.
            </p>
          </div>

          <button
            onClick={onClose}
            className="
              flex h-10 w-10 items-center justify-center
              rounded-full
              border border-slate-300
              text-slate-600
              transition
              hover:bg-slate-100
              dark:border-slate-700
              dark:text-slate-300
              dark:hover:bg-slate-800
            "
          >
            ✕
          </button>
        </div>

        {/* FORM */}
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">

          {/* TITRE */}
          <input
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
            placeholder="Titre"
            value={form.titre || ""}
            onChange={(e) =>
              setForm({

                ...form,

                titre:
                  e.target.value,
              })
            }
          />

          {/* LOCALISATION */}
          <div className="md:col-span-2">

            <LocationSelect

              ville={form.ville}

              quartier={
                form.quartier
              }

              onVilleChange={(value) =>
                setForm((prev: any) => ({
                  ...prev,
                  ville: value,
                }))
              }

              onQuartierChange={(value) =>
                setForm((prev: any) => ({
                  ...prev,
                  quartier: value,
                }))
              }
            />
          </div>

          {/* LIEU */}
          <input
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
            placeholder="Lieu / Adresse"

            value={
              form.lieu ||
              `${form.quartier}${form.quartier ? ", " : ""}${form.ville}`
            }

            onChange={(e) =>
              setForm({

                ...form,

                lieu:
                  e.target.value,
              })
            }
          />

          {/* PLACES */}
          <input
            type="number"
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
            placeholder="Places maximum"

            value={
              form.places_max ||
              ""
            }

            onChange={(e) =>
              setForm({

                ...form,

                places_max:
                  e.target.value,
              })
            }
          />

          {/* LATITUDE */}
          <input
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
            placeholder="Latitude"

            value={
              form.latitude ||
              ""
            }

            onChange={(e) =>
              setForm({

                ...form,

                latitude:
                  e.target.value,
              })
            }
          />

          {/* LONGITUDE */}
          <input
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
            placeholder="Longitude"

            value={
              form.longitude ||
              ""
            }

            onChange={(e) =>
              setForm({

                ...form,

                longitude:
                  e.target.value,
              })
            }
          />

          {/* DATE */}
          <input
            type="date"
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
            value={
              form.date_collecte ||
              ""
            }

            onChange={(e) =>
              setForm({

                ...form,

                date_collecte:
                  e.target.value,
              })
            }
          />

          {/* HEURE DEBUT */}
          <input
            type="time"
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
            value={
              form.heure_debut ||
              ""
            }

            onChange={(e) =>
              setForm({

                ...form,

                heure_debut:
                  e.target.value,
              })
            }
          />

          {/* HEURE FIN */}
          <input
            type="time"
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
              md:col-span-2
            "
            value={
              form.heure_fin ||
              ""
            }

            onChange={(e) =>
              setForm({

                ...form,

                heure_fin:
                  e.target.value,
              })
            }
          />

          {/* THEMES */}
          <div className="md:col-span-2">

            <p className="mb-3 text-sm font-bold text-slate-700 dark:text-slate-300">
              Choisir un design
            </p>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">

              {themes.map(
                (theme) => {

                  const selected =
                    form.theme ===
                    theme.id;

                  return (

                    <button
                      key={
                        theme.id
                      }
                      type="button"

                      onClick={() =>
                        setForm({

                          ...form,

                          theme:
                            theme.id,
                        })
                      }

                      className={`
                        relative
                        overflow-hidden
                        rounded-[24px]
                        border-2
                        p-4
                        transition
                        h-32
                        ${
                          selected
                            ? "border-red-500 scale-[1.02]"
                            : "border-transparent"
                        }
                      `}
                    >

                      {/* BG */}
                      <div
                        className={`
                          absolute inset-0
                          bg-gradient-to-br
                          ${theme.gradient}
                        `}
                      />

                      {/* BUBBLES */}
                      <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-white/20" />

                      <div className="absolute bottom-2 left-2 h-10 w-10 rounded-full bg-white/20" />

                      <div className="absolute right-6 top-10 h-6 w-6 rounded-full bg-white/20" />

                      {/* CONTENT */}
                      <div className="relative z-10 flex h-full items-end">

                        <p className="text-left text-sm font-extrabold text-white">
                          {
                            theme.name
                          }
                        </p>
                      </div>
                    </button>
                  );
                }
              )}
            </div>
          </div>

          {/* DESCRIPTION */}
          <textarea
            rows={5}
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
              md:col-span-2
            "
            placeholder="Description"

            value={
              form.description ||
              ""
            }

            onChange={(e) =>
              setForm({

                ...form,

                description:
                  e.target.value,
              })
            }
          />
        </div>

        {/* ACTIONS */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">

          <button
            onClick={onClose}
            className="
              flex-1
              rounded-2xl
              border border-slate-300
              px-4 py-3
              font-semibold
              text-slate-700
              transition
              hover:bg-slate-50
              dark:border-slate-700
              dark:bg-slate-800
              dark:text-white
            "
          >
            Annuler
          </button>

          <button
            onClick={
              handleSubmit
            }

            disabled={
              loading
            }

            className="
              flex-1
              rounded-2xl
              bg-red-600
              px-4 py-3
              font-bold
              text-white
              transition
              hover:bg-red-700
              disabled:opacity-60
            "
          >
            {loading
              ? "Création..."
              : "Créer la collecte"}
          </button>
        </div>
      </div>
    </div>
  );
}