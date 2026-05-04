import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { authService } from "../services/auth.service";
import { storage } from "../../../lib/storage";
import type { User } from "../types/auth.types";

type AuthContextType = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(storage.getUser<User>());
  const [token, setToken] = useState<string | null>(storage.getToken());
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const existingToken = storage.getToken();
    const existingUser = storage.getUser<User>();

    if (existingToken && existingUser) {
      setToken(existingToken);
      setUser(existingUser);
    }
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const result = await authService.login(email, password);
      setUser(result.user);
      setToken(result.accessToken);
      return result.user;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setToken(null);
  };

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: !!token && !!user,
      isLoading,
      login,
      logout,
    }),
    [user, token, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}