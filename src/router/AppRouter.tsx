import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "../features/auth/pages/LoginPage";
import AdminDashboardPage from "../features/dashboard/pages/AdminDashboardPage";
import StaffDashboardPage from "../features/dashboard/pages/StaffDashboardPage";
import DirectorDashboardPage from "../features/dashboard/pages/DirectorDashboardPage";
import DonorsPage from "../features/donors/pages/DonorsPage";
import RequestsPage from "../features/requests/pages/RequestsPage";
import CentresPage from "../features/centres/pages/CentresPage";
import AlertsPage from "../features/alerts/pages/AlertsPage";
import CollectesPage from "../features/collectes/pages/CollectesPage";
import StocksPage from "../features/stocks/pages/StocksPage";
import StatisticsPage from "../features/statistics/pages/StatisticsPage";
import CreateStaffPage from "../features/staff-management/pages/CreateStaffPage";
import DonorDetailsPage from "../features/donors/pages/DonorDetailsPage";
import ScanQrPage from "../features/donors/pages/ScanQrPage";
import AdminUsersPage from "../features/admin-users/pages/AdminUsersPage";
import DashboardLayout from "../layouts/DashboardLayout";
import AuthGuard from "../lib/auth-guard";
import RoleGuard from "../lib/role-guard";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />

      <Route
        element={
          <AuthGuard>
            <DashboardLayout />
          </AuthGuard>
        }
      >
        <Route
          path="/admin/dashboard"
          element={
            <RoleGuard allowedRoles={[1]}>
              <AdminDashboardPage />
            </RoleGuard>
          }
        />

        <Route
          path="/staff/dashboard"
          element={
            <RoleGuard allowedRoles={[3]}>
              <StaffDashboardPage />
            </RoleGuard>
          }
        />

        <Route
          path="/director/dashboard"
          element={
            <RoleGuard allowedRoles={[4]}>
              <DirectorDashboardPage />
            </RoleGuard>
          }
        />

        <Route
          path="/donors"
          element={
            <RoleGuard allowedRoles={[1, 3, 4]}>
              <DonorsPage />
            </RoleGuard>
          }
        />
        <Route
  path="/donors/:id"
  element={
    <RoleGuard allowedRoles={[1, 3, 4]}>
      <DonorDetailsPage />
    </RoleGuard>
  }
/>
<Route
  path="/admin/users"
  element={
    <RoleGuard allowedRoles={[1]}>
      <AdminUsersPage />
    </RoleGuard>
  }
/>
<Route
  path="/scan-qr"
  element={
    <RoleGuard allowedRoles={[3, 4]}>
      <ScanQrPage />
    </RoleGuard>
  }
/>
        <Route
          path="/requests"
          element={
            <RoleGuard allowedRoles={[1, 3, 4]}>
              <RequestsPage />
            </RoleGuard>
          }
        />

        <Route
          path="/centres"
          element={
            <RoleGuard allowedRoles={[1, 4]}>
              <CentresPage />
            </RoleGuard>
          }
        />

        <Route
          path="/alerts"
          element={
            <RoleGuard allowedRoles={[1, 3, 4]}>
              <AlertsPage />
            </RoleGuard>
          }
        />

        <Route
          path="/stocks"
          element={
            <RoleGuard allowedRoles={[1, 3, 4]}>
              <StocksPage />
            </RoleGuard>
          }
        />
        <Route
  path="/collectes"
  element={
    <RoleGuard allowedRoles={[1, 3, 4]}>
      <CollectesPage />
    </RoleGuard>
  }
/>

        <Route
          path="/statistics"
          element={
            <RoleGuard allowedRoles={[1, 4]}>
              <StatisticsPage />
            </RoleGuard>
          }
        />

        <Route
          path="/create-staff"
          element={
            <RoleGuard allowedRoles={[4]}>
              <CreateStaffPage />
            </RoleGuard>
          }
        />
      </Route>
      <Route
  path="/donors"
  element={
    <RoleGuard allowedRoles={[1, 3, 4]}>
      <DonorsPage />
    </RoleGuard>
  }
/>
    </Routes>
  );
}