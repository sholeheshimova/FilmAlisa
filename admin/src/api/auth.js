import { baseUrl } from "./config.js";


export async function login(payload) {
    const response = await fetch(`${baseUrl}/auth/admin/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    });

    if (!response.ok) {
        alert("Login failed")
    }


    const data = await response.json();
    return data;
}
