import { createContext, useContext, useEffect, useState } from "react";
import { loginUser, logoutUser, registerUser } from "../api/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Ao carregar o app, verifica se já existe uma sessão salva localmente.
  useEffect(() => {
    const storedUser = localStorage.getItem("mytask_user");
    const storedToken = localStorage.getItem("mytask_token");
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  async function login(credentials) {
    const { token, user: loggedUser } = await loginUser(credentials);
    localStorage.setItem("mytask_token", token);
    localStorage.setItem("mytask_user", JSON.stringify(loggedUser));
    setUser(loggedUser);
    return loggedUser;
  }

  async function register(payload) {
    return registerUser(payload);
  }

  async function logout() {
    try {
      await logoutUser();
    } catch {
      // Mesmo que o servidor não responda, a sessão local é encerrada.
    } finally {
      localStorage.removeItem("mytask_token");
      localStorage.removeItem("mytask_user");
      setUser(null);
    }
  }

  const value = { user, loading, login, register, logout, isAuthenticated: !!user };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  return ctx;
}
