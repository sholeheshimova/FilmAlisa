import { baseUrl } from "../../api/config.js";

/* =========================
   OPENING SCREEN
========================= */

const openingScreen =
    document.querySelector("#opening-screen");

let openingTimer;

function showOpeningScreen() {
    if (!openingScreen) return;

    window.clearTimeout(openingTimer);

    openingScreen.classList.remove(
        "is-leaving",
        "is-animating"
    );

    void openingScreen.offsetWidth;

    openingScreen.classList.add("is-animating");

    openingTimer = window.setTimeout(() => {
        openingScreen.classList.add("is-leaving");
    }, 2200);
}

showOpeningScreen();

window.addEventListener("pageshow", (event) => {
    if (event.persisted) {
        showOpeningScreen();
    }
});


/* =========================
   CONTACT FORM
========================= */

const contactForm =
    document.getElementById("contactForm");

const responseMessage =
    document.getElementById("responseMessage");

if (contactForm) {
    contactForm.addEventListener(
        "submit",
        async function (event) {
            event.preventDefault();

            const fullnameInput =
                contactForm.elements.fullname;

            const emailInput =
                contactForm.elements.email;

            const reasonInput =
                contactForm.elements.reason;

            const formData = {
                full_name:
                    fullnameInput.value.trim(),

                email:
                    emailInput.value.trim(),

                reason:
                    reasonInput.value.trim(),
            };

            if (
                !formData.full_name ||
                !formData.email ||
                !formData.reason
            ) {
                if (responseMessage) {
                    responseMessage.style.color =
                        "red";

                    responseMessage.innerText =
                        "Error: Please fill out all required fields.";
                }

                return;
            }

            try {
                const response = await fetch(
                    `${baseUrl}/contact`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json",
                        },

                        body: JSON.stringify(
                            formData
                        ),
                    }
                );

                const result =
                    await response
                        .json()
                        .catch(() => null);

                if (
                    response.ok &&
                    result?.result !== false
                ) {
                    if (responseMessage) {
                        responseMessage.style.color =
                            "green";

                        responseMessage.innerText =
                            "Your message has been sent successfully!";
                    }

                    contactForm.reset();
                } else {
                    throw new Error(
                        result?.message ||
                            "An error occurred while sending your message."
                    );
                }
            } catch (error) {
                console.error(
                    "Error:",
                    error.message
                );

                if (responseMessage) {
                    responseMessage.style.color =
                        "red";

                    responseMessage.innerText =
                        "Error: " +
                        error.message;
                }
            }
        }
    );
}


/* =========================
   USER MODAL
========================= */

const userDiv =
    document.querySelector(".user-div");

const userLogin =
    document.querySelector(".user-login");

const userImage =
    document.querySelector("#user-id-image");

const userName =
    document.querySelector("#user-id-name");

const signInButton =
    document.querySelector(".user-btn");

const signupEmailInput =
    document.querySelector("#emailInput");

const userModal =
    document.querySelector("#user-modal");

function updateAuthHeader() {
    const isAuthenticated = Boolean(
        localStorage.getItem("accessToken") &&
        localStorage.getItem("userId")
    );

    userLogin?.classList.toggle(
        "is-authenticated",
        isAuthenticated
    );

    if (userDiv) userDiv.hidden = !isAuthenticated;
    if (signInButton) signInButton.hidden = isAuthenticated;
    if (signupEmailInput) signupEmailInput.hidden = isAuthenticated;
    if (userModal) userModal.hidden = !isAuthenticated;

    if (!isAuthenticated) return;

    let profile = {};
    try {
        profile = JSON.parse(
            localStorage.getItem("user_profile") || "{}"
        ) || {};
    } catch {
        profile = {};
    }

    const displayName =
        profile.full_name || profile.name || "Profile";

    if (userName) {
        userName.textContent = displayName;
    }

    if (userImage) {
        if (profile.img_url) {
            userImage.src = profile.img_url;
        }
        userImage.alt = `${displayName} profile`;
    }
}

updateAuthHeader();

if (userDiv && userModal) {
    userDiv.addEventListener("click", () => {
        userModal.classList.toggle("show");
    });
}


/* =========================
   LOGOUT
========================= */

const logoutBtn =
    document.querySelector("#logout-btn");

if (logoutBtn) {
    logoutBtn.addEventListener(
        "click",
        () => {
            localStorage.removeItem(
                "accessToken"
            );

            localStorage.removeItem(
                "userId"
            );

            localStorage.removeItem(
                "user_profile"
            );

            window.location.href =
                "./index.html";
        }
    );
}


/* =========================
   SIGN IN ACCORDION
========================= */

window.toggleAccordion = function (header) {
    const content =
        header.nextElementSibling;

    const isOpen =
        content.classList.contains("open");

    if (isOpen) {
        content.classList.remove("open");

        header
            .querySelector("span")
            .classList.remove("rotate");
    } else {
        content.classList.add("open");

        header
            .querySelector("span")
            .classList.add("rotate");
    }
};