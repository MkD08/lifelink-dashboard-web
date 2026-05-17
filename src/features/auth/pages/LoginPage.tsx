import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import {
  Moon,
  Sun,
  Monitor,
} from "lucide-react";

import { useAuth } from "../store/auth.store";

export default function LoginPage() {
  const navigate =
    useNavigate();

  const {
    login,
    isLoading,
  } = useAuth();

  const [email, setEmail] =
    useState("");

  const [
    password,
    setPassword,
  ] = useState("");

  const [error, setError] =
    useState("");

  const [themeOpen, setThemeOpen] =
    useState(false);

  // =========================
  // APPLY THEME
  // =========================
  const applyTheme = (
    value:
      | "light"
      | "dark"
      | "auto"
  ) => {
    const root =
      document.documentElement;

    root.classList.remove(
      "dark"
    );

    if (value === "dark") {
      root.classList.add(
        "dark"
      );
    }

    if (value === "auto") {
      if (
        window.matchMedia(
          "(prefers-color-scheme: dark)"
        ).matches
      ) {
        root.classList.add(
          "dark"
        );
      }
    }

    localStorage.setItem(
      "theme",
      value
    );
  };

  // =========================
  // LOAD THEME
  // =========================
  useEffect(() => {
    const saved =
      (localStorage.getItem(
        "theme"
      ) as any) || "auto";

    applyTheme(saved);
  }, []);

  // =========================
  // LOGIN
  // =========================
  const handleLogin =
    async (
      e: React.FormEvent
    ) => {
      e.preventDefault();

      setError("");

      try {
        const result =
          await login(
            email,
            password
          );

        const roleId =
          result.role_id;

        if (roleId === 1) {
          navigate(
            "/admin/dashboard"
          );

          return;
        }

        if (roleId === 3) {
          navigate(
            "/staff/dashboard"
          );

          return;
        }

        if (roleId === 4) {
          navigate(
            "/director/dashboard"
          );

          return;
        }

        setError(
          "Rôle non autorisé pour le backoffice"
        );
      } catch (err) {
        if (
          err instanceof Error
        ) {
          setError(
            err.message
          );

          return;
        }

        setError(
          "Connexion impossible"
        );
      }
    };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 transition dark:bg-slate-950">

      {/* THEME BUTTON */}
      <div className="absolute right-6 top-6">

        <div className="relative">

          <button
            onClick={() =>
              setThemeOpen(
                !themeOpen
              )
            }
            className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-300 bg-white shadow-md transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800"
          >
            <Moon
              size={20}
              className="text-slate-700 dark:text-white"
            />
          </button>

          {/* DROPDOWN */}
          {themeOpen && (
            <div className="absolute right-0 z-50 mt-3 w-44 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900">

              <button
                onClick={() => {
                  applyTheme(
                    "light"
                  );

                  setThemeOpen(
                    false
                  );
                }}
                className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:text-white dark:hover:bg-slate-800"
              >
                <Sun
                  size={16}
                />

                Light
              </button>

              <button
                onClick={() => {
                  applyTheme(
                    "dark"
                  );

                  setThemeOpen(
                    false
                  );
                }}
                className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:text-white dark:hover:bg-slate-800"
              >
                <Moon
                  size={16}
                />

                Dark
              </button>

              <button
                onClick={() => {
                  applyTheme(
                    "auto"
                  );

                  setThemeOpen(
                    false
                  );
                }}
                className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:text-white dark:hover:bg-slate-800"
              >
                <Monitor
                  size={16}
                />

                Auto
              </button>

            </div>
          )}

        </div>

      </div>

      {/* CARD */}
      <div className="w-full max-w-md rounded-[32px] border border-slate-200 bg-white p-8 shadow-2xl transition dark:border-slate-800 dark:bg-slate-900">

        {/* HEADER */}
        <div className="flex flex-col items-center">

          {/* LOGO */}
          <div className="flex items-center justify-center">
            <img
              src="/logo.png"
              alt="LifeLink"
              className="h-28 w-28 object-contain"
            />
          </div>

          <h1 className="mt-6 text-3xl font-extrabold text-slate-900 dark:text-white">
            LifeLink
          </h1>

          <p className="mt-2 text-center text-sm text-slate-500 dark:text-slate-400">
            Connectez-vous au
            dashboard LifeLink
          </p>

        </div>

        {/* FORM */}
        <form
          onSubmit={
            handleLogin
          }
          className="mt-8 space-y-5"
        >

          {/* EMAIL */}
          <div>

            <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Email
            </label>

            <input
              type="email"
              placeholder="Votre email"
              value={email}
              onChange={(e) =>
                setEmail(
                  e.target.value
                )
              }
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-red-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-400"
              required
            />

          </div>

          {/* PASSWORD */}
          <div>

            <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Mot de passe
            </label>

            <input
              type="password"
              placeholder="Votre mot de passe"
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-red-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-400"
              required
            />

          </div>

          {/* ERROR */}
          {error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-900/40 dark:bg-red-950/20 dark:text-red-300">
              {error}
            </div>
          )}

          {/* BUTTON */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-2xl bg-red-600 py-3 font-bold text-white transition hover:bg-red-700 disabled:opacity-60"
          >
            {isLoading
              ? "Connexion..."
              : "Se connecter"}
          </button>

        </form>

      </div>

    </div>
  );
}