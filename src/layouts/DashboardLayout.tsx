import { useState } from "react";

import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  return (
    <div className="h-screen overflow-visible bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white">

      <div className="flex h-screen">

        {/* ========================= */}
        {/* DESKTOP SIDEBAR */}
        {/* ========================= */}
        <div className="hidden lg:flex">
          <Sidebar />
        </div>

        {/* ========================= */}
        {/* MOBILE SIDEBAR */}
        {/* ========================= */}
        {sidebarOpen && (
          <>
            {/* OVERLAY */}
            <div
              className="fixed inset-0 z-40 bg-black/50 lg:hidden"
              onClick={() =>
                setSidebarOpen(false)
              }
            />

            {/* DRAWER */}
            <div className="fixed left-0 top-0 z-50 h-screen lg:hidden">
              <Sidebar
                mobile
                onClose={() =>
                  setSidebarOpen(false)
                }
              />
            </div>
          </>
        )}

        {/* ========================= */}
        {/* CONTENT */}
        {/* ========================= */}
        <div
  className="
    flex min-w-0 flex-1 flex-col
    overflow-visible
    lg:ml-72
  "
>

          {/* TOPBAR */}
          <div className="fixed left-0 right-0 top-0 z-30 lg:left-72">
            <Topbar
              onMenuClick={() =>
                setSidebarOpen(true)
              }
            />
          </div>

          {/* MAIN */}
          <main
  className="
    mt-16
    h-[calc(100vh-64px)]

    overflow-x-hidden
    overflow-y-auto

    p-4 sm:p-6
    min-w-0
  "
>
            <Outlet />
          </main>

        </div>
      </div>
    </div>
  );
}