// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { me, refresh, logout } from "../services/authServices";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Verifica se o usuário já está logado ao carregar o app
  useEffect(() => {
    const init = async () => {
      try {
        // 1️⃣ Checa se já tem sessão ativa
        const data = await me();

        if (data.ok && data.data) {
          setUser(data.data); // backend já retorna user
        } else {
          // 2️⃣ Se o token expirou, tenta renovar
          const r = await refresh();
          if (r.ok && r.data?.user) {
            setUser(r.data.user);
          }
        }
      } catch (err) {
        console.error("Erro ao checar auth:", err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const handleLogout = async () => {
    try {
      await logout(); // apaga cookie no backend
    } finally {
      setUser(null);
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
