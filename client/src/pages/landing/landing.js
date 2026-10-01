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

const userModal =
    document.querySelector("#user-modal");

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

            window.location.href =
                "./client/src/pages/login/login.html";
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