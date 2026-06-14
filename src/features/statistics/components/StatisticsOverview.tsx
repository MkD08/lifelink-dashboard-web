import {
  Activity,
  AlertTriangle,
  Building2,
  Droplets,
  Heart,
  ShieldCheck,
  UserCheck,
  Users,
} from "lucide-react";

type AdminStatisticsProps = {
  totalCentres: number;
  totalDonors: number;
  totalDons: number;
  totalDemandes: number;
  totalCollectes: number;
  totalAlertes: number;
  totalParticipations: number;
  totalStock: number;
};

type CentreStatisticsProps = {
  totalDonors: number;
  verifiedUsers: number;
  totalDons: number;
  totalDemandes: number;
  totalCollectes: number;
  totalAlertes: number;
  totalParticipations: number;
  totalStock: number;
};

type Props =
  | ({
      type: "admin";
    } & AdminStatisticsProps)
  | ({
      type: "centre";
    } & CentreStatisticsProps);

export default function StatisticsOverview(props: Props) {
  const items =
    props.type === "admin"
      ? [
          {
            label: "Centres",
            value: props.totalCentres,
            color: "from-blue-500 to-blue-600",
            icon: Building2,
          },
          {
            label: "Donneurs",
            value: props.totalDonors,
            color: "from-cyan-500 to-cyan-600",
            icon: Users,
          },
          {
            label: "Dons",
            value: props.totalDons,
            color: "from-red-500 to-red-600",
            icon: Heart,
          },
          {
            label: "Demandes",
            value: props.totalDemandes,
            color: "from-orange-500 to-orange-600",
            icon: Activity,
          },
          {
            label: "Collectes",
            value: props.totalCollectes,
            color: "from-emerald-500 to-emerald-600",
            icon: Droplets,
          },
          {
            label: "Alertes",
            value: props.totalAlertes,
            color: "from-pink-500 to-pink-600",
            icon: AlertTriangle,
          },
          {
            label: "Participations",
            value: props.totalParticipations,
            color: "from-indigo-500 to-indigo-600",
            icon: Users,
          },
          {
            label: "Stock total",
            value: props.totalStock,
            color: "from-red-600 to-rose-600",
            icon: ShieldCheck,
          },
        ]
      : [
          {
            label: "Donneurs",
            value: props.totalDonors,
            color: "from-cyan-500 to-cyan-600",
            icon: Users,
          },
          {
            label: "Utilisateurs vérifiés",
            value: props.verifiedUsers,
            color: "from-emerald-500 to-emerald-600",
            icon: UserCheck,
          },
          {
            label: "Dons",
            value: props.totalDons,
            color: "from-red-500 to-red-600",
            icon: Heart,
          },
          {
            label: "Demandes",
            value: props.totalDemandes,
            color: "from-orange-500 to-orange-600",
            icon: Activity,
          },
          {
            label: "Collectes",
            value: props.totalCollectes,
            color: "from-emerald-500 to-emerald-600",
            icon: Droplets,
          },
          {
            label: "Alertes",
            value: props.totalAlertes,
            color: "from-pink-500 to-pink-600",
            icon: AlertTriangle,
          },
          {
            label: "Participations",
            value: props.totalParticipations,
            color: "from-indigo-500 to-indigo-600",
            icon: Users,
          },
          {
            label: "Stock total",
            value: props.totalStock,
            color: "from-red-600 to-rose-600",
            icon: ShieldCheck,
          },
        ];

  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.label}
            className="
              group
              relative
              overflow-hidden
              rounded-[28px]
              border
              border-slate-200
              dark:border-slate-800
              bg-white
              dark:bg-slate-900
              p-6
              shadow-lg
              transition-all
              duration-300
              hover:-translate-y-1
              hover:shadow-2xl
            "
          >
            <div
              className={`
                absolute
                inset-x-0
                top-0
                h-1
                bg-gradient-to-r
                ${item.color}
              `}
            />

            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  {item.label}
                </p>

                <h3 className="mt-3 text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                  {item.value.toLocaleString()}
                </h3>
              </div>

              <div
                className={`
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-2xl
                  bg-gradient-to-br
                  ${item.color}
                  shadow-lg
                `}
              >
                <Icon
                  size={22}
                  className="text-white"
                />
              </div>
            </div>

            <div className="mt-5 flex items-center gap-2">
              <div
                className={`
                  h-2
                  w-2
                  rounded-full
                  bg-gradient-to-r
                  ${item.color}
                `}
              />

              <span className="text-xs font-medium text-slate-400">
                Données synchronisées
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}