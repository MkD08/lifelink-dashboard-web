const ACCESS_TOKEN_KEY = "access_token";
const USER_KEY = "current_user";

export const storage = {
  setToken(token: string) {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
  },

  getToken() {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },

  clearToken() {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
  },

  setUser(user: unknown) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  getUser<T>() {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as T) : null;
  },

  clearUser() {
    localStorage.removeItem(USER_KEY);
  },

  clearSession() {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
};