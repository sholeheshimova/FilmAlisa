export const baseUrl = "https://api.sarkhanrahimli.dev/api/filmalisa";

export const getAuthHeaders = () => {
  const token = localStorage.getItem("accessToken");

  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};