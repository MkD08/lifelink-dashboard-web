import { NavLink } from "react-router-dom";
import { useAuth } from "../features/auth/store/auth.store";

type NavItem = {
  label: string;
  path: string;
};

export default function Sidebar() {
  const { user } = useAuth();
  const roleId = user?.role_id;

  // ==============================
  // 🔥 NAV ITEMS
  // ==============================
  const adminItems: NavItem[] = [
    { label: "Dashboard", path: "/admin/dashboard" },
    { label: "Donneurs", path: "/donors" },
    { label: "Demandes", path: "/requests" },
    { label: "Centres", path: "/centres" },
    { label: "Utilisateurs", path: "/admin/users" },
    { label: "Collectes", path: "/collectes" },
    { label: "Alertes", path: "/alerts" },
    { label: "Stocks", path: "/stocks" },
    { label: "Statistiques", path: "/statistics" },
  ];

  const staffItems: NavItem[] = [
    { label: "Dashboard", path: "/staff/dashboard" },
    { label: "Donneurs", path: "/donors" },
    { label: "Demandes", path: "/requests" },
    { label: "Collectes", path: "/collectes" },
    { label: "Stocks", path: "/stocks" },
    { label: "Alertes", path: "/alerts" },
    { label: "Scan QR", path: "/scan-qr" },
  ];

  const directorItems: NavItem[] = [
    { label: "Dashboard", path: "/director/dashboard" },
    { label: "Créer Staff", path: "/create-staff" },
    { label: "Donneurs", path: "/donors" },
    { label: "Demandes", path: "/requests" },
    { label: "Centres", path: "/centres" },
    { label: "Collectes", path: "/collectes" },
    { label: "Scan QR", path: "/scan-qr" },
    { label: "Stocks", path: "/stocks" },
    { label: "Statistiques", path: "/statistics" },
  ];

  let navItems: NavItem[] = [];

  if (roleId === 1) navItems = adminItems;
  else if (roleId === 3) navItems = staffItems;
  else if (roleId === 4) navItems = directorItems;

  // ==============================
  // 🔥 RENDER
  // ==============================
  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-72 flex-col border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 lg:flex">

      {/* HEADER */}
      <div className="border-b border-slate-200 px-6 py-6 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-600 text-xl text-white">
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
      </div>

      {/* NAV */}
      <nav className="flex-1 space-y-2 overflow-y-auto p-4">

        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `block rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                isActive
                  ? "bg-red-600 text-white shadow-md"
                  : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}

      </nav>

      {/* FOOTER */}
      <div className="border-t border-slate-200 p-4 text-xs text-slate-400 dark:border-slate-800">
        © LifeLink
      </div>

    </aside>
  );
}