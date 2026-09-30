const openingScreen = document.querySelector("#opening-screen");
let openingTimer;

function showOpeningScreen() {
    window.clearTimeout(openingTimer);
    openingScreen.classList.remove("is-leaving", "is-animating");
    void openingScreen.offsetWidth;
    openingScreen.classList.add("is-animating");
    openingTimer = window.setTimeout(() => {
        openingScreen.classList.add("is-leaving");
    }, 2200);
}

showOpeningScreen();

window.addEventListener("pageshow", (event) => {
    if (event.persisted) showOpeningScreen();
});

const userDiv = document.querySelector(".user-div");
const userModal = document.querySelector("#user-modal");

userDiv.addEventListener("click", () => {
    userModal.classList.toggle("show");
});

const logoutBtn = document.querySelector("#logout-btn");

logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userId");

    window.location.href = "./client/src/pages/login/login.html";
});

// sing in 
window.toggleAccordion = function (header) {
    const content = header.nextElementSibling;

    const isOpen = content.classList.contains("open");

    if (isOpen) {
        content.classList.remove("open");
        header.querySelector("span").classList.remove("rotate");
    } else {
        content.classList.add("open");
        header.querySelector("span").classList.add("rotate");
    }
};


