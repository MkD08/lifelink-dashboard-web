import { useEffect, useState } from "react";

import { alertsService } from "../services/alerts.service";

import { api } from "../../../lib/axios";

import { useToast } from "../../auth/store/toast.store";

import LocationSelect from "../../../components/common/LocationSelect";

import { useAuth } from "../../auth/store/auth.store";

import type { AlertType } from "../types/alert.types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface Centre {
  id_centre: number;
  nom: string;
  ville: string;
  quartier?: string;
}

export default function CreateAlertModal({
  isOpen,
  onClose,
  onSuccess,
}: Props) {

  const { showToast } =
    useToast();

  const { user } =
    useAuth();

  const [titre, setTitre] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [type, setType] =
    useState<AlertType>(
      "urgent"
    );

  const [groupe, setGroupe] =
    useState("");

  const [quantite, setQuantite] =
    useState<number | "">("");  

  const [ville, setVille] =
    useState("");

  const [quartier, setQuartier] =
    useState("");

  const [centreId, setCentreId] =
    useState<number | null>(
      null
    );

  const [isGlobal, setIsGlobal] =
    useState(false);

  const [centres, setCentres] =
    useState<Centre[]>([]);

  const [loading, setLoading] =
    useState(false);

  // =========================
  // ROLES
  // =========================
  const isAdmin =
    user?.role_id === 1;

  const isDirector =
    user?.role_id === 3;

  const isStaff =
    user?.role_id === 4;

  const isCentreUser =
    isDirector || isStaff;

  // =========================
  // LOAD CENTRES
  // =========================
  const loadCentres =
    async () => {

      try {

        const res =
          await api.get(
            "/centres"
          );

        const data =
          res.data?.data ??
          res.data ??
          [];

        setCentres(
          Array.isArray(data)
            ? data
            : []
        );

      } catch (err) {

        console.error(
          err
        );

        setCentres([]);
      }
    };

  useEffect(() => {

    if (isOpen) {
      loadCentres();
    }

  }, [isOpen]);

  // =========================
  // AUTO FILL STAFF/DIRECTOR
  // =========================
  useEffect(() => {

    if (
      isCentreUser &&
      user?.centre_sante
    ) {

      setCentreId(
        user.centre_sante.id_centre
      );

      setVille(
        user.centre_sante.ville || ""
      );

      setQuartier(
        user.centre_sante.adresse ||
          ""
      );
    }

  }, [user]);

  // =========================
  // SELECT CENTRE ADMIN
  // =========================
  useEffect(() => {

    if (
      isAdmin &&
      centreId &&
      !isGlobal
    ) {

      const centre =
        centres.find(
          (c) =>
            c.id_centre ===
            centreId
        );

      if (centre) {

        setVille(
          centre.ville || ""
        );

        setQuartier(
          centre.quartier ||
            ""
        );
      }
    }

  }, [
    centreId,
    centres,
    isAdmin,
    isGlobal,
  ]);

  // =========================
  // RESET GLOBAL
  // =========================
  useEffect(() => {

    if (isGlobal) {

      setCentreId(
        null
      );

      setVille("");

      setQuartier("");
    }

  }, [isGlobal]);

  // =========================
  // SUBMIT
  // =========================
  const handleSubmit =
    async () => {

      try {

        // VALIDATION
        if (!titre) {

          showToast(
            "Le titre est obligatoire",
            "error"
          );

          return;
        }

          if (
          type ===
            "urgent" &&
          !groupe
        ) {

          showToast(
            "Le groupe sanguin est obligatoire",
            "error"
          );

          return;
        }

        if (
          type === "urgent" &&
          (!quantite || quantite <= 0)
        ) {
        
          showToast(
            "La quantité est obligatoire",
            "error"
          );
        
          return;
        }

        setLoading(
          true
        );

        await alertsService.createAlert(
          {

            titre,

            message,

            type,

            groupe_sanguin:
              type ===
              "urgent"
                ? groupe
                : undefined,
            
                quantite:
                type === "urgent"
                  ? Number(quantite)
                  : undefined,    
            ville,

            quartier,

            centre_id:
              isGlobal
                ? undefined
                : centreId ??
                  undefined,

            is_global:
              isGlobal,
          }
        );

        showToast(
          "Alerte créée avec succès",
          "success"
        );

        // RESET
        setTitre("");

        setMessage("");

        setType(
          "urgent"
        );

        setGroupe("");

        setQuantite("");

        setVille("");

        setQuartier("");

        setCentreId(
          null
        );

        setIsGlobal(
          false
        );

        onSuccess();

        onClose();

      } catch (err) {

        console.error(
          err
        );

        showToast(
          "Erreur création alerte",
          "error"
        );

      } finally {

        setLoading(
          false
        );
      }
    };

  if (!isOpen)
    return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">

      <div className="w-full max-w-[520px] space-y-4 rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-900">

        {/* HEADER */}
        <div>

          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Créer une alerte
          </h2>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Création d’une alerte médicale.
          </p>

        </div>

        {/* TITRE */}
        <input
          placeholder="Titre"
          value={titre}
          onChange={(e) =>
            setTitre(
              e.target.value
            )
          }
          className="
            w-full
            rounded-2xl
            border border-slate-300
            bg-white
            px-4 py-3
            outline-none
            focus:border-red-500

            dark:border-slate-700
            dark:bg-slate-800
            dark:text-white
          "
        />

        {/* MESSAGE */}
        <textarea
          rows={4}
          placeholder="Message"
          value={message}
          onChange={(e) =>
            setMessage(
              e.target.value
            )
          }
          className="
            w-full
            rounded-2xl
            border border-slate-300
            bg-white
            px-4 py-3
            outline-none
            focus:border-red-500

            dark:border-slate-700
            dark:bg-slate-800
            dark:text-white
          "
        />

        {/* TYPE */}
        <select
          value={type}
          onChange={(e) => {

            const value =
              e.target
                .value as AlertType;

            setType(
              value
            );

            // RESET GROUP
            if (
              value !==
              "urgent"
            ) {

              setGroupe(
                ""
              );
              setQuantite("");
            }
          }}
          className="
            w-full
            rounded-2xl
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

          <option value="urgent">
            Urgent
          </option>

          <option value="warning">
            Warning
          </option>

          <option value="info">
            Info
          </option>

        </select>

        {/* GROUPE */}
        <select
          disabled={
            type !==
            "urgent"
          }
          value={groupe}
          onChange={(e) =>
            setGroupe(
              e.target.value
            )
          }
          className={`
            w-full
            rounded-2xl
            border
            px-4 py-3
            outline-none

            ${
              type ===
              "urgent"

                ? `
                  border-slate-300
                  bg-white
                  focus:border-red-500

                  dark:border-slate-700
                  dark:bg-slate-800
                  dark:text-white
                `

                : `
                  cursor-not-allowed
                  border-slate-200
                  bg-slate-100
                  text-slate-400

                  dark:border-slate-800
                  dark:bg-slate-900
                `
            }
          `}
        >

          <option value="">
            {type ===
            "urgent"
              ? "Sélectionner groupe sanguin"
              : "Non nécessaire"}
          </option>

          <option value="A+">
            A+
          </option>

          <option value="A-">
            A-
          </option>

          <option value="B+">
            B+
          </option>

          <option value="B-">
            B-
          </option>

          <option value="AB+">
            AB+
          </option>

          <option value="AB-">
            AB-
          </option>

          <option value="O+">
            O+
          </option>

          <option value="O-">
            O-
          </option>

        </select>

        {/* QUANTITE */}

<input
  type="number"
  min="1"

  disabled={
    type !== "urgent"
  }

  value={quantite}

  onChange={(e) =>
    setQuantite(
      e.target.value
        ? Number(
            e.target.value
          )
        : ""
    )
  }

  placeholder={
    type === "urgent"
      ? "Quantité demandée"
      : "Non nécessaire"
  }

  className={`
    w-full
    rounded-2xl
    border
    px-4 py-3
    outline-none

    ${
      type === "urgent"

        ? `
          border-slate-300
          bg-white
          focus:border-red-500

          dark:border-slate-700
          dark:bg-slate-800
          dark:text-white
        `

        : `
          cursor-not-allowed
          border-slate-200
          bg-slate-100
          text-slate-400

          dark:border-slate-800
          dark:bg-slate-900
        `
    }
  `}
/>

        {/* LOCATION */}
        <LocationSelect
          ville={ville}
          quartier={quartier}
          disabled={
            isCentreUser ||
            isGlobal
          }
          onVilleChange={(
            value
          ) =>
            setVille(
              value
            )
          }
          onQuartierChange={(
            value
          ) =>
            setQuartier(
              value
            )
          }
        />

        {/* GLOBAL */}
        {isAdmin &&
 type !== "urgent" && (

          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800">

            <input
              type="checkbox"
              checked={
                isGlobal
              }
              onChange={(e) =>
                setIsGlobal(
                  e.target
                    .checked
                )
              }
            />

            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Alerte globale
            </p>

          </div>
        )}

        {/* CENTRE */}
        <select
          disabled={
            isCentreUser ||
            isGlobal
          }
          value={
            centreId ?? ""
          }
          onChange={(e) =>
            setCentreId(
              e.target.value
                ? Number(
                    e.target
                      .value
                  )
                : null
            )
          }
          className="
            w-full
            rounded-2xl
            border border-slate-300
            bg-white
            px-4 py-3
            outline-none
            focus:border-red-500

            disabled:cursor-not-allowed
            disabled:bg-slate-100

            dark:border-slate-700
            dark:bg-slate-800
            dark:text-white
          "
        >

          <option value="">
            {isGlobal
              ? "Alerte globale"
              : "Sélectionner centre"}
          </option>

          {centres.map(
            (c) => (
              <option
                key={
                  c.id_centre
                }
                value={
                  c.id_centre
                }
              >
                {c.nom} (
                {c.ville})
              </option>
            )
          )}

        </select>

        {/* INFO */}
        {isCentreUser && (
          <div className="rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700 dark:border-blue-900 dark:bg-blue-950/20 dark:text-blue-300">
            Cette alerte sera automatiquement liée à votre centre de santé.
          </div>
        )}

        {/* ACTIONS */}
        <div className="flex justify-end gap-3">

          <button
            onClick={
              onClose
            }
            className="
              rounded-xl
              border border-slate-300
              px-4 py-2

              dark:border-slate-700
              dark:text-white
            "
          >
            Annuler
          </button>

          <button
            disabled={
              loading
            }
            onClick={
              handleSubmit
            }
            className="
              rounded-xl
              bg-red-600
              px-4 py-2
              text-white
              transition
              hover:bg-red-700
              disabled:opacity-60
            "
          >
            {loading
              ? "Création..."
              : "Créer"}
          </button>

        </div>

      </div>

    </div>
  );
}