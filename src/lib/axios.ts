import axios from "axios";

import { API_BASE_URL } from "../config/api-endpoints";

import { storage } from "./storage";

/* =========================
   API INSTANCE
========================= */
export const api = axios.create({
  baseURL: API_BASE_URL,

  timeout: 20000, // 🔥 important render free

  headers: {
    "Content-Type":
      "application/json",

    Accept:
      "application/json",
  },
});

/* =========================
   REQUEST INTERCEPTOR
========================= */
api.interceptors.request.use(
  (config) => {
    const token =
      storage.getToken();

    console.log(
      "🚀 API REQUEST:",
      config.method?.toUpperCase(),
      config.url
    );

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },

  (error) => {
    console.error(
      "❌ REQUEST ERROR:",
      error
    );

    return Promise.reject(
      error
    );
  }
);

/* =========================
   RESPONSE INTERCEPTOR
========================= */
api.interceptors.response.use(
  (response) => {
    console.log(
      "✅ API RESPONSE:",
      response.config.url,
      response.status
    );

    return response;
  },

  async (error) => {
    console.error(
      "🔥 API ERROR:",
      error
    );

    // =========================
    // NO RESPONSE
    // =========================
    if (!error.response) {
      console.error(
        "📛 NETWORK ERROR / BACKEND OFFLINE"
      );

      // 🔥 éviter crash complet
      return Promise.reject(
        new Error(
          "Connexion serveur impossible. Vérifiez votre connexion ou réessayez dans quelques secondes."
        )
      );
    }

    const status =
      error.response.status;

    console.error(
      "📛 STATUS:",
      status
    );

    // =========================
    // 401 TOKEN EXPIRED
    // =========================
    if (status === 401) {
      console.warn(
        "⚠️ SESSION EXPIRED"
      );

      storage.clearSession();

      // 🔥 petit délai propre
      setTimeout(() => {
        window.location.href =
          "/login";
      }, 1000);

      return Promise.reject(
        new Error(
          "Session expirée."
        )
      );
    }

    // =========================
    // 500 SERVER ERROR
    // =========================
    if (status >= 500) {
      return Promise.reject(
        new Error(
          "Serveur temporairement indisponible."
        )
      );
    }

    // =========================
    // CUSTOM BACKEND MESSAGE
    // =========================
    return Promise.reject(
      new Error(
        error.response.data
          ?.message ||
          "Une erreur est survenue."
      )
    );
  }
);