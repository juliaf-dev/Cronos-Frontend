const API_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000"; // backend roda na 5000

// Função auxiliar para requisições
async function request(path, options = {}, includeAuth = false) {
  const headers = { "Content-Type": "application/json" };

  if (includeAuth) {
    const token = localStorage.getItem("accessToken");
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}/api/auth${path}`, {
    ...options,
    headers,
    credentials: "include", // mantém cookies (refresh token httpOnly)
  });

  return await res.json();
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
  const resp = await request("/login", {
    method: "POST",
    body: JSON.stringify({ email, senha }),
  });

  if (resp.ok && resp.data?.accessToken) {
    localStorage.setItem("accessToken", resp.data.accessToken);
  }

  return resp;
}

// Refresh do accessToken
export async function refresh() {
  const resp = await request("/refresh", { method: "POST" });

  if (resp.ok && resp.data?.accessToken) {
    localStorage.setItem("accessToken", resp.data.accessToken);
  }

  return resp;
}

// Logout
export async function logout() {
  localStorage.removeItem("accessToken");
  return request("/logout", { method: "POST" });
}

// Pegar dados do usuário logado
export async function me() {
  return request("/me", {}, true);
}
