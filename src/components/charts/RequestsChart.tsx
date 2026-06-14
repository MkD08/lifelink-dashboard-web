import {
    Area,
    AreaChart,
    CartesianGrid,
    Line,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
  } from "recharts";
  
  type Props = {
    data: {
      month: string;
      count: number;
    }[];
  };
  
  export default function RequestsChart({
    data,
  }: Props) {
    return (
      <div className="rounded-[28px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-lg transition-all duration-300 hover:shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Évolution des demandes
            </h3>
  
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Tendance mensuelle des demandes de sang
            </p>
          </div>
  
          <div className="flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 dark:bg-amber-950/40">
            <div className="h-2 w-2 rounded-full bg-amber-500" />
  
            <span className="text-xs font-medium text-amber-600 dark:text-amber-400">
              Demandes actives
            </span>
          </div>
        </div>
  
        <div className="mt-8 h-80">
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <AreaChart data={data}>
              <defs>
                <linearGradient
                  id="requestsGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor="#F59E0B"
                    stopOpacity={0.35}
                  />
  
                  <stop
                    offset="100%"
                    stopColor="#F59E0B"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
  
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(148,163,184,0.15)"
                vertical={false}
              />
  
              <XAxis
                dataKey="month"
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
                contentStyle={{
                  borderRadius: "16px",
                  border: "1px solid rgba(255,255,255,0.08)",
                  background: "#0f172a",
                  color: "#fff",
                  boxShadow:
                    "0 20px 40px rgba(0,0,0,0.25)",
                }}
              />
  
              <Area
                type="monotone"
                dataKey="count"
                stroke="none"
                fill="url(#requestsGradient)"
                animationDuration={1200}
              />
  
              <Line
                type="monotone"
                dataKey="count"
                stroke="#F59E0B"
                strokeWidth={4}
                dot={{
                  r: 4,
                  fill: "#F59E0B",
                  strokeWidth: 0,
                }}
                activeDot={{
                  r: 7,
                  fill: "#F59E0B",
                }}
                animationDuration={1200}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }