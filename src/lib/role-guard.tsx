import { Navigate } from "react-router-dom";
import { useAuth } from "../features/auth/store/auth.store";

type RoleGuardProps = {
  allowedRoles: number[];
  children: React.ReactNode;
};

export default function RoleGuard({
  allowedRoles,
  children,
}: RoleGuardProps) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const roleId = user?.role_id;

  if (!roleId || !allowedRoles.includes(roleId)) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}