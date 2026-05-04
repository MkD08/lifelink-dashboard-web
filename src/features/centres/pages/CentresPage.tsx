import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../auth/store/auth.store";
import CentresTable from "../../../components/tables/CentresTable";
import CreateCentreModal from "../components/CreateCentreModal";
import EditCentreModal from "../components/EditCentreModal";
import DeleteCentreModal from "../components/DeleteCentreModal";
import { centresService } from "../services/centres.service";
import { exportToCsv, exportToPdf } from "../../../utils/export";
import type { Centre } from "../types/centre.types";

export default function CentresPage() {
  const { user } = useAuth();

  const [centres, setCentres] = useState<Centre[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [selectedCentreToEdit, setSelectedCentreToEdit] = useState<Centre | null>(null);
  const [selectedCentreToDelete, setSelectedCentreToDelete] = useState<Centre | null>(null);

  const isAdmin = user?.role_id === 1;

  const loadCentres = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await centresService.getAllCentres();
      setCentres(data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Impossible de charger les centres");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCentres();
  }, []);

  const filteredCentres = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) return centres;

    return centres.filter((centre) => {
      const id = String(centre.id_centre);
      const nom = centre.nom.toLowerCase();
      const ville = centre.ville?.toLowerCase() ?? "";
      const adresse = centre.adresse?.toLowerCase() ?? "";
      const telephone = centre.telephone?.toLowerCase() ?? "";

      return (
        id.includes(term) ||
        nom.includes(term) ||
        ville.includes(term) ||
        adresse.includes(term) ||
        telephone.includes(term)
      );
    });
  }, [centres, search]);
  const centreColumns = [
    { header: "ID", accessor: (c: Centre) => c.id_centre },
    { header: "Nom", accessor: (c: Centre) => c.nom },
    { header: "Ville", accessor: (c: Centre) => c.ville || "—" },
    { header: "Adresse", accessor: (c: Centre) => c.adresse || "—" },
    { header: "Téléphone", accessor: (c: Centre) => c.telephone || "—" },
  ];

  return (
    <div className="space-y-6">
  {/* HEADER */}
  <div className="rounded-[24px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-md">
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
          Centres
        </h2>
        <p className="mt-2 text-slate-500 dark:text-slate-400">
          Liste des centres de santé enregistrés.
        </p>
      </div>

      <div className="flex w-full max-w-5xl gap-3 flex-wrap">
        
        {/* SEARCH */}
        <input
          type="text"
          placeholder="Rechercher par nom, ville, adresse..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-4 py-3 outline-none focus:border-red-500"
        />

        {/* EXPORT CSV */}
        <button
          onClick={() => exportToCsv("centres", filteredCentres, centreColumns)}
          className="rounded-2xl border border-slate-300 dark:border-slate-700 px-4 py-3 font-semibold text-slate-700 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800"
        >
          Export CSV
        </button>

        {/* EXPORT PDF */}
        <button
          onClick={() =>
            exportToPdf("centres", "Liste des centres", filteredCentres, centreColumns)
          }
          className="rounded-2xl bg-red-600 px-4 py-3 font-bold text-white hover:bg-red-700"
        >
          Export PDF
        </button>

        {/* CREATE */}
        {isAdmin && (
          <button
            onClick={() => setOpenCreateModal(true)}
            className="rounded-2xl bg-red-600 px-5 py-3 font-bold text-white hover:bg-red-700"
          >
            Nouveau centre
          </button>
        )}
      </div>
    </div>
  </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-[24px] border border-slate-200 bg-white dark:bg-slate-900 p-5 shadow-md">
          <p className="text-sm text-slate-500">Total centres</p>
          <h3 className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white">
            {centres.length}
          </h3>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-white dark:bg-slate-900 p-5 shadow-md">
          <p className="text-sm text-slate-500">Résultats filtrés</p>
          <h3 className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white">
            {filteredCentres.length}
          </h3>
        </div>
      </div>

      {loading && (
        <div className="rounded-[24px] border border-slate-200 bg-white dark:bg-slate-900 p-10 text-center shadow-md">
          <p className="text-slate-500">Chargement des centres...</p>
        </div>
      )}

      {!loading && error && (
        <div className="rounded-[24px] border border-red-200 bg-red-50 p-6 shadow-md">
          <p className="font-semibold text-red-700">{error}</p>
        </div>
      )}

      {!loading && !error && filteredCentres.length === 0 && (
        <div className="rounded-[24px] border border-slate-200 bg-white dark:bg-slate-900 p-10 text-center shadow-md">
          <p className="text-slate-500">Aucun centre trouvé.</p>
        </div>
      )}

      {!loading && !error && filteredCentres.length > 0 && (
        <CentresTable
          centres={filteredCentres}
          isAdmin={isAdmin}
          onEditClick={(centre) => setSelectedCentreToEdit(centre)}
          onDeleteClick={(centre) => setSelectedCentreToDelete(centre)}
        />
      )}

      <CreateCentreModal
        isOpen={openCreateModal}
        onClose={() => setOpenCreateModal(false)}
        onCreated={loadCentres}
      />

      <EditCentreModal
        centre={selectedCentreToEdit}
        isOpen={!!selectedCentreToEdit}
        onClose={() => setSelectedCentreToEdit(null)}
        onUpdated={loadCentres}
      />

      <DeleteCentreModal
        centre={selectedCentreToDelete}
        isOpen={!!selectedCentreToDelete}
        onClose={() => setSelectedCentreToDelete(null)}
        onDeleted={loadCentres}
      />
    </div>
  );
}