import "../../helpers/authGuard.js";
import { getMovies } from "../../api/movies.js";

const carousel = document.querySelector(".carousel");
const carouselButtons = document.querySelector(".carousel-buttons");
const listContainer = document.getElementById("movie-list-container") || document.querySelector(".main-container");
let currentSlide = 0;
let dots = [];

function showSlide(index) {
    if (!carousel || !dots.length) return;

    currentSlide = index;
    carousel.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((dot, idx) => {
        dot.classList.toggle("active", idx === index);
    });
}

function renderStars(score) {
    const numericScore = Number(score) || 0;
    const fullStars = Math.min(5, Math.max(0, Math.round(numericScore / 2)));

    return Array.from({ length: 5 }, (_, index) => {
        const className = index < fullStars ? "star filled" : "star";
        return `<span class="${className}">★</span>`;
    }).join("");
}

function buildMovieCard(movie) {
    const category = movie.category?.name || "Movie";
    const cover = movie.cover_url || "https://placehold.co/400x600/111827/ffffff?text=Movie";
    const imdb = movie.imdb || "0";

    return `
        <div class="movie-card" data-movie-id="${movie.id}" tabindex="0" role="button" aria-label="Open ${movie.title}">
            <img src="${cover}" alt="${movie.title}" class="movie-image" />
            <div class="movie-details">
                <span class="movie-category">${category}</span>
                <div class="movie-rating">${renderStars(imdb)}</div>
                <p class="movie-title">${movie.title}</p>
            </div>
        </div>
    `;
}

function renderCarousel(movies) {
    if (!carousel || !carouselButtons) return;

    const featured = movies.slice(0, 3);

    carousel.innerHTML = featured
        .map((movie) => {
            const image = movie.cover_url || "https://placehold.co/1200x700/111827/ffffff?text=Movie";
            const text = movie.overview ? movie.overview.slice(0, 140) : "Watch this exciting movie now.";

            return `
                <div class="slide" style="background-image: url('${image}'); background-size: cover; background-position: center center;">
                    <div class="text-overlay">
                        <span class="category">${movie.category?.name || "Movie"}</span>
                        <h1>${movie.title}</h1>
                        <p>${text}</p>
                        <button class="watch-btn" data-movie-id="${movie.id}">Watch Now</button>
                    </div>
                </div>
            `;
        })
        .join("");

    carouselButtons.innerHTML = featured
        .map((_, index) => `<button class="dot ${index === 0 ? "active" : ""}" data-index="${index}" aria-label="Show slide ${index + 1}"></button>`)
        .join("");

    dots = Array.from(document.querySelectorAll(".dot"));
    dots.forEach((dot, index) => {
        dot.addEventListener("click", () => showSlide(index));
    });

    const watchButtons = document.querySelectorAll(".watch-btn");
    watchButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const movieId = button.dataset.movieId;
            if (movieId) window.location.href = `../detail/detail.html?id=${movieId}`;
        });
    });

    showSlide(0);
    window.clearInterval(window.homeCarouselInterval);
    window.homeCarouselInterval = setInterval(() => {
        showSlide((currentSlide + 1) % dots.length);
    }, 5000);
}

function renderMovieSections(movies) {
    const sections = listContainer;
    if (!sections) return;

    const groups = movies.reduce((acc, movie) => {
        const categoryName = movie.category?.name || "General";
        acc[categoryName] = acc[categoryName] || [];
        acc[categoryName].push(movie);
        return acc;
    }, {});

    sections.innerHTML = Object.entries(groups)
        .map(([category, categoryMovies]) => {
            return `
                <div class="category-section">
                    <div class="category-header">
                        <p class="category-P">${category}</p>
                        <div class="chevron-icon"></div>
                    </div>
                    <div class="category-card">
                        ${categoryMovies.map(buildMovieCard).join("")}
                    </div>
                </div>
            `;
        })
        .join("");

    document.querySelectorAll(".movie-card").forEach((movieCard) => {
        movieCard.addEventListener("click", (event) => {
            if (event.target.closest("button")) return;
            const movieId = movieCard.dataset.movieId;
            if (movieId) window.location.href = `../detail/detail.html?id=${movieId}`;
        });

        movieCard.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                const movieId = movieCard.dataset.movieId;
                if (movieId) window.location.href = `../detail/detail.html?id=${movieId}`;
            }
        });
    });
}

function emptyHomePartition() {
    document.querySelectorAll(".category-section, .loading-state").forEach((node) => node.remove());
    if (listContainer) {
        listContainer.innerHTML = "";
    }
}

async function loadHomeMovies() {
    emptyHomePartition();

    try {
        const movies = await getMovies();
        if (!movies.length) return;

        renderCarousel(movies);
        renderMovieSections(movies);
    } catch (error) {
        console.error("Failed to load movies:", error);
    }
}

loadHomeMovies();

