import { register } from "../../api/auth(login,register).js";

const form = document.querySelector(".form-box");
const fullnameInput = document.querySelector("#full_name");
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

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const payload = {
    full_name: fullnameInput.value.trim(),
    email: emailInput.value.trim(),
    password: passwordInput.value,
  };

  if (!payload.full_name || !payload.email || !payload.password) {
    return;
  }

  try {
    await register(payload);

    window.location.href = "../home/home.html";
  } catch (error) {
    console.error("Register error:", error);
    alert(error.message);
  }
});
