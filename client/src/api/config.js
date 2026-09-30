export const baseUrl = "https://api.sarkhanrahimli.dev/api/filmalisa";

export const getAuthHeaders = () => {
    const token = sessionStorage.getItem("user_token");
    return {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
    };
};
