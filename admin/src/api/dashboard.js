import { baseUrl } from "./config.js";

export async function getDashboard() {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    throw new Error("Token tapılmadı.");
  }

  const response = await fetch(`${baseUrl}/admin/dashboard`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Accept-Language": "en",
    },
  });

  if (!response.ok) {
    throw new Error(`Dashboard yüklənmədi (HTTP ${response.status}).`);
  }

  const data = await response.json();

  return data;
}
