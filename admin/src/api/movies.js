import { baseUrl } from "./config.js";

export async function request(path, options = {}) {
  const token =
  localStorage.getItem("accessToken") ||
  localStorage.getItem("token") ||
  localStorage.getItem("adminToken");

  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  try {
    const response = await fetch(`${baseUrl}${path}`, { ...options, headers });
    if (!response.ok) throw new Error(`Server xətası: ${response.status}`);
    const text = await response.text();
    return text ? JSON.parse(text) : null;
  } catch (error) {
    console.error(`API Xətası (${path}):`, error);
    throw error;
  }
}

export const getMovies = () => request("/admin/movies");

export const deleteMovie = (id) =>
  request(`/admin/movie/${id}`, { method: "DELETE" });

export const createMovie = (payload) =>
  request("/admin/movie", { method: "POST", body: JSON.stringify(payload) });
