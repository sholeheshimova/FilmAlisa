import { register } from "../../api/auth(login,register).js";


const form = document.querySelector(".form-box");
const fullnameInput = document.querySelector("#full_name");
const emailInput = document.querySelector("#email");
const passwordInput = document.querySelector("#password");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const payload = {
    full_name: fullnameInput.value,
    email: emailInput.value,
    password: passwordInput.value,
  };

  try {
    const data = await register(payload);

    console.log(data);

    window.location.href = "../login/login.html";
  } catch (error) {
    console.log(error);
  }
});