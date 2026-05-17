import { useNavigate } from "react-router-dom";
import type { Donor } from "../../features/donors/types/donor.types";

type Props = {
  donors: Donor[];
  canVerify: boolean;
  onVerifyClick: (donor: Donor) => void;
};

function getFullName(donor: Donor) {
  return `${donor.nom} ${donor.prenom}`.trim();
}

function getVerificationLabel(status: string | null) {
  if (status === "verifie") return "Vérifié";
  if (status === "non_verifie") return "Non vérifié";
  return "—";
}

export default function DonorsTable({
  donors,
  canVerify,
  onVerifyClick,
}: Props) {
  const navigate = useNavigate();

  return (
    <div className="overflow-hidden rounded-[24px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md">
      <div className="w-full overflow-x-auto scrollbar-thin">
      <table className="min-w-[1300px] w-full bg-white dark:bg-slate-900">

          {/* HEADER */}
          <thead className="bg-slate-50 dark:bg-slate-800">
            <tr className="text-left text-sm text-slate-600 dark:text-slate-300">
              <th className="whitespace-nowrap px-5 py-4 font-semibold">Nom complet</th>
              <th className="whitespace-nowrap px-5 py-4 font-semibold">Téléphone</th>
              <th className="whitespace-nowrap px-5 py-4 font-semibold">Ville</th>
              <th className="whitespace-nowrap px-5 py-4 font-semibold">Groupe</th>
              <th className="whitespace-nowrap px-5 py-4 font-semibold">Statut groupe</th>
              <th className="whitespace-nowrap px-5 py-4 font-semibold">Profil complet</th>
              <th className="whitespace-nowrap px-5 py-4 font-semibold">Points</th>
              <th className="whitespace-nowrap px-5 py-4 font-semibold">Actif</th>
              <th className="whitespace-nowrap px-5 py-4 font-semibold">Actions</th>
            </tr>
          </thead>

          {/* BODY */}
          <tbody>
            {donors.map((donor) => (
              <tr
                key={donor.id_utilisateur}
                className="border-t border-slate-100 dark:border-slate-800 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
              >
                <td className="whitespace-nowrap px-5 py-4 font-semibold text-slate-900 dark:text-white">
                  {getFullName(donor)}
                </td>

                <td className="whitespace-nowrap px-5 py-4">{donor.telephone || "—"}</td>

                <td className="whitespace-nowrap px-5 py-4">
                  {[donor.ville, donor.quartier].filter(Boolean).join(" / ") || "—"}
                </td>

                <td className="whitespace-nowrap px-5 py-4">
                  <span className="font-bold text-red-600 dark:text-red-400">
                    {donor.groupe_sanguin || "—"}
                  </span>
                </td>

                {/* STATUT GROUPE */}
                <td className="whitespace-nowrap px-5 py-4">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                      donor.statut_groupe_sanguin === "verifie"
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                        : donor.statut_groupe_sanguin === "non_verifie"
                        ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300"
                        : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                    }`}
                  >
                    {getVerificationLabel(donor.statut_groupe_sanguin)}
                  </span>
                </td>

                {/* PROFIL */}
                <td className="whitespace-nowrap px-5 py-4">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                      donor.profil_complet
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                        : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                    }`}
                  >
                    {donor.profil_complet ? "Oui" : "Non"}
                  </span>
                </td>

                <td className="whitespace-nowrap px-5 py-4">{donor.points ?? 0}</td>

                {/* ACTIF */}
                <td className="whitespace-nowrap px-5 py-4">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                      donor.actif
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                        : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-300"
                    }`}
                  >
                    {donor.actif ? "Oui" : "Non"}
                  </span>
                </td>

                {/* ACTIONS */}
                <td className="whitespace-nowrap px-5 py-4">
                <div className="flex flex-wrap gap-2">

                    <button
                      onClick={() => navigate(`/donors/${donor.id_utilisateur}`)}
                      className="rounded-xl border border-slate-300 dark:border-slate-700 px-3 py-2 text-xs font-bold text-slate-700 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                    >
                      Voir détails
                    </button>

                    {canVerify && (
                      <button
                        onClick={() => onVerifyClick(donor)}
                        className="rounded-xl bg-red-600 px-3 py-2 text-xs font-bold text-white hover:bg-red-700 transition"
                      >
                        Vérifier
                      </button>
                    )}

                  </div>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
}