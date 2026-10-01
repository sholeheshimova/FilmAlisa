import { baseUrl } from "./config.js";

// Login
export const login = async (email, password) => {
  const response = await fetch(`${baseUrl}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  const result = await response.json();

  if (!response.ok || !result.result) {
    throw new Error(result.message || "Login failed");
  }

  return result;
};

// Register
export const register = async (payload) => {
  const response = await fetch(`${baseUrl}/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const result = await response.json();

  if (!response.ok || !result.result) {
    throw new Error(result.message || "Registration failed");
  }

  return result;
};