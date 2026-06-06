import { NavLink } from "react-router-dom";

import {
  X,
  // Bell,
} from "lucide-react";

import { useAuth } from "../features/auth/store/auth.store";

type NavItem = {
  label: string;
  path: string;
};

type Props = {
  mobile?: boolean;
  onClose?: () => void;
};

export default function Sidebar({
  mobile = false,
  onClose,
}: Props) {

  const { user } =
    useAuth();

  const roleId =
    user?.role_id;

  // ==============================
  // ADMIN NAVIGATION
  // ==============================
  const adminItems: NavItem[] = [

    {
      label: "Dashboard",
      path: "/admin/dashboard",
    },

    {
      label: "Donneurs",
      path: "/donors",
    },
    {
      label: "Utilisateurs vérifiés",
      path: "/admin/verified-users",
    },

    {
      label: "Demandes",
      path: "/requests",
    },

    {
      label: "Notifications",
      path: "/notifications",
    },

    {
      label: "Centres",
      path: "/centres",
    },

    {
      label: "Directeurs",
      path: "/directors",
    },

    {
      label: "Utilisateurs",
      path: "/admin/users",
    },

    {
      label: "Collectes",
      path: "/collectes",
    },

    {
      label: "Alertes",
      path: "/alerts",
    },

    {
      label: "Stocks",
      path: "/stocks",
    },

    {
      label: "Statistiques",
      path: "/statistics",
    },
  ];

  // ==============================
  // STAFF NAVIGATION
  // ==============================
  const staffItems: NavItem[] = [

    {
      label: "Dashboard",
      path: "/staff/dashboard",
    },

    {
      label: "Donneurs",
      path: "/donors",
    },

    {
      label: "Demandes",
      path: "/requests",
    },

    {
      label: "Notifications",
      path: "/notifications",
    },

    {
      label: "Collectes",
      path: "/collectes",
    },

    {
      label: "Stocks",
      path: "/stocks",
    },

    {
      label: "Alertes",
      path: "/alerts",
    },

    {
      label: "Scan QR",
      path: "/scan-qr",
    },
    {
      label: "Utilisateurs à vérifier",
      path: "/users-to-verify",
    },
    
    {
      label: "Utilisateurs vérifiés",
      path: "/verified-users",
    },
  ];

  // ==============================
  // DIRECTOR NAVIGATION
  // ==============================
  const directorItems: NavItem[] = [

    {
      label: "Dashboard",
      path: "/director/dashboard",
    },

    {
      label: "Créer Staff",
      path: "/create-staff",
    },

    {
      label: "Donneurs",
      path: "/donors",
    },

    {
      label: "Demandes",
      path: "/requests",
    },

    {
      label: "Notifications",
      path: "/notifications",
    },

    {
      label: "Centres",
      path: "/centres",
    },

    {
      label: "Collectes",
      path: "/collectes",
    },

    {
      label: "Scan QR",
      path: "/scan-qr",
    },
    {
      label: "Utilisateurs à vérifier",
      path: "/users-to-verify",
    },
    
    {
      label: "Utilisateurs vérifiés",
      path: "/verified-users",
    },

    {
      label: "Stocks",
      path: "/stocks",
    },

    {
      label: "Statistiques",
      path: "/statistics",
    },
  ];

  // ==============================
  // ROLE SWITCH
  // ==============================
  let navItems: NavItem[] = [];

  if (roleId === 1) {

    navItems = adminItems;

  } else if (roleId === 3) {

    navItems = staffItems;

  } else if (roleId === 4) {

    navItems = directorItems;
  }

  return (
    <aside
      className={`
        fixed left-0 top-0 z-50
        flex h-screen w-72 flex-col
        border-r border-slate-200
        bg-white
        dark:border-slate-800
        dark:bg-slate-900
      `}
    >

      {/* HEADER */}
      <div className="border-b border-slate-200 px-6 py-6 dark:border-slate-800">

        <div className="flex items-center justify-between">

          {/* LOGO */}
          <div className="flex items-center gap-3">

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-600 text-xl text-white shadow-md">
              ❤
            </div>

            <div>

              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
                LifeLink
              </h2>

              <p className="text-sm text-slate-500">
                Dashboard Web
              </p>
            </div>
          </div>

          {/* MOBILE CLOSE */}
          {mobile && (

            <button
              onClick={onClose}
              className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
            >
              <X size={20} />
            </button>
          )}
        </div>
      </div>

      {/* NAVIGATION */}
      <nav className="flex-1 space-y-2 overflow-y-auto p-4">

        {navItems.map((item) => (

          <NavLink
            key={item.path}
            to={item.path}
            onClick={() => {

              if (
                mobile &&
                onClose
              ) {

                onClose();
              }
            }}
            className={({ isActive }) =>
              `
                flex items-center gap-3
                rounded-2xl px-4 py-3
                text-sm font-semibold
                transition-all duration-200

                ${
                  isActive
                    ? "bg-red-600 text-white shadow-md"
                    : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                }
              `
            }
          >

            {/* ICONE NOTIFICATION */}
            {/* {item.label === "Notifications" && (
              <Bell size={18} />
            )} */}

            {/* LABEL */}
            <span>
              {item.label}
            </span>

          </NavLink>
        ))}
      </nav>

      {/* FOOTER */}
      <div className="border-t border-slate-200 p-4 text-xs text-slate-400 dark:border-slate-800">
        © LifeLink Dashboard
      </div>
    </aside>
  );
}