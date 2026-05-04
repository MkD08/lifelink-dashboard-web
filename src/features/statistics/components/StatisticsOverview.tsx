type Props = {
  totalDonors: number;
  verifiedDonors: number;
  totalRequests: number;
  totalStock: number;
};

export default function StatisticsOverview({
  totalDonors,
  verifiedDonors,
  totalRequests,
  totalStock,
}: Props) {
  const items = [
    {
      label: "Donneurs",
      value: totalDonors,
      color: "from-blue-500 to-blue-600",
    },
    {
      label: "Donneurs vérifiés",
      value: verifiedDonors,
      color: "from-green-500 to-green-600",
    },
    {
      label: "Demandes",
      value: totalRequests,
      color: "from-red-500 to-red-600",
    },
    {
      label: "Stock total",
      value: totalStock,
      color: "from-purple-500 to-purple-600",
    },
  ];

  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-[24px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-md hover:shadow-xl transition"
        >
          <div className={`h-2 w-20 rounded-full bg-gradient-to-r ${item.color}`} />

          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
            {item.label}
          </p>

          <h3 className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white">
            {item.value}
          </h3>
        </div>
      ))}
    </div>
  );
}