import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
  } from "recharts";
  
  type Props = {
    data: {
      group: string;
      quantity: number;
    }[];
  };
  
  const COLORS = [
    "#DC2626",
    "#EF4444",
    "#F87171",
    "#FB7185",
    "#E11D48",
    "#BE123C",
    "#B91C1C",
    "#991B1B",
  ];
  
  export default function StockChart({
    data,
  }: Props) {
    return (
      <div className="rounded-[28px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-lg transition-all duration-300 hover:shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Stock sanguin
            </h3>
  
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Répartition actuelle des poches disponibles
            </p>
          </div>
  
          <div className="flex items-center gap-2 rounded-full bg-red-50 px-3 py-1 dark:bg-red-950/40">
            <div className="h-2 w-2 rounded-full bg-red-500" />
  
            <span className="text-xs font-medium text-red-600 dark:text-red-400">
              Temps réel
            </span>
          </div>
        </div>
  
        <div className="mt-8 h-80">
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <BarChart data={data}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(148,163,184,0.15)"
                vertical={false}
              />
  
              <XAxis
                dataKey="group"
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: "#94A3B8",
                  fontSize: 13,
                }}
              />
  
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: "#94A3B8",
                  fontSize: 13,
                }}
              />
  
              <Tooltip
                cursor={{
                  fill: "rgba(220,38,38,0.06)",
                }}
                contentStyle={{
                  borderRadius: "16px",
                  border: "1px solid rgba(255,255,255,0.08)",
                  background: "#0f172a",
                  color: "#fff",
                  boxShadow:
                    "0 20px 40px rgba(0,0,0,0.25)",
                }}
              />
  
              <Bar
                dataKey="quantity"
                radius={[12, 12, 0, 0]}
                animationDuration={1200}
              >
                {data.map((_, index) => (
                  <Cell
                    key={index}
                    fill={
                      COLORS[
                        index % COLORS.length
                      ]
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }