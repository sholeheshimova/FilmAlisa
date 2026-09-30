// import { baseUrl } from "./config.js";

// // login
// export async function login(payload) {
//     const response = await fetch(`${baseUrl}/auth/login`, {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//         },
//         body: JSON.stringify(payload)
//     });
//     if (!response.ok) {
//         alert("Login failed!");
//         return;
//     }

//     const data = await response.json();
//     return data;
// }


// // register

// export async function register(payload) {
//     const response = await fetch(`${baseUrl}/auth/signup`, {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//         },
//         body: JSON.stringify(payload)
//     });

//     if (!response.ok) {
//         alert("Registration failed!");
//         return;
//     }

//     const data = await response.json();
//     return data;
// }
import { baseUrl } from "./config.js";

// Login 
export const login = async (email, password) => {
    try {
        const response = await fetch(`${baseUrl}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        const result = await response.json();

        if (!response.ok || !result.result) {
            throw new Error(result.message || "Giriş uğursuz oldu.");
        }

        // Backend access_token
        if (result.data?.tokens?.access_token) {
            sessionStorage.setItem("user_token", result.data.tokens.access_token);
        }

        // Profil
        if (result.data?.profile) {
            localStorage.setItem("user_profile", JSON.stringify(result.data.profile));
        }

        return result;
    } catch (error) {
        console.error("Login API Xətası:", error.message);
        throw error;
    }
};

// Register (Signup) 
export const registerUser = async (full_name, email, password) => {
    try {
        const response = await fetch(`${baseUrl}/auth/signup`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ full_name, email, password }),
        });

        const result = await response.json();

        if (!response.ok || !result.result) {
            throw new Error(result.message || "Qeydiyyat uğursuz oldu.");
        }

        return result;
    } catch (error) {
        console.error("Signup API Xətası:", error.message);
        throw error;
    }
};