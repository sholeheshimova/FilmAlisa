import { baseUrl } from "./config.js";

function getHeaders() {
    const headers = new Headers({
        "Content-Type": "application/json",
    });

    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
        headers.set("Authorization", `Bearer ${accessToken}`);
    }

    return headers;
}

async function request(endpoint, options = {}) {
    const { method = "GET", body } = options;

    const response = await fetch(`${baseUrl}${endpoint}`, {
        method,
        headers: getHeaders(),
        ...(body !== undefined && body !== null ? { body: JSON.stringify(body) } : {}),
    });

    const contentType = response.headers.get("content-type") || "";
    const data = contentType.includes("application/json")
        ? await response.json().catch(() => null)
        : await response.text();

    if (!response.ok) {
        throw new Error(data?.message || "Request failed");
    }

    return data;
}

export async function getMovieComments(movieId) {
    const response = await request(`/movies/${movieId}/comments`);
    return Array.isArray(response?.data) ? response.data : [];
}

export async function createMovieComment(movieId, comment) {
    const response = await request(`/movies/${movieId}/comment`, {
        method: "POST",
        body: { comment },
    });

    return response?.data || null;
}

export async function deleteMovieComment(movieId, commentId) {
    return request(`/movies/${movieId}/comment/${commentId}`, {
        method: "DELETE",
    });
}
