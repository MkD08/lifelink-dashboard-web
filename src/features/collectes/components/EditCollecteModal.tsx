import { useState, useEffect } from "react";
import { collectesService } from "../services/collectes.service";

export default function EditCollecteModal({ collecte, isOpen, onClose, onUpdated }: any) {
  const [form, setForm] = useState<any>({});
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (collecte) setForm(collecte);
  }, [collecte]);

  if (!isOpen || !collecte) return null;

  const handleSubmit = async () => {
    setLoading(true);

    const fd = new FormData();

    Object.entries(form).forEach(([k, v]) => {
      if (v) fd.append(k, String(v));
    });

    if (file) fd.append("image", file);

    await collectesService.update(collecte.id_collecte, fd);

    onUpdated();
    onClose();
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-3xl rounded-[24px] bg-white dark:bg-slate-900 p-6 shadow-2xl">

        <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
          Modifier la collecte
        </h3>

        <div className="mt-6 grid md:grid-cols-2 gap-4">

          <input className="input" value={form.titre || ""}
            onChange={e => setForm({...form, titre:e.target.value})} />

          <input className="input" value={form.ville || ""}
            onChange={e => setForm({...form, ville:e.target.value})} />

          <input type="file"
            onChange={e => setFile(e.target.files?.[0] || null)} />

        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-2xl border border-slate-300 px-4 py-3 font-semibold"
          >
            Annuler
          </button>

          <button
            onClick={handleSubmit}
            className="flex-1 rounded-2xl bg-red-600 px-4 py-3 font-bold text-white"
          >
            {loading ? "Modification..." : "Modifier"}
          </button>
        </div>

      </div>
    </div>
  );
}