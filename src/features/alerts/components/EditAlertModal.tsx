import {
    useEffect,
    useState,
  } from "react";
  
  import { alertsService } from "../services/alerts.service";
  
  import type {
    Alert,
    AlertType,
  } from "../types/alert.types";
  
  import { useToast } from "../../auth/store/toast.store";
  
  interface Props {
    alert: Alert | null;
  
    isOpen: boolean;
  
    onClose: () => void;
  
    onSuccess: () => void;
  }
  
  export default function EditAlertModal({
    alert,
    isOpen,
    onClose,
    onSuccess,
  }: Props) {
  
    const { showToast } =
      useToast();
  
    const [loading, setLoading] =
      useState(false);
  
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
  
    // =========================
    // INIT DATA
    // =========================
    useEffect(() => {
  
      if (alert) {
  
        setTitre(
          alert.titre || ""
        );
  
        setMessage(
          alert.message || ""
        );
  
        setType(
          alert.type
        );
  
        setGroupe(
          alert.groupe_sanguin ||
            ""
        );
      }
  
    }, [alert]);
  
    // =========================
    // SUBMIT
    // =========================
    const handleSubmit =
      async () => {
  
        if (!alert)
          return;
  
        try {
  
          // VALIDATION
          if (!titre) {
  
            showToast(
              "Le titre est obligatoire",
              "error"
            );
  
            return;
          }
  
          if (!message) {
  
            showToast(
              "Le message est obligatoire",
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
  
          setLoading(
            true
          );
  
          await alertsService.updateAlert(
            alert.id_alerte,
            {
  
              titre,
  
              message,
  
              type,
  
              groupe_sanguin:
                type ===
                "urgent"
                  ? groupe
                  : undefined,
            }
          );
  
          showToast(
            "Alerte modifiée avec succès",
            "success"
          );
  
          onSuccess();
  
          onClose();
  
        } catch (err) {
  
          console.error(
            err
          );
  
          showToast(
            "Erreur modification",
            "error"
          );
  
        } finally {
  
          setLoading(
            false
          );
        }
      };
  
    if (
      !isOpen ||
      !alert
    )
      return null;
  
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
  
        <div className="w-full max-w-[520px] space-y-4 rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-900">
  
          {/* HEADER */}
          <div>
  
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Modifier alerte
            </h2>
  
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Modifier les informations de l’alerte.
            </p>
  
          </div>
  
          {/* TITRE */}
          <input
            value={titre}
            onChange={(e) =>
              setTitre(
                e.target.value
              )
            }
            placeholder="Titre"
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
            value={message}
            onChange={(e) =>
              setMessage(
                e.target.value
              )
            }
            placeholder="Message"
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
  
          {/* INFO */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-800">
  
            <p className="font-semibold text-slate-700 dark:text-slate-300">
              Centre :
              {" "}
              {alert.centre?.nom ||
                "Aucun"}
            </p>
  
            <p className="mt-1 text-slate-500 dark:text-slate-400">
              {alert.ville || "—"}
              {" • "}
              {alert.quartier || "—"}
            </p>
  
          </div>
  
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
                ? "Modification..."
                : "Enregistrer"}
            </button>
  
          </div>
  
        </div>
  
      </div>
    );
  }