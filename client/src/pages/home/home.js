const carousel = document.querySelector(".carousel");
const dots = document.querySelectorAll(".dot");
let currentSlide = 0;

function showSlide(index) {
    currentSlide = index;
    carousel.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((dot, idx) => {
        dot.classList.toggle("active", idx === index);
    });
}

dots.forEach((dot, index) => {
    dot.addEventListener("click", () => showSlide(index));
});

const movieCards = document.querySelectorAll(".movie-card");
let isDrag = false;

movieCards.forEach((movieCard) => {
    movieCard.addEventListener("pointerdown", () => {
        isDrag = false;
    });

    movieCard.addEventListener("pointermove", () => {
        isDrag = true;
    });

    movieCard.addEventListener("pointerup", () => {
        setTimeout(() => {
            isDrag = false;
        }, 0);
    });

    movieCard.addEventListener("click", (e) => {
        if (!isDrag) {
            window.location.href = "../detail/detail.html";
        }
    });
});

showSlide(0);

setInterval(() => {
    showSlide((currentSlide + 1) % dots.length);
}, 5000);

