import { login } from "../../api/auth.js";

const form = document.querySelector(".form-box");
const emailInput = document.querySelector("#email");
const passwordInput = document.querySelector("#password");

const passwordEye = document.querySelector("#password-eye");

passwordEye.addEventListener("click", () => {
  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    passwordEye.classList.add("active");
  } else {
    passwordInput.type = "password";
    passwordEye.classList.remove("active");
  }
});

form.addEventListener("submit", async function (e) {
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

    window.location.href = "./src/pages/dashboard/dashboard.html";
  } catch (error) {
    console.log(error);

    alert("Email or password is wrong");
  }
});
