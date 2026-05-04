import { AxiosError } from "axios";
import { API_ENDPOINTS } from "../../../config/api-endpoints";
import { api } from "../../../lib/axios";
import { storage } from "../../../lib/storage";
import type { LoginOfficeResponse, User } from "../types/auth.types";

export const authService = {
  async login(email: string, password: string) {
    try {
      const response = await api.post<LoginOfficeResponse>(
        API_ENDPOINTS.loginOffice,
        {
          email,
          password,
        }
      );

      const payload = response.data;

      if (!payload?.success) {
        throw new Error(payload?.message || "Connexion impossible");
      }

      const user = payload.user;
      const accessToken = payload.access_token ?? "";

      if (!user) {
        throw new Error("Utilisateur introuvable dans la réponse");
      }

      if (!accessToken) {
        throw new Error("Token d'accès manquant");
      }

      storage.setToken(accessToken);
      storage.setUser(user);

      return { user, accessToken };
    } catch (error) {
      if (error instanceof AxiosError) {
        const message =
          error.response?.data?.message ||
          error.message ||
          "Erreur de connexion";
        throw new Error(message);
      }

      if (error instanceof Error) {
        throw error;
      }

      throw new Error("Erreur de connexion");
    }
  },

  async getCurrentUser() {
    const response = await api.get<{ success: boolean; data?: User }>(
      API_ENDPOINTS.me
    );

    if (!response.data?.success || !response.data?.data) {
      throw new Error("Impossible de récupérer l'utilisateur connecté");
    }

    storage.setUser(response.data.data);
    return response.data.data;
  },

  logout() {
    storage.clearSession();
  },
};