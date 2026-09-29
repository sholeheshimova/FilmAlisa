import { baseUrl } from "./config.js";

export async function getProfile() {
  const token = localStorage.getItem("accessToken");

  const response = await fetch(`${baseUrl}/profile`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    alert("Failed to get profile");
    return;
  }

  const data = await response.json();

  return data.data;
}

export async function updateProfile(payload) {
  const token = localStorage.getItem("accessToken");

  const response = await fetch(`${baseUrl}/profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    alert("Failed to update profile");
    return;
  }

  const data = await response.json();

  return data.data;
}