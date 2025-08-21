// src/services/authServices.js
import { API_BASE_URL } from "../config/config.js";

console.log("🌍 API_URL em uso:", API_BASE_URL);

// =======================
// 🔹 Função auxiliar base
// =======================
async function baseRequest(url, options = {}) {
  try {
    const res = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      credentials: "include", // 🔑 mantém cookies HttpOnly (refresh_token)
    });

    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { ok: false, message: text || "Resposta inválida do servidor" };
    }

    return { status: res.status, ...data };
  } catch (err) {
    console.error("❌ Erro de rede em request:", err);
    return { ok: false, message: err.message || "Erro de conexão" };
  }
}

// =======================
// 🔹 Wrappers de request
// =======================

// Para rotas de autenticação (/api/auth)
async function requestAuth(path, options = {}) {
  return baseRequest(`/api/auth${path}`, options);
}

// Para rotas protegidas gerais (/api/...)
export async function requestApi(path, options = {}) {
  const token = localStorage.getItem("accessToken");
  return baseRequest(`/api${path}`, {
    ...options,
    headers: {
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}), // 🔑 JWT no header
    },
  });
}

// =======================
// 🔹 Métodos públicos
// =======================

// Registrar usuário
export async function register({ nome, email, senha }) {
  return requestAuth("/register", {
    method: "POST",
    body: JSON.stringify({ nome, email, senha }),
  });
}

// Login → retorna accessToken + seta refresh_token (cookie HttpOnly)
export async function login({ email, senha }) {
  const resp = await requestAuth("/login", {
    method: "POST",
    body: JSON.stringify({ email, senha }),
  });

  console.log("🔑 Resposta do login:", resp);

  if (resp.ok && resp.data?.accessToken) {
    localStorage.setItem("accessToken", resp.data.accessToken);
    localStorage.setItem("userId", resp.data.user?.id);
  }

  return resp;
}


// Refresh do accessToken (via cookie refresh_token)
export async function refresh() {
  const resp = await requestAuth("/refresh-cookie", { method: "POST" }); // 🔧 corrigido para /refresh-cookie

  if (resp.ok && resp.data?.accessToken) {
    localStorage.setItem("accessToken", resp.data.accessToken);
  }

  return resp;
}

// Logout (remove refresh_token no backend e limpa localStorage)
export async function logout() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("userId");
  return requestAuth("/logout", { method: "POST" });
}

// Pegar dados do usuário logado
export async function me() {
  return requestApi("/auth/me", { method: "GET" });
}
