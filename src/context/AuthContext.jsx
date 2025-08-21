// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { me, refresh, logout, requestApi } from "../services/authServices";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Inicialização da auth
  useEffect(() => {
    const init = async () => {
      try {
        // Sempre confirma com o backend
        let data = await me();

        if (data.ok && data.data) {
          setUser(data.data);
          localStorage.setItem("user", JSON.stringify(data.data));
          localStorage.setItem("userId", data.data.id);
        } else {
          // Se não deu, tenta renovar sessão via refresh
          const r = await refresh();
          if (r.ok && r.data?.user) {
            setUser(r.data.user);
            localStorage.setItem("user", JSON.stringify(r.data.user));
            localStorage.setItem("userId", r.data.user.id);
          } else {
            setUser(null);
            localStorage.removeItem("user");
            localStorage.removeItem("userId");
          }
        }
      } catch (err) {
        console.error("❌ Erro ao checar auth:", err);
        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("userId");
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  // 🔹 Ping automático → conta minutos e acessos
  useEffect(() => {
    let interval;
    if (user) {
      const ping = async () => {
        try {
          const resp = await requestApi("/evolucao/ping", { method: "POST" });
          console.log("⏱️ Ping resposta:", resp);
        } catch (err) {
          console.error("❌ Erro no ping de evolução:", err);
        }
      };

      ping(); // dispara o primeiro imediatamente
      interval = setInterval(ping, 60000); // a cada 60s
    }
    return () => clearInterval(interval);
  }, [user]);

  const handleLogout = async () => {
    try {
      await logout(); // apaga cookie no backend
    } finally {
      setUser(null);
      localStorage.removeItem("user");
      localStorage.removeItem("userId");
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, handleLogout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
