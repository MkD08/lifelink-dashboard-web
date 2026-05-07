import { useEffect, useMemo, useState } from "react";
import DonorsTable from "../../../components/tables/DonorsTable";
import VerifyBloodGroupModal from "../components/VerifyBloodGroupModal";
import { donorsService } from "../services/donors.service";
import type { Donor } from "../types/donor.types";
import { useAuth } from "../../auth/store/auth.store";
import { exportToCsv, exportToPdf } from "../../../utils/export";
import { useToast } from "../../auth/store/toast.store";

export default function DonorsPage() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [donors, setDonors] = useState<Donor[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState("");
  const [selectedDonor, setSelectedDonor] = useState<Donor | null>(null);

  const roleId = user?.role_id;
  const canVerify = roleId === 3 || roleId === 4;

  const loadDonors = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await donorsService.getAllDonors();
      setDonors(data);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Impossible de charger les donneurs";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDonors();
  }, []);

  const filteredDonors = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) return donors;

    return donors.filter((donor) => {
      const fullName = `${donor.nom} ${donor.prenom}`.toLowerCase();
      const phone = donor.telephone?.toLowerCase() ?? "";
      const city = donor.ville?.toLowerCase() ?? "";
      const quartier = donor.quartier?.toLowerCase() ?? "";
      const blood = donor.groupe_sanguin?.toLowerCase() ?? "";

      return (
        fullName.includes(term) ||
        phone.includes(term) ||
        city.includes(term) ||
        quartier.includes(term) ||
        blood.includes(term)
      );
    });
  }, [donors, search]);

  const verifiedCount = donors.filter(
    (d) => d.statut_groupe_sanguin === "verifie"
  ).length;

  const completeCount = donors.filter((d) => d.profil_complet === true).length;

  const handleVerifySubmit = async (bloodGroup: string) => {
    if (!selectedDonor) return;

    try {
      setVerifying(true);

      await donorsService.verifyBloodGroup(
        selectedDonor.id_utilisateur,
        bloodGroup
      );

      setSelectedDonor(null);
      await loadDonors();

      showToast("Groupe sanguin vérifié avec succès.", "success");
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Impossible de vérifier le groupe sanguin";

      setError(message);
      showToast(message, "error");
    } finally {
      setVerifying(false);
    }
  };

  const donorColumns = [
    {
      header: "ID",
      accessor: (d: Donor) => d.id_utilisateur,
    },
    {
      header: "Nom complet",
      accessor: (d: Donor) => `${d.nom ?? ""} ${d.prenom ?? ""}`.trim(),
    },
    {
      header: "Téléphone",
      accessor: (d: Donor) => d.telephone || "—",
    },
    {
      header: "Ville",
      accessor: (d: Donor) => d.ville || "—",
    },
    {
      header: "Quartier",
      accessor: (d: Donor) => d.quartier || "—",
    },
    {
      header: "Groupe sanguin",
      accessor: (d: Donor) => d.groupe_sanguin || "—",
    },
    {
      header: "Statut groupe",
      accessor: (d: Donor) => d.statut_groupe_sanguin || "—",
    },
    {
      header: "Profil complet",
      accessor: (d: Donor) => (d.profil_complet ? "Oui" : "Non"),
    },
    {
      header: "Actif",
      accessor: (d: Donor) => (d.actif ? "Oui" : "Non"),
    },
    {
      header: "Points",
      accessor: (d: Donor) => d.points ?? 0,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-md dark:border-slate-700 dark:bg-slate-900">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              Tous les donneurs
            </h2>
            <p className="mt-2 text-slate-500 dark:text-slate-400">
              Liste complète des donneurs enregistrés dans la plateforme.
            </p>
          </div>

          <div className="flex w-full max-w-4xl gap-3">
            <input
              type="text"
              placeholder="Rechercher par nom, téléphone, ville, quartier, groupe..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="
                flex-1
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

            <button
              onClick={() =>
                exportToCsv("donneurs", filteredDonors, donorColumns)
              }
              className="rounded-2xl border border-slate-300 px-4 py-3 font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700"
            >
              Export CSV
            </button>

            <button
              onClick={() =>
                exportToPdf(
                  "donneurs",
                  "Liste des donneurs",
                  filteredDonors,
                  donorColumns
                )
              }
              className="rounded-2xl bg-red-600 px-4 py-3 font-bold text-white hover:bg-red-700"
            >
              Export PDF
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-md dark:border-slate-700 dark:bg-slate-900">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Total donneurs
          </p>
          <h3 className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white">
            {donors.length}
          </h3>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-md dark:border-slate-700 dark:bg-slate-900">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Groupes vérifiés
          </p>
          <h3 className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white">
            {verifiedCount}
          </h3>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-md dark:border-slate-700 dark:bg-slate-900">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Profils complets
          </p>
          <h3 className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white">
            {completeCount}
          </h3>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-md dark:border-slate-700 dark:bg-slate-900">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Résultats filtrés
          </p>
          <h3 className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white">
            {filteredDonors.length}
          </h3>
        </div>
      </div>

      {!loading && error && (
        <div className="rounded-[24px] border border-red-200 bg-red-50 p-6 shadow-md dark:border-red-800 dark:bg-red-950/40">
          <p className="font-semibold text-red-700 dark:text-red-400">
            {error}
          </p>
        </div>
      )}

      {loading ? (
        <div className="rounded-[24px] border border-slate-200 bg-white p-10 text-center shadow-md dark:border-slate-700 dark:bg-slate-900">
          <p className="text-slate-500 dark:text-slate-400">
            Chargement des donneurs...
          </p>
        </div>
      ) : filteredDonors.length === 0 ? (
        <div className="rounded-[24px] border border-slate-200 bg-white p-10 text-center shadow-md dark:border-slate-700 dark:bg-slate-900">
          <p className="text-slate-500 dark:text-slate-400">
            Aucun donneur trouvé.
          </p>
        </div>
      ) : (
        <DonorsTable
          donors={filteredDonors}
          canVerify={canVerify}
          onVerifyClick={(donor) => setSelectedDonor(donor)}
        />
      )}

      <VerifyBloodGroupModal
        donorId={selectedDonor?.id_utilisateur ?? 0}
        donorName={
          selectedDonor
            ? `${selectedDonor.nom} ${selectedDonor.prenom}`
            : ""
        }
        isOpen={!!selectedDonor}
        isLoading={verifying}
        onClose={() => setSelectedDonor(null)}
        onSubmit={handleVerifySubmit}
      />
    </div>
  );
}