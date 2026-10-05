import "../../helpers/authGuard.js";

import {
  getFavoriteMovies,
  getMovies,
  getMovieById,
  toggleFavorite,
} from "../../api/movies.js";

import {
  createMovieComment,
  getMovieComments,
} from "../../api/comments(detail).js";

// ================================
// URL - MOVIE ID
// ================================

const movieId = new URLSearchParams(window.location.search).get("id") || "1";

console.log("DETAIL MOVIE ID:", movieId);

// ================================
// POPUP
// ================================

const favoritePopup = document.getElementById("popup");
const favoritePopupMessage = document.getElementById("pop-p");

let favoritePopupTimer;

function hideFavoritePopup() {
  favoritePopup?.classList.remove("show");
  window.clearTimeout(favoritePopupTimer);
}

function showFavoriteFeedback(isActive) {
  if (!favoritePopup || !favoritePopupMessage) return;

  favoritePopupMessage.textContent = isActive
    ? "Added to favorites successfully."
    : "Movie removed from favorites.";

  favoritePopup.classList.add("show");

  const favoriteButton = document.getElementById("favorite-btn");

  if (favoriteButton) {
    const buttonRect = favoriteButton.getBoundingClientRect();

    const popupWidth = favoritePopup.offsetWidth;

    const popupHeight = favoritePopup.offsetHeight;

    const left = Math.max(
      16,
      Math.min(
        buttonRect.left + (buttonRect.width - popupWidth) / 2,
        window.innerWidth - popupWidth - 16,
      ),
    );

    const belowButton = buttonRect.bottom + 12;

    const top =
      belowButton + popupHeight <= window.innerHeight - 16
        ? belowButton
        : Math.max(16, buttonRect.top - popupHeight - 12);

    favoritePopup.style.left = `${left}px`;
    favoritePopup.style.top = `${top}px`;
  }

  window.clearTimeout(favoritePopupTimer);

  favoritePopupTimer = window.setTimeout(hideFavoritePopup, 1000);
}

window.closePopup = function () {
  hideFavoritePopup();
};

// ================================
// TRAILER MODAL
// ================================

const filmPoster = document.querySelector(".film-image");

const filmModal = document.querySelector(".film-modal");

const filmOverlay = document.querySelector(".film-overlay");

const filmModalOverlay = document.querySelector(".film-modal-overlay");

const iframeFragman = document.querySelector(".iframe-fragman");

console.log("IFRAME ELEMENT:", iframeFragman);
console.log("INITIAL IFRAME SRC:", iframeFragman?.src);

function getTrailerEmbedUrl(trailerUrl, autoplay = false) {
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
    if (autoplay) embedUrl.searchParams.set("autoplay", "1");
    return embedUrl.toString();
  } catch {
    return trailerUrl;
  }
}



function openFilmModal() {
  if (!filmModal || !filmOverlay) return;

  filmModal.classList.add("active");
  filmOverlay.classList.add("active");

  document.body.classList.add("modal-open");
}

function closeFilmModal() {
  if (!filmModal || !filmOverlay) return;
  if (iframeFragman) {
    iframeFragman.src = ""; 
  }
  filmModal.classList.add("close-animation");
  filmOverlay.classList.remove("active");

  setTimeout(() => {
    filmModal.classList.remove("active");
    filmModal.classList.remove("close-animation");

    document.body.classList.remove("modal-open");
  }, 500);
}

if (filmPoster) {
  filmPoster.addEventListener("click", openFilmModal);
}

if (filmModalOverlay) {
  filmModalOverlay.addEventListener("click", closeFilmModal);
}

if (filmOverlay) {
  filmOverlay.addEventListener("click", closeFilmModal);
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeFilmModal();
    hideFavoritePopup();
  }
});

// ================================
// FAVORITE
// ================================

