import { baseUrl } from "./config.js";

// login
export async function login(payload) {
    const response = await fetch(`${baseUrl}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload)
    });
    if (!response.ok) {
        alert("Login failed!");
        return;
    }

    const data = await response.json();
    return data;
}


// register

export async function register(payload) {
    const response = await fetch(`${baseUrl}/auth/signup`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        alert("Registration failed!");
        return;
    }

    const data = await response.json();
    return data;
}