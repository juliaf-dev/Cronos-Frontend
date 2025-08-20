import { API_BASE_URL } from "../config/config";

console.log("🌍 API_URL em uso:", API_BASE_URL);

// Função auxiliar para requisições com cookies
async function request(path, options = {}) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/auth${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // 🔑 envia/recebe cookies HttpOnly
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

// Registrar usuário
export async function register({ nome, email, senha }) {
  return request("/register", {
    method: "POST",
    body: JSON.stringify({ nome, email, senha }),
  });
}

// Login
export async function login({ email, senha }) {
  return request("/login", {
    method: "POST",
    body: JSON.stringify({ email, senha }),
  });
}

// Refresh (gera novo accessToken, backend já lida via cookie)
export async function refresh() {
  return request("/refresh", { method: "POST" });
}

// Logout (apaga cookie no backend)
export async function logout() {
  return request("/logout", { method: "POST" });
}

// Pegar dados do usuário logado
export async function me() {
  return request("/me");
}
