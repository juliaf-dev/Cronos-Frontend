import { createContext, useContext, useEffect, useState } from "react";
import { me, refresh, logout } from "../services/authServices";
import { API_BASE_URL } from "../config/config";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Inicialização da auth
  useEffect(() => {
    const init = async () => {
      try {
        // 1️⃣ Primeiro tenta carregar do localStorage (fallback rápido)
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }

        // 2️⃣ Depois confirma com o backend
        const data = await me();

        if (data.ok && data.data) {
          setUser(data.data);
          localStorage.setItem("user", JSON.stringify(data.data));
        } else {
          // 3️⃣ Se o token expirou, tenta renovar
          const r = await refresh();
          if (r.ok && r.data?.user) {
            setUser(r.data.user);
            localStorage.setItem("user", JSON.stringify(r.data.user));
          } else {
            // limpa se não conseguiu validar
            localStorage.removeItem("user");
          }
        }
      } catch (err) {
        console.error("Erro ao checar auth:", err);
        localStorage.removeItem("user");
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  // Sempre que o user mudar, atualiza localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  // 🔹 Ping automático → conta minutos e acessos
  useEffect(() => {
    let interval;
    if (user) {
      interval = setInterval(async () => {
        try {
          await fetch(`${API_BASE_URL}/evolucao/ping`, {
            method: "POST",
            credentials: "include", // importante para cookies JWT
            headers: {
              "Content-Type": "application/json",
            },
          });
        } catch (err) {
          console.error("Erro no ping de evolução:", err);
        }
      }, 60000); // 🔹 a cada 60 segundos
    }
    return () => clearInterval(interval);
  }, [user]);

  const handleLogout = async () => {
    try {
      await logout(); // apaga cookie no backend
    } finally {
      setUser(null);
      localStorage.removeItem("user");
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
