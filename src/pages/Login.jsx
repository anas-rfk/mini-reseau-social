import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "../features/auth/slice";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:3001";

function Login() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    setError("");

    axios
      .get(`${API_URL}/users`)
      .then((res) => setUsers(res.data))
      .catch((err) => {
        console.error("FETCH USERS ERROR:", err);
        setError("Impossible de charger les utilisateurs.");
      })
      .finally(() => setLoading(false));
  }, []);

  const handleLogin = () => {
    if (!selectedUser) {
      setError("Veuillez choisir un utilisateur.");
      return;
    }

    const user = users.find((u) => String(u.id) === String(selectedUser));

    if (!user) {
      setError("Utilisateur invalide.");
      return;
    }

    dispatch(setCurrentUser(user));
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-emerald-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-3xl border border-emerald-100 bg-white p-8 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">

        {/* Title */}
        <div className="text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-2xl">
            🌿
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900">
            Connexion
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Sélectionne ton compte puis connecte-toi.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            ❌ {error}
          </div>
        )}

        {/* Select */}
        <div className="mt-6">
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Utilisateur
          </label>

          <select
            value={selectedUser}
            onChange={(e) => {
              setSelectedUser(e.target.value);
              setError("");
            }}
            disabled={loading}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-800 shadow-sm outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 disabled:opacity-60"
          >
            <option value="">
              {loading ? "Chargement..." : "-- Choisir un utilisateur --"}
            </option>

            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.username}
              </option>
            ))}
          </select>
        </div>

        {/* Button */}
        <button
          onClick={handleLogin}
          disabled={!selectedUser}
          className="mt-6 w-full rounded-full bg-emerald-600 py-3 text-sm font-extrabold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-emerald-700 hover:shadow-md active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
        >
          🔐 Se connecter
        </button>

        

      </div>
    </div>
  );
}

export default Login;