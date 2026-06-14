// import {
//   BarChart,
//   Bar,
//   CartesianGrid,
//   ResponsiveContainer,
//   Tooltip,
//   XAxis,
//   YAxis,
// } from "recharts";

// type Props = {
//   data: { group: string; count: number }[];
// };

// export default function DonationsByGroupChart({ data }: Props) {
//   return (
//     <div className="rounded-[24px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-md">
//       <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
//         Donneurs par groupe sanguin
//       </h3>

//       <div className="mt-6 h-80">
//         <ResponsiveContainer width="100%" height="100%">
//           <BarChart data={data}>
//             <CartesianGrid
//               strokeDasharray="3 3"
//               stroke="rgba(148,163,184,0.2)"
//             />

//             <XAxis
//               dataKey="group"
//               stroke="#94a3b8"
//               tick={{ fill: "#94a3b8" }}
//             />

//             <YAxis stroke="#94a3b8" tick={{ fill: "#94a3b8" }} />

//             <Tooltip
//               contentStyle={{
//                 borderRadius: "12px",
//                 border: "none",
//                 background: "#0f172a",
//                 color: "#fff",
//               }}
//             />

//             <Bar
//               dataKey="count"
//               fill="#DC2626"
//               radius={[10, 10, 0, 0]}
//             />
//           </BarChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );
// }