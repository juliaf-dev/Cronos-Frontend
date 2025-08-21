const isDev = !process.env.NODE_ENV || process.env.NODE_ENV === "development";

export const API_BASE_URL =
  process.env.REACT_APP_BACKEND_URL ||
  (isDev
    ? "http://localhost:5000"
    : "https://cronos-backend-3.onrender.com");