function setFavoriteButtonState(isActive) {
  const favoriteButton = document.getElementById("favorite-btn");

  if (!favoriteButton) return;

  favoriteButton.classList.toggle("active", isActive);

  favoriteButton.style.border = isActive
    ? "2px solid #00FF00"
    : "2px solid #fff";

  favoriteButton.innerHTML = isActive
    ? `
            <svg
                viewBox="8 8 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M10 16L14 20L22 12"
                    stroke="#00FF00"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                />
            </svg>
        `
    : `
            <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M7.2 7.2L7.2 0H8.8L8.8 7.2L16 7.2V8.8L8.8 8.8L8.8 16H7.2L7.2 8.8L0 8.8V7.2L7.2 7.2Z"
                    fill="white"
                />
            </svg>
        `;
}

// ================================
// DATE
// ================================

function formatDate(dateString) {
  if (!dateString) return "N/A";

  const date = new Date(dateString);

  const day = String(date.getDate()).padStart(2, "0");

  const month = String(date.getMonth() + 1).padStart(2, "0");

  const year = date.getFullYear();

  return `${day}.${month}.${year}`;
}

function formatDateTime(dateString) {
  if (!dateString) return "N/A";

  const date = new Date(dateString);

  const hours = String(date.getHours()).padStart(2, "0");

  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${hours}:${minutes}`;
}

// ================================
// COMMENTS
// ================================

function renderMovieComments(comments) {
  const commentsRoot = document.querySelector(".film-comments");

  if (!commentsRoot) return;

  if (!comments || !comments.length) {
    commentsRoot.innerHTML = `
            <div class="comment">
                <div class="user-info">
                    <div class="user">
                        <img
                            src="../../assests/images/user-image.png"
                            alt="User"
                        />
                        <span>
                            Be the first to comment
                        </span>
                    </div>
                </div>

                <p>
                    No comments yet for this movie.
                </p>
            </div>
        `;

    return;
  }

  commentsRoot.innerHTML = comments
    .map((comment) => {
      const date = comment.created_at
        ? new Date(comment.created_at).toLocaleString()
        : "Just now";

      return `
                <div class="comment">

                    <div class="user-info">

                        <div class="user">

                            <img
                                src="../../assests/images/user-image.png"
                                alt="User"
                            />

                            <span>
                                User
                            </span>

                        </div>

                        <p>
                            ${date}
                        </p>

                    </div>

                    <p>
                        ${comment.comment || ""}
                    </p>

                </div>
            `;
    })
    .join("");
}

async function submitComment(event) {
  event.preventDefault();

  const commentForm = document.querySelector("#comments form");

  const commentInput = commentForm?.querySelector("textarea");

  if (!commentInput) return;

  const comment = commentInput.value.trim();

  if (!comment) return;

  try {
    await createMovieComment(movieId, comment);

    commentInput.value = "";

    const comments = await getMovieComments(movieId);

    renderMovieComments(comments);
  } catch (error) {
    console.error("Comment creation failed:", error);
  }
}

// ================================
// MOVIE DETAILS
// ================================

function setupSimilarMoviesSlider() {
  const slider = document.querySelector(".movies-slider");
  const slides = slider?.querySelector(".movies-slides");
  const buttons = document.querySelectorAll(".similar-scroll-button");

  if (!slider || !slides || slider.dataset.controlsInitialized) return;
  slider.dataset.controlsInitialized = "true";

  const updateButtons = () => {
    const maxScrollLeft = slider.scrollWidth - slider.clientWidth;

    buttons.forEach((button) => {
      const direction = Number(button.dataset.scrollDirection);
      button.disabled =
        direction < 0
          ? slider.scrollLeft <= 1
          : slider.scrollLeft >= maxScrollLeft - 1;
    });
  };

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const direction = Number(button.dataset.scrollDirection);
      const firstCard = slides.querySelector(".movie");
      if (!firstCard) return;

      const gap = Number.parseFloat(getComputedStyle(slides).gap) || 0;
      slider.scrollBy({
        left: direction * (firstCard.getBoundingClientRect().width + gap),
        behavior: "smooth",
      });
    });
  });

  slider.addEventListener("scroll", updateButtons, { passive: true });
  window.addEventListener("resize", updateButtons);
  updateButtons();
}

async function renderSimilarMovies(currentMovie) {
  const slides = document.querySelector(".movies-slides");
  if (!slides) return;

  try {
    const movies = await getMovies();
    const otherMovies = movies.filter(
      (movie) => String(movie.id) !== String(currentMovie.id),
    );
    const categoryId = currentMovie.category?.id;
    const categoryName = currentMovie.category?.name?.trim().toLowerCase();
    const matchingMovies = otherMovies.filter((movie) => {
      if (categoryId != null && movie.category?.id != null) {
        return String(movie.category.id) === String(categoryId);
      }

      return (
        categoryName &&
        movie.category?.name?.trim().toLowerCase() === categoryName
      );
    });
    const similarMovies = (matchingMovies.length ? matchingMovies : otherMovies)
      .slice(0, 8);

    const cards = similarMovies.map((movie) => {
      const card = document.createElement("a");
      card.className = "movie";
      card.href = `./detail.html?id=${encodeURIComponent(movie.id)}`;
      card.setAttribute("aria-label", `Open ${movie.title || "movie"}`);

      const image = document.createElement("img");
      image.src =
        movie.cover_url ||
        "https://placehold.co/504x708/111827/ffffff?text=Movie";
      image.alt = movie.title || "Movie poster";

      const overlay = document.createElement("div");
      overlay.className = "movie-overlay";

      const details = document.createElement("div");
      details.className = "movie-desc";

      const category = document.createElement("span");
      category.className = "smilar-category";
      category.textContent = movie.category?.name || "Movie";

      const rating = document.createElement("div");
      rating.className = "stars";
      rating.textContent = `★ ${movie.imdb || "N/A"}`;

      const title = document.createElement("p");
      title.className = "smilar-movie-name";
      title.textContent = movie.title || "Untitled movie";

      details.append(category, rating, title);
      card.append(image, overlay, details);
      return card;
    });

    slides.replaceChildren(...cards);
    setupSimilarMoviesSlider();
  } catch (error) {
    console.warn("Similar movies could not be loaded:", error);
  }
}

async function renderMovieDetails(movieId) {
  try {
    const movie = await getMovieById(movieId);

    if (!movie) return;

    console.log("MOVIE DATA:", movie);
    console.log("TRAILER:", movie.fragman);

    // ----------------
    // BASIC INFO
    // ----------------

    const mainTitle = document.querySelector(".film-name h1");

    const subtitle = document.querySelector(".film-name p");

    const bgImage = document.querySelector(".film-bg");

    const posterImage = document.querySelector(".film-image img");

    const modalName = document.querySelector(".film-modal-name");

    const description = document.querySelector(".film-text");

    const rating = document.querySelector(".film-score span");

    const movieType = document.querySelector(".type p");

    const movieStatus = document.querySelector(".status p");

    const firstDate = document.querySelector(".first-date p");

    const addedTime = document.querySelector(".last-date p");

    const runtime = document.querySelector(".run-time p");

    const genres = document.querySelector(".genres p");

    const actorSlides = document.querySelector(
      ".film-actors .actors-slider .actor-slides",
    );

    // ----------------
    // MOVIE DATA
    // ----------------

    if (mainTitle) {
      mainTitle.textContent = movie.title || "";
    }

    if (modalName) {
      modalName.textContent = movie.title || "";
    }

    if (subtitle) {
      subtitle.textContent = movie.category?.name || "Movie";
    }

    if (bgImage) {
      bgImage.src = movie.cover_url || bgImage.src;
    }

    if (posterImage) {
      posterImage.src = movie.cover_url || posterImage.src;
    }

    if (description) {
      description.textContent = movie.overview || "Açıqlama tapılmadı.";
    }

    if (rating) {
      rating.textContent = movie.imdb || "N/A";
    }

    if (movieType) {
      movieType.textContent = movie.category?.name || "Movie";
    }

    if (movieStatus) {
      movieStatus.textContent = movie.adult
        ? "18+ (Adult Content)"
        : "Hər kəs üçün";
    }

    if (firstDate) {
      firstDate.textContent = formatDate(movie.created_at);
    }

    if (addedTime) {
      addedTime.textContent = formatDateTime(movie.created_at);
    }

    if (runtime) {
      runtime.textContent = movie.run_time_min
        ? `${movie.run_time_min} dəq`
        : "N/A";
    }

    if (genres) {
      genres.textContent = movie.category?.name || "Bilinmir";
    }

    renderSimilarMovies(movie);

    // ----------------
    // TRAILER
    // ----------------

if (iframeFragman) {
  iframeFragman.src = movie.fragman
    ? getTrailerEmbedUrl(movie.fragman)
    : "about:blank";
}

const filmModalStart = document.querySelector("#film-modal-start");

if (filmModalStart) {
  filmModalStart.disabled = !movie.fragman;
  filmModalStart.onclick = () => {
    if (!movie.fragman || !iframeFragman) return;
    iframeFragman.src = getTrailerEmbedUrl(movie.fragman, true);
    openFilmModal();
  };
}
    // ----------------
    // ACTORS
    // ----------------

    if (actorSlides && Array.isArray(movie.actors)) {
      actorSlides.innerHTML = movie.actors
        .map((actor) => {
          const actorName =
            `${actor.name || ""} ${actor.surname || ""}`.trim() || "Actor";

          return `
                            <div class="actor">

                                <img
                                    src="${
                                      actor.img_url ||
                                      "../../assests/images/detail/actor-defolt.jpg"
                                    }"
                                    alt="${actorName}"
                                />

                                <span class="actor-name">
                                    ${actorName}
                                </span>

                            </div>
                        `;
        })
        .join("");
    }

    // ----------------
    // WATCH LINK
    // ----------------

    const watchLink = document.querySelector(".film-text-header-left a");

    if (watchLink) {
      watchLink.addEventListener("click", (event) => {
        event.preventDefault();

        if (!movie.watch_url) {
          return;
        }

        if (movie.watch_url.startsWith("https://www.youtube.com/embed/")) {
          const embedId = movie.watch_url.split("embed/")[1].split("?")[0];

          sessionStorage.setItem("movie.name", movie.title || "");

          window.location.href = `details-2.html#${encodeURIComponent(
            embedId,
          )}`;
        } else {
          window.open(movie.watch_url, "_blank");
        }
      });
    }

    // ----------------
    // FAVORITE STATUS
    // ----------------

    const favoriteButton = document.getElementById("favorite-btn");

    if (favoriteButton) {
      favoriteButton.dataset.movieId = String(movie.id);

      favoriteButton.addEventListener("click", async () => {
        const wasFavorite = favoriteButton.classList.contains("active");

        try {
          await toggleFavorite(movie.id);

          const isActive = !wasFavorite;

          setFavoriteButtonState(isActive);

          showFavoriteFeedback(isActive);
        } catch (error) {
          console.error("Favorite toggle failed:", error);
        }
      });
    }

    // ----------------
    // CHECK FAVORITE
    // ----------------

    try {
      const favorites = await getFavoriteMovies();

      const favoriteMovieIds = favorites.map((favorite) => Number(favorite.id));

      setFavoriteButtonState(favoriteMovieIds.includes(Number(movie.id)));
    } catch (error) {
      console.warn("Unable to load favorites:", error);
    }

    // ----------------
    // COMMENTS
    // ----------------

    try {
      const comments = await getMovieComments(movieId);

      renderMovieComments(comments);
    } catch (error) {
      console.warn("Comments could not be loaded:", error);
    }
  } catch (error) {
    console.error("Film detalları yüklənərkən xəta baş verdi:", error);
  }
}

// ================================
// COMMENT FORM
// ================================

const commentForm = document.querySelector("#comments form");

if (commentForm) {
  commentForm.addEventListener("submit", submitComment);
}

// ================================
// START
// ================================

renderMovieDetails(movieId);

