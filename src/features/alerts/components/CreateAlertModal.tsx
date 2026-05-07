import { useEffect, useState } from "react";
import { alertsService } from "../services/alerts.service";
import { api } from "../../../lib/axios";
import { useToast } from "../../auth/store/toast.store";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface Centre {
  id_centre: number;
  nom: string;
  ville: string;
}

export default function CreateAlertModal({
  isOpen,
  onClose,
  onSuccess,
}: Props) {
  const { showToast } = useToast();

  const [titre, setTitre] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState("urgent");
  const [groupe, setGroupe] = useState("");
  const [ville, setVille] = useState("");
  const [centreId, setCentreId] = useState<number | null>(null);

  const [centres, setCentres] = useState<Centre[]>([]);
  const [loading, setLoading] = useState(false);

  // =========================
  // LOAD CENTRES (SAFE)
  // =========================
  const loadCentres = async () => {
    try {
      console.log("🚀 LOAD CENTRES");

      const res = await api.get("/centres");

      console.log("📦 CENTRES RAW:", res.data);

      // 🔥 SAFE EXTRACTION
      const data = res.data?.data ?? res.data ?? [];

      if (Array.isArray(data)) {
        setCentres(data);
      } else {
        console.warn("⚠️ centres n'est pas un tableau");
        setCentres([]);
      }
    } catch (err) {
      console.error("❌ CENTRES LOAD ERROR:", err);
      setCentres([]);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadCentres();
    }
  }, [isOpen]);

  // =========================
  // SUBMIT ALERT
  // =========================
  const handleSubmit = async () => {
    try {
      setLoading(true);

      console.log("🚀 CREATE ALERT:", {
        titre,
        message,
        type,
        groupe_sanguin: groupe,
        ville,
        centre_id: centreId,
      });

      await alertsService.createAlert({
        titre,
        message,
        type: type as any,
        groupe_sanguin: groupe,
        ville,
        centre_id: centreId ?? undefined,
      });

      showToast("Alerte créée avec succès", "success");

      // RESET
      setTitre("");
      setMessage("");
      setGroupe("");
      setVille("");
      setCentreId(null);

      onSuccess();
      onClose();
    } catch (err) {
      console.error("❌ CREATE ALERT ERROR:", err);
      showToast("Erreur création alerte", "error");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-[520px] space-y-4 rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-900">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Créer une alerte
        </h2>

        {/* TITRE */}
        <input
          className="
            w-full
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
          placeholder="Titre"
          value={titre}
          onChange={(e) => setTitre(e.target.value)}
        />

        {/* MESSAGE */}
        <textarea
          className="
            w-full
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
          placeholder="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        {/* TYPE */}
        <select
          className="
            w-full
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
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option
            value="urgent"
            className="dark:bg-slate-800 dark:text-white"
          >
            Urgent
          </option>

          <option
            value="warning"
            className="dark:bg-slate-800 dark:text-white"
          >
            Warning
          </option>

          <option
            value="info"
            className="dark:bg-slate-800 dark:text-white"
          >
            Info
          </option>
        </select>

        {/* GROUPE */}
        <input
          className="
            w-full
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
          placeholder="Groupe sanguin (ex: O+)"
          value={groupe}
          onChange={(e) => setGroupe(e.target.value)}
        />

        {/* VILLE */}
        <input
          className="
            w-full
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
          placeholder="Ville"
          value={ville}
          onChange={(e) => setVille(e.target.value)}
        />

        {/* CENTRE SELECT (SAFE) */}
        <select
          className="
            w-full
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
          value={centreId ?? ""}
          onChange={(e) =>
            setCentreId(
              e.target.value ? Number(e.target.value) : null
            )
          }
        >
          <option
            value=""
            className="dark:bg-slate-800 dark:text-white"
          >
            Sélectionner un centre
          </option>

          {centres.length > 0 ? (
            centres.map((c) => (
              <option
                key={c.id_centre}
                value={c.id_centre}
                className="dark:bg-slate-800 dark:text-white"
              >
                {c.nom} ({c.ville})
              </option>
            ))
          ) : (
            <option
              disabled
              className="dark:bg-slate-800 dark:text-white"
            >
              Aucun centre disponible
            </option>
          )}
        </select>

        {/* ACTIONS */}
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-xl border border-slate-300 px-4 py-2 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          >
            Annuler
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="rounded-xl bg-red-600 px-4 py-2 text-white"
          >
            {loading ? "Création..." : "Créer"}
          </button>
        </div>
      </div>
    </div>
  );
}