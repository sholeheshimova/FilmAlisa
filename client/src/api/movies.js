import { baseUrl, getAuthHeaders } from "./config.js";

// 1. Filmlər siyahısını gətirir
export const fetchMovies = async () => {
    try {
        const res = await fetch(`${baseUrl}/movies`, {
            headers: getAuthHeaders(),
        });
        if (!res.ok) throw new Error(`API Hatası: ${res.status}`);
        return await res.json();
    } catch (error) {
        console.error("fetchMovies Error:", error);
        throw error;
    }
};

// 2. Kateqoriyaları və filmləri gətirir
export const fetchCategories = async () => {
    try {
        const res = await fetch(`${baseUrl}/categories`, {
            headers: getAuthHeaders(),
        });
        if (!res.ok) throw new Error(`API Hatası: ${res.status}`);
        return await res.json();
    } catch (error) {
        console.error("fetchCategories Error:", error);
        throw error;
    }
};

// 3. ID-yə görə tək filmi gətirir
export const fetchMovieById = async (movieId) => {
    try {
        const res = await fetch(`${baseUrl}/movies/${movieId}`, {
            headers: getAuthHeaders(),
        });
        if (!res.ok) throw new Error(`API Hatası: ${res.status}`);
        return await res.json();
    } catch (error) {
        console.error("fetchMovieById Error:", error);
        throw error;
    }
};

// 4. Filmin şərhlərini gətirir
export const fetchMovieComments = async (movieId) => {
    try {
        const res = await fetch(`${baseUrl}/movies/${movieId}/comments`, {
            headers: getAuthHeaders(),
        });
        if (!res.ok) throw new Error(`API Hatası: ${res.status}`);
        return await res.json();
    } catch (error) {
        console.error("fetchMovieComments Error:", error);
        throw error;
    }
};

// 5. Şərh yazır
export const postMovieComment = async (movieId, commentText) => {
    try {
        const res = await fetch(`${baseUrl}/movies/${movieId}/comment`, {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify({ comment: commentText }),
        });
        return res;
    } catch (error) {
        console.error("postMovieComment Error:", error);
        throw error;
    }
};

// 6. Şərh silir
export const deleteMovieComment = async (movieId, commentId) => {
    try {
        const res = await fetch(`${baseUrl}/movies/${movieId}/comment/${commentId}`, {
            method: "DELETE",
            headers: getAuthHeaders(),
        });
        return res;
    } catch (error) {
        console.error("deleteMovieComment Error:", error);
        throw error;
    }
};

// 7. Sevimli statusunu dəyişir
export const toggleMovieFavorite = async (movieId) => {
    try {
        const res = await fetch(`${baseUrl}/movie/${movieId}/favorite`, {
            method: "POST",
            headers: getAuthHeaders(),
        });
        return res;
    } catch (error) {
        console.error("toggleMovieFavorite Error:", error);
        throw error;
    }
};

// 8. İstifadəçi profilini gətirir
export const fetchUserProfileData = async () => {
    try {
        const res = await fetch(`${baseUrl}/profile`, {
            headers: getAuthHeaders(),
        });
        if (!res.ok) throw new Error(`API Hatası: ${res.status}`);
        return await res.json();
    } catch (error) {
        console.error("fetchUserProfileData Error:", error);
        throw error;
    }
};