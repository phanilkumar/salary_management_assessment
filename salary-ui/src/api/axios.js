import axios from "axios";

// In development: Vite proxy forwards /api → localhost:3000
// In production: VITE_API_BASE_URL points to the deployed Render.com API
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api/v1",
  headers: { "Content-Type": "application/json" },
});

export default api;
