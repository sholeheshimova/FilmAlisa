import { baseUrl } from "./config.js";

const categoryUrl = `${baseUrl}/admin/category`;

async function requestCategoryApi(url, options = {}) {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
        throw new Error("Access token is missing. Log in again on this same site.");
    }

    const response = await fetch(url, {
        ...options,
        headers: {
            Authorization: `Bearer ${accessToken}`,
            ...(options.body ? { "Content-Type": "application/json" } : {}),
        },
    });

    let result = null;
    try {
        result = await response.json();
    } catch {
        // !!!
    }

    if (!response.ok || result?.result === false) {
        throw new Error(result?.message || `Category request failed (${response.status})`);
    }

    return result?.data ?? result;
}

export async function fetchCategories() {
    const data = await requestCategoryApi(`${baseUrl}/admin/categories`);
    return data;
}

export async function createCategory(name) {
    return requestCategoryApi(categoryUrl, {
        method: "POST",
        body: JSON.stringify({ name }),
    });
}

export async function updateCategory(id, name) {
    return requestCategoryApi(`${categoryUrl}/${id}`, {
        method: "PUT",
        body: JSON.stringify({ name }),
    });
}

export async function deleteCategory(id) {
    return requestCategoryApi(`${categoryUrl}/${id}`, {
        method: "DELETE",
    });
}


