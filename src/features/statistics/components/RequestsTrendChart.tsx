import {
  LineChart,
  Line,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Props = {
  data: { date: string; count: number }[];
};

export default function RequestsTrendChart({ data }: Props) {
  return (
    <div className="rounded-[24px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-md">
      <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
        Évolution des demandes
      </h3>

      <div className="mt-6 h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(148,163,184,0.2)"
            />

            <XAxis
              dataKey="date"
              stroke="#94a3b8"
              tick={{ fill: "#94a3b8" }}
            />

            <YAxis stroke="#94a3b8" tick={{ fill: "#94a3b8" }} />

            <Tooltip
              contentStyle={{
                borderRadius: "12px",
                border: "none",
                background: "#0f172a",
                color: "#fff",
              }}
            />

            <Line
              type="monotone"
              dataKey="count"
              stroke="#DC2626"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}