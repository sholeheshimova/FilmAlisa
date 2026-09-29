const logoutBtn = document.querySelector("#logout-btn");

if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
        e.preventDefault();

        localStorage.removeItem("accessToken");
        localStorage.removeItem("userId");

        window.location.href = "../../../index.html";
    });
}