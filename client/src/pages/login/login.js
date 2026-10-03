import { login } from "../../api/auth(login,register).js";

const loginForm = document.querySelector("form");
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

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = emailInput.value.trim();
  const password = passwordInput.value;

  if (!email || !password) {
    return;
  }

  try {
    const data = await login(email, password);

    localStorage.setItem(
      "accessToken",
      data.data.tokens.access_token
    );

    localStorage.setItem(
      "userId",
      data.data.profile.id
    );

    localStorage.setItem(
      "user_profile",
      JSON.stringify(data.data.profile)
    );

    window.location.href = "../home/home.html";
  } catch (error) {
    console.error("Login error:", error);
    alert(error.message);
  }
});