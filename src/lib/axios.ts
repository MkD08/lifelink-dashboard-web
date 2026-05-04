import axios from "axios";
import { API_BASE_URL } from "../config/api-endpoints";
import { storage } from "./storage";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = storage.getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      storage.clearSession();
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);