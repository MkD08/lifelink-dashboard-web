import { useEffect, useState } from "react";

import StaffTable from "../../../components/tables/StaffTable";

import CreateStaffModal from "../components/CreateStaffModal";
import EditStaffModal from "../components/EditStaffModal";
import DisableStaffModal from "../components/DisableStaffModal";
import EnableStaffModal from "../components/EnableStaffModal";

import { staffManagementService } from "../services/staff-management.service";

import type { Staff } from "../types/staff-management.types";

export default function StaffListPage() {
  const [staffs, setStaffs] = useState<Staff[]>([]);

  const [selectedStaff, setSelectedStaff] =
    useState<Staff | null>(null);

  const [showCreateModal, setShowCreateModal] =
    useState(false);

  const [showEditModal, setShowEditModal] =
    useState(false);

  const [showDisableModal, setShowDisableModal] =
    useState(false);

  const [showEnableModal, setShowEnableModal] =
    useState(false);

  const loadStaffs = async () => {
    try {
      const data =
        await staffManagementService.getStaffs();

      setStaffs(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadStaffs();
  }, []);

  return (
    <>
      <div className="space-y-6">
        <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-md dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                Gestion des staffs
              </h1>

              <p className="mt-2 text-slate-500">
                Gestion des comptes staff de votre centre.
              </p>
            </div>

            <button
              onClick={() =>
                setShowCreateModal(true)
              }
              className="rounded-2xl bg-red-600 px-5 py-3 font-bold text-white transition hover:bg-red-700"
            >
              Créer un staff
            </button>
          </div>
        </div>

        <StaffTable
          users={staffs}
          onEditClick={(staff) => {
            setSelectedStaff(staff);
            setShowEditModal(true);
          }}
          onDeleteClick={(staff) => {
            setSelectedStaff(staff);
            setShowDisableModal(true);
          }}
          onReactivateClick={(staff) => {
            setSelectedStaff(staff);
            setShowEnableModal(true);
          }}
        />
      </div>

      <CreateStaffModal
        isOpen={showCreateModal}
        onClose={() =>
          setShowCreateModal(false)
        }
        onSuccess={loadStaffs}
      />

      <EditStaffModal
        isOpen={showEditModal}
        staff={selectedStaff}
        onClose={() => {
          setShowEditModal(false);
          setSelectedStaff(null);
        }}
        onSuccess={loadStaffs}
      />

      <DisableStaffModal
        isOpen={showDisableModal}
        staff={selectedStaff}
        onClose={() => {
          setShowDisableModal(false);
          setSelectedStaff(null);
        }}
        onSuccess={loadStaffs}
      />

      <EnableStaffModal
        isOpen={showEnableModal}
        staff={selectedStaff}
        onClose={() => {
          setShowEnableModal(false);
          setSelectedStaff(null);
        }}
        onSuccess={loadStaffs}
      />
    </>
  );
}