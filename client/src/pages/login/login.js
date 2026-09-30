
// import { login } from "../../api/auth(login,register).js";

// const form = document.querySelector(".form-box");
// const emailInput = document.querySelector("#email");
// const passwordInput = document.querySelector("#password");

// form.addEventListener("submit", async (e) => {
//   e.preventDefault();

//   const payload = {
//     email: emailInput.value,
//     password: passwordInput.value,
//   };

//   try {
//     const data = await login(payload);

//     console.log(data);

//     localStorage.setItem("accessToken", data.data.tokens.access_token);

//     localStorage.setItem("userId", data.data.profile.id);

//     window.location.href = "../home/home.html";
//   } catch (error) {
//     console.log(error);
//   }
// });
import { login } from "../../api/auth(login,register).js";

const loginForm = document.querySelector("form");
const emailInput = document.querySelector("#email");
const passwordInput = document.querySelector("#password");

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!email || !password) {
      return;
    }

    try {
      await login(email, password);
      window.location.href = "../home/home.html";
    } catch (error) {
    }
  });
}