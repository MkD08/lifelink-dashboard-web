import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function DashboardLayout() {
  return (
    <div className="h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white">

      <div className="flex h-screen">

        <Sidebar />

        <div className="flex flex-1 flex-col ml-72">

          <div className="fixed left-72 right-0 top-0 z-30">
            <Topbar />
          </div>

          <main className="mt-16 h-[calc(100vh-64px)] overflow-y-auto p-6">
            <Outlet />
          </main>

        </div>
      </div>
    </div>
  );
}