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
    const text = await response.text();

    let body = null;
    try {
      body = text ? JSON.parse(text) : null;
    } catch {
      body = text;
    }

    if (!response.ok) {
      const msg = body?.message || body?.error || text || "";
      throw new Error(
        `Server xətası ${response.status}: ${
          typeof msg === "string" ? msg : JSON.stringify(msg)
        }`,
      );
    }
    return body;
  } catch (error) {
    console.error(`API Xətası (${path}):`, error);
    throw error;
  }
}

export const getMovies = () => request("/admin/movies");

export const getMovie = (id) => request(`/admin/movies/${id}`);

export const createMovie = (payload) =>
  request("/admin/movie", { method: "POST", body: JSON.stringify(payload) });

export const updateMovie = (id, payload) =>
  request(`/admin/movie/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });

export const deleteMovie = (id) =>
  request(`/admin/movie/${id}`, { method: "DELETE" });

export const getCategories = () => request("/admin/categories");
