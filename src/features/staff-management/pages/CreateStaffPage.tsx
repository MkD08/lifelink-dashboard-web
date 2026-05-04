import CreateStaffForm from "../components/CreateStaffForm";

export default function CreateStaffPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-[24px] border border-slate-200 bg-white dark:bg-slate-900 p-6 shadow-md">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
          Création de staff
        </h1>
        <p className="mt-2 text-slate-500">
          Cette page permet au directeur de créer un nouveau compte staff.
        </p>
      </div>

      <CreateStaffForm />
    </div>
  );
}