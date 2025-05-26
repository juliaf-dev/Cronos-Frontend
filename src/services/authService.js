const API_URL = process.env.REACT_APP_BACKEND_URL;

export async function checkAuth() {
  const res = await fetch(`${API_URL}/api/auth/check`, {
    credentials: 'include'
  });
  return await res.json();
}
