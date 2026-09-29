
import { login } from "../../api/auth(login,register).js";

const form = document.querySelector(".form-box");
const emailInput = document.querySelector("#email");
const passwordInput = document.querySelector("#password");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const payload = {
    email: emailInput.value,
    password: passwordInput.value,
  };

  try {
    const data = await login(payload);

    console.log(data);

    localStorage.setItem("accessToken", data.data.tokens.access_token);

    localStorage.setItem("userId", data.data.profile.id);

    window.location.href = "../home/home.html";
  } catch (error) {
    console.log(error);
  }
});
