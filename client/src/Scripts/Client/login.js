
// Btn and input elements
const loginBtn = document.querySelector("#loginBtn");
const emailIn = document.querySelector("#email");
const passwordIn = document.querySelector("#password");

// System "login"(test)
const CORRECT_EMAIL = "admin@admin.com";
const CORRECT_PASSWORD = "1234";

if (loginBtn) {
    loginBtn.addEventListener("click", (event) => {
        event.preventDefault(); // (no-refresh)

        let email = emailIn.value.trim();
        let password = passwordIn.value.trim();

        // 1. Cheking empty or not
        if (!email || !password) {
            alert("Zəhmət olmasa bütün xanaları doldurun!");
            return;
        }
        // 2. cheking Email/Pass 
        if (email === CORRECT_EMAIL && password === CORRECT_PASSWORD) {
            // if success, go --> home.html
            window.location.replace("../../Pages/Client/home.html");
        } else {
            // if error, show alert
            alert("Daxil etdiyiniz email və ya parol yanlışdır!");
        }
    });
}

