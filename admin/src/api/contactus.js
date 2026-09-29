import { baseUrl } from "./config.js";

// API requests
async function requestContactApi(url, options = {}) {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
        throw new Error("Access token not found. Please log in again.");
    }

    const response = await fetch(url, {
        ...options,
        headers: {
            Authorization: `Bearer ${accessToken}`,
            ...(options.body ? { "Content-Type": "application/json" } : {}),
        },
    });

    if (!response.ok) {
        throw new Error(`Server error (Status: ${response.status}). Please verify the endpoint URL.`);
    }

    const result = await response.json().catch(() => null);
    if (result?.result === false) {
        throw new Error(result?.message || "Operation failed.");
    }
    return result;
}

// Fetch admin dashboard
export async function fetchContacts() {
    const result = await requestContactApi(`${baseUrl}/admin/contacts`);
    return Array.isArray(result?.data) ? result.data : [];
}

// Delete by ID
export async function deleteContact(id) {
    return requestContactApi(`${baseUrl}/admin/contacts/${id}`, {
        method: "DELETE",
    });
}
