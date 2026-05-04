import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/auth.store";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const result = await login(email, password);
      const roleId = result.role_id;

      if (roleId === 1) {
        navigate("/admin/dashboard");
        return;
      }

      if (roleId === 3) {
        navigate("/staff/dashboard");
        return;
      }

      if (roleId === 4) {
        navigate("/director/dashboard");
        return;
      }

      setError("Rôle non autorisé pour le backoffice");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
        return;
      }

      setError("Connexion impossible");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-[24px] bg-white shadow-xl border border-slate-200 p-8">
        <div className="flex flex-col items-center">
          <div className="h-20 w-20 rounded-full bg-red-600 flex items-center justify-center shadow-lg">
            <span className="text-white text-3xl">❤</span>
          </div>

          <h1 className="mt-5 text-2xl font-extrabold text-slate-900">
            LifeLink
          </h1>
          <p className="mt-2 text-sm text-slate-500 text-center">
            Connectez-vous au backoffice
          </p>
        </div>

        <form onSubmit={handleLogin} className="mt-8 space-y-5">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Email
            </label>
            <input
              type="email"
              placeholder="Votre email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-red-500"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Mot de passe
            </label>
            <input
              type="password"
              placeholder="Votre mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-red-500"
              required
            />
          </div>

          {error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-2xl bg-red-600 py-3 font-bold text-white transition hover:bg-red-700 disabled:opacity-60"
          >
            {isLoading ? "Connexion..." : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  );
}