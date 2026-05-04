import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { donorsService } from "../services/donors.service";
import type { Donor } from "../types/donor.types";
import { useAuth } from "../../auth/store/auth.store";
import { useToast } from "../../auth/store/toast.store";
import DonorQrModal from "../components/DonorQrModal";

export default function DonorDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [donor, setDonor] = useState<Donor | null>(null);
  const [loading, setLoading] = useState(true);
  const [qrLoading, setQrLoading] = useState(false);
  const [error, setError] = useState("");
  const [qrError, setQrError] = useState("");
  const [qrImage, setQrImage] = useState<string | null>(null);
  const [openQrModal, setOpenQrModal] = useState(false);

  const roleId = user?.role_id;
  const canGenerateQr = roleId === 3 || roleId === 4;

  const loadDonor = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await donorsService.getDonorById(Number(id));
      setDonor(data);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Impossible de charger le donneur";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadDonor();
    }
  }, [id]);

  const handleGenerateQr = async () => {
    if (!donor) return;

    try {
      setQrLoading(true);
      setQrError("");
      setQrImage(null);
      setOpenQrModal(true);

      const qr = await donorsService.generateQr(donor.id_utilisateur);
      setQrImage(qr);

      await loadDonor();

      showToast("QR généré avec succès.", "success");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Impossible de générer le QR";

      setQrError(message);
      showToast(message, "error");
    } finally {
      setQrLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-[24px] border border-slate-200 bg-white dark:bg-slate-900 p-10 text-center shadow-md">
        <p className="text-slate-500">Chargement du donneur...</p>
      </div>
    );
  }

  if (error || !donor) {
    return (
      <div className="space-y-4">
        <button
          onClick={() => navigate("/donors")}
          className="rounded-2xl border border-slate-300 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50"
        >
          Retour
        </button>

        <div className="rounded-[24px] border border-red-200 bg-red-50 p-6 shadow-md">
          <p className="font-semibold text-red-700">
            {error || "Donneur introuvable"}
          </p>
        </div>
      </div>
    );
  }

  const fullName = `${donor.nom ?? ""} ${donor.prenom ?? ""}`.trim();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate("/donors")}
          className="rounded-2xl border border-slate-300 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50"
        >
          Retour
        </button>

        {canGenerateQr && (
          <button
            onClick={handleGenerateQr}
            disabled={qrLoading}
            className="rounded-2xl bg-red-600 px-5 py-3 font-bold text-white hover:bg-red-700 disabled:opacity-60"
          >
            {qrLoading ? "Génération..." : "Générer QR"}
          </button>
        )}
      </div>

      <div className="rounded-[24px] bg-white dark:bg-slate-900 p-6 shadow-md border border-slate-200">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">{fullName}</h1>
        <p className="mt-2 text-slate-500">
          Détails du donneur #{donor.id_utilisateur}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-[24px] bg-white dark:bg-slate-900 p-5 shadow-md border border-slate-200">
          <p className="text-sm text-slate-500">Téléphone</p>
          <h3 className="mt-2 text-lg font-bold text-slate-900 dark:text-white">
            {donor.telephone || "—"}
          </h3>
        </div>

        <div className="rounded-[24px] bg-white dark:bg-slate-900 p-5 shadow-md border border-slate-200">
          <p className="text-sm text-slate-500">Email</p>
          <h3 className="mt-2 text-lg font-bold text-slate-900 dark:text-white">
            {donor.email || "—"}
          </h3>
        </div>

        <div className="rounded-[24px] bg-white dark:bg-slate-900 p-5 shadow-md border border-slate-200">
          <p className="text-sm text-slate-500">Groupe sanguin</p>
          <h3 className="mt-2 text-lg font-bold text-slate-900 dark:text-white">
            {donor.groupe_sanguin || "—"}
          </h3>
        </div>

        <div className="rounded-[24px] bg-white dark:bg-slate-900 p-5 shadow-md border border-slate-200">
          <p className="text-sm text-slate-500">Statut groupe</p>
          <h3 className="mt-2 text-lg font-bold text-slate-900 dark:text-white">
            {donor.statut_groupe_sanguin || "—"}
          </h3>
        </div>

        <div className="rounded-[24px] bg-white dark:bg-slate-900 p-5 shadow-md border border-slate-200">
          <p className="text-sm text-slate-500">Ville / Quartier</p>
          <h3 className="mt-2 text-lg font-bold text-slate-900 dark:text-white">
            {[donor.ville, donor.quartier].filter(Boolean).join(" / ") || "—"}
          </h3>
        </div>

        <div className="rounded-[24px] bg-white dark:bg-slate-900 p-5 shadow-md border border-slate-200">
          <p className="text-sm text-slate-500">Points</p>
          <h3 className="mt-2 text-lg font-bold text-slate-900 dark:text-white">
            {donor.points ?? 0}
          </h3>
        </div>

        <div className="rounded-[24px] bg-white dark:bg-slate-900 p-5 shadow-md border border-slate-200">
          <p className="text-sm text-slate-500">Profil complet</p>
          <h3 className="mt-2 text-lg font-bold text-slate-900 dark:text-white">
            {donor.profil_complet ? "Oui" : "Non"}
          </h3>
        </div>

        <div className="rounded-[24px] bg-white dark:bg-slate-900 p-5 shadow-md border border-slate-200">
          <p className="text-sm text-slate-500">Actif</p>
          <h3 className="mt-2 text-lg font-bold text-slate-900 dark:text-white">
            {donor.actif ? "Oui" : "Non"}
          </h3>
        </div>

        <div className="rounded-[24px] bg-white dark:bg-slate-900 p-5 shadow-md border border-slate-200">
          <p className="text-sm text-slate-500">QR code</p>
          <h3 className="mt-2 text-lg font-bold text-slate-900 dark:text-white">
            {donor.qr_code || "Non généré"}
          </h3>
        </div>
      </div>

      <DonorQrModal
        isOpen={openQrModal}
        donorName={fullName}
        qrValue={qrImage}
        loading={qrLoading}
        error={qrError}
        onClose={() => setOpenQrModal(false)}
      />
    </div>
  );
}