import "../../helpers/authGuard.js";
import { getMovies } from "../../api/movies.js";

const carousel = document.querySelector(".carousel");
const carouselButtons = document.querySelector(".carousel-buttons");

const listContainer =
  document.getElementById("movie-list-container") ||
  document.querySelector(".main-container");

let currentSlide = 0;
let dots = [];

/* =========================
   SLIDER
========================= */

function showSlide(index) {
  if (!carousel || !dots.length) return;

  currentSlide = index;

  carousel.style.transform = `translateX(-${index * 100}%)`;

  carousel.querySelectorAll(".slide").forEach((slide, idx) => {
    slide.classList.toggle("is-active", idx === index);
  });

  dots.forEach((dot, idx) => {
    dot.classList.toggle("active", idx === index);
  });
}

function renderCarousel(movies) {
  if (!carousel || !carouselButtons) return;

  const featured = movies.slice(0, 3);

  carousel.innerHTML = featured
    .map((movie) => {
      const image =
        movie.cover_url ||
        "https://placehold.co/1200x700/111827/ffffff?text=Movie";

      const text = movie.overview
        ? movie.overview.slice(0, 140)
        : "Watch this exciting movie now.";

      return `
                <div
                    class="slide"
                    style="
                        background-image: url('${image}');
                        background-size: cover;
                        background-position: center center;
                    "
                >
                    <div class="text-overlay">
                        <span class="category">
                            ${movie.category?.name || "Movie"}
                        </span>

                        <h1>${movie.title}</h1>

                        <p>${text}</p>

                        <button
                            class="watch-btn"
                            data-movie-id="${movie.id}"
                        >
                            Watch Now
                        </button>
                    </div>
                </div>
            `;
    })
    .join("");

  carouselButtons.innerHTML = featured
    .map(
      (_, index) => `
                <button
                    class="dot ${index === 0 ? "active" : ""}"
                    data-index="${index}"
                    aria-label="Show slide ${index + 1}"
                ></button>
            `,
    )
    .join("");

  dots = Array.from(carouselButtons.querySelectorAll(".dot"));

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      showSlide(index);
    });
  });

  const watchButtons = document.querySelectorAll(".watch-btn");

  watchButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const movieId = button.dataset.movieId;

      if (movieId) {
        window.location.href = `../detail/detail.html?id=${movieId}`;
      }
    });
  });

  showSlide(0);

  window.clearInterval(window.homeCarouselInterval);

  window.homeCarouselInterval = setInterval(() => {
    if (dots.length) {
      showSlide((currentSlide + 1) % dots.length);
    }
  }, 5000);
}

/* =========================
   STARS
========================= */

function renderStars(score) {
  const numericScore = Number(score) || 0;

  const fullStars = Math.min(5, Math.max(0, Math.round(numericScore / 2)));

  return Array.from({ length: 5 }, (_, index) => {
    const className = index < fullStars ? "star filled" : "star";

    return `
                <span class="${className}">
                    ★
                </span>
            `;
  }).join("");
}

function getTrailerEmbedUrl(trailerUrl) {
  try {
    const url = new URL(trailerUrl);
    const host = url.hostname.replace(/^(www|m)\./, "");
    let videoId = "";

    if (host === "youtu.be") {
      videoId = url.pathname.split("/").filter(Boolean)[0] || "";
    } else if (host === "youtube.com" || host === "youtube-nocookie.com") {
      videoId =
        url.searchParams.get("v") ||
        url.pathname.match(/^\/(?:embed|shorts|live)\/([^/?]+)/)?.[1] ||
        "";
    }

    if (!videoId) return trailerUrl;

    const embedUrl = new URL(
      `https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}`,
    );
    embedUrl.searchParams.set("rel", "0");
    embedUrl.searchParams.set("playsinline", "1");
    embedUrl.searchParams.set("autoplay", "1");
    embedUrl.searchParams.set("mute", "1");
    return embedUrl.toString();
  } catch {
    return trailerUrl;
  }
}

/* =========================
   MOVIE CARD
========================= */

function buildMovieCard(movie) {
  const category = movie.category?.name || "Movie";

  const cover =
    movie.cover_url || "https://placehold.co/400x600/111827/ffffff?text=Movie";

  const imdb = movie.imdb || "0";

  return `
        <div
            class="movie-card"
            data-movie-id="${movie.id}"
          data-trailer-url="${movie.fragman ? encodeURIComponent(movie.fragman) : ""}"
            tabindex="0"
            role="button"
            aria-label="Open ${movie.title}"
        >
            <img
                src="${cover}"
                alt="${movie.title}"
                class="movie-image"
            />

            <div class="movie-details">

                <span class="movie-category">
                    ${category}
                </span>

                <div class="movie-rating">
                    ${renderStars(imdb)}
                </div>

                <p class="movie-title">
                    ${movie.title}
                </p>

            </div>
        </div>
    `;
}

/* =========================
   MOVIE SECTIONS
========================= */

function renderMovieSections(movies) {
  if (!listContainer) return;

  const groups = movies.reduce((acc, movie) => {
    const categoryName = movie.category?.name || "General";

    acc[categoryName] = acc[categoryName] || [];

    acc[categoryName].push(movie);

    return acc;
  }, {});

  listContainer.innerHTML = Object.entries(groups)
    .map(
      ([category, categoryMovies]) => `
                    <div class="category-section">

                        <div class="category-header">
                            <p class="category-P">
                                ${category}
                            </p>

                            <span class="chevron-icon" aria-hidden="true">
                              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9 5L16 12L9 19" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
                              </svg>
                            </span>
                        </div>

                        <div class="category-slider">
                            <button class="category-scroll-button category-scroll-button-left" type="button" data-scroll-direction="-1" aria-label="Scroll ${category} movies left" disabled>
                              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6" /></svg>
                            </button>
                            <div class="category-card">
                                ${categoryMovies.map(buildMovieCard).join("")}
                            </div>
                            <button class="category-scroll-button category-scroll-button-right" type="button" data-scroll-direction="1" aria-label="Scroll ${category} movies right" disabled>
                              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 18 6-6-6-6" /></svg>
                            </button>
                        </div>

                    </div>
                `,
    )
    .join("");

  addMovieCardEvents();
}

/* =========================
   DRAG + CLICK
========================= */

function addMovieCardEvents() {
  document.querySelectorAll(".category-card").forEach((container) => {
    const section = container.closest(".category-section");
    const scrollButtons = section?.querySelectorAll(".category-scroll-button") || [];

    const updateScrollButtons = () => {
      const maxScrollLeft = container.scrollWidth - container.clientWidth;
      scrollButtons.forEach((button) => {
        const direction = Number(button.dataset.scrollDirection);
        button.disabled =
          direction < 0
            ? container.scrollLeft <= 1
            : container.scrollLeft >= maxScrollLeft - 1;
      });
    };

    scrollButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const direction = Number(button.dataset.scrollDirection);
        container.scrollBy({
          left: direction * container.clientWidth * 0.8,
          behavior: "smooth",
        });
      });
    });

    container.addEventListener("scroll", updateScrollButtons, { passive: true });
    updateScrollButtons();

    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;
    let isDrag = false;

    container.addEventListener("mousedown", (event) => {
      isDown = true;
      isDrag = false;

      startX = event.pageX - container.offsetLeft;

      scrollLeft = container.scrollLeft;

      container.classList.add("active");
    });

    container.addEventListener("mousemove", (event) => {
      if (!isDown) return;

      const x = event.pageX - container.offsetLeft;

      const walk = (x - startX) * 2;

      if (Math.abs(walk) > 5) {
        isDrag = true;
      }

      if (isDrag) {
        event.preventDefault();

        container.scrollLeft = scrollLeft - walk;
      }
    });

    container.addEventListener("mouseup", () => {
      isDown = false;

      container.classList.remove("active");
    });

    container.addEventListener("mouseleave", () => {
      isDown = false;

      container.classList.remove("active");
    });
  });

  document.querySelectorAll(".movie-card").forEach((movieCard) => {
    const startTrailer = () => {
      const encodedTrailerUrl = movieCard.dataset.trailerUrl;
      if (!encodedTrailerUrl || movieCard.querySelector(".movie-trailer")) return;

      const trailerUrl = decodeURIComponent(encodedTrailerUrl);
      const iframe = document.createElement("iframe");
      iframe.className = "movie-trailer";
      iframe.src = getTrailerEmbedUrl(trailerUrl);
      iframe.title = "Movie trailer";
      iframe.allow = "autoplay; encrypted-media; picture-in-picture";
      iframe.allowFullscreen = true;
      movieCard.append(iframe);
      movieCard.classList.add("is-playing");
    };

    const stopTrailer = () => {
      movieCard.querySelector(".movie-trailer")?.remove();
      movieCard.classList.remove("is-playing");
    };

    movieCard.addEventListener("mouseenter", startTrailer);
    movieCard.addEventListener("mouseleave", stopTrailer);
    movieCard.addEventListener("focus", startTrailer);
    movieCard.addEventListener("blur", stopTrailer);

    movieCard.addEventListener("click", () => {
      const movieId = movieCard.dataset.movieId;

      if (movieId) {
        window.location.href = `../detail/detail.html?id=${movieId}`;
      }
    });

    movieCard.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();

        const movieId = movieCard.dataset.movieId;

        if (movieId) {
          window.location.href = `../detail/detail.html?id=${movieId}`;
        }
      }
    });
  });
}

/* =========================
   LOAD MOVIES
========================= */

async function loadHomeMovies() {
  try {
    const movies = await getMovies();

    console.log("HOME MOVIES:", movies);

    if (!movies || !movies.length) {
      return;
    }

    renderCarousel(movies);
    renderMovieSections(movies);
  } catch (error) {
    console.error("Failed to load movies:", error);
  }
}

loadHomeMovies();
