import { useState } from "react";

type Props = {
  donorId: number;
  donorName: string;
  isOpen: boolean;
  isLoading?: boolean;
  onClose: () => void;
  onSubmit: (bloodGroup: string) => Promise<void>;
};

const bloodGroups = ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"];

export default function VerifyBloodGroupModal({
  donorId,
  donorName,
  isOpen,
  isLoading = false,
  onClose,
  onSubmit,
}: Props) {
  const [selectedGroup, setSelectedGroup] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedGroup) return;

    await onSubmit(selectedGroup);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-[24px] bg-white dark:bg-slate-900 p-6 shadow-2xl">
        <div className="mb-5">
          <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
            Vérifier le groupe sanguin
          </h3>
          <p className="mt-2 text-sm text-slate-500">
            Donneur : <span className="font-semibold">{donorName}</span>
          </p>
          <p className="text-sm text-slate-500">
            ID : <span className="font-semibold">{donorId}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Groupe sanguin validé
            </label>
            <select
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-red-500"
              required
            >
              <option value="">Choisir un groupe sanguin</option>
              {bloodGroups.map((group) => (
                <option key={group} value={group}>
                  {group}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-2xl border border-slate-300 px-4 py-3 font-semibold text-slate-700 hover:bg-slate-50"
            >
              Annuler
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 rounded-2xl bg-red-600 px-4 py-3 font-bold text-white hover:bg-red-700 disabled:opacity-60"
            >
              {isLoading ? "Validation..." : "Valider"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}