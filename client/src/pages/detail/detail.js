import "../../helpers/authGuard.js";
import {
    getFavoriteMovies,
    getMovieById,
    toggleFavorite,
} from "../../api/movies.js";
import {
    createMovieComment,
    getMovieComments,
} from "../../api/comments(detail).js";

// MODAL event
const filmPoster = document.querySelector(".film-image");
const filmModal = document.querySelector(".film-modal");
const filmOverlay = document.querySelector(".film-overlay");
const filmModalOverlay = document.querySelector(".film-modal-overlay");
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
                window.innerWidth - popupWidth - 16
            )
        );
        const belowButton = buttonRect.bottom + 12;
        const top = belowButton + popupHeight <= window.innerHeight - 16
            ? belowButton
            : Math.max(16, buttonRect.top - popupHeight - 12);

        favoritePopup.style.left = `${left}px`;
        favoritePopup.style.top = `${top}px`;
    }

    window.clearTimeout(favoritePopupTimer);
    favoritePopupTimer = window.setTimeout(hideFavoritePopup, 2200);
}

function openFilmModal() {
    if (!filmModal || !filmOverlay) return;

    filmModal.classList.add("active");
    filmOverlay.classList.add("active");
    document.body.classList.add("modal-open");
}

function closeFilmModal() {
    if (!filmModal || !filmOverlay || !filmModal.classList.contains("active")) return;

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

function setFavoriteButtonState(isActive) {
    const favoriteButton = document.getElementById("favorite-btn");
    if (!favoriteButton) return;

    favoriteButton.classList.toggle("active", isActive);
    favoriteButton.style.border = isActive ? "2px solid #00FF00" : "2px solid #fff";
    favoriteButton.innerHTML = isActive
        ? `
            <svg viewBox="8 8 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 16L14 20L22 12" stroke="#00FF00" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>`
        : `
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M7.2 7.2L7.2 0H8.8L8.8 7.2L16 7.2V8.8L8.8 8.8L8.8 16H7.2L7.2 8.8L0 8.8V7.2L7.2 7.2Z" fill="white" />
            </svg>`;
}

function renderStars(score) {
    const numericScore = Number(score) || 0;
    const fullStars = Math.min(5, Math.max(0, Math.round(numericScore / 2)));

    return Array.from({ length: 5 }, (_, index) => {
        return `<span class="${index < fullStars ? "star filled" : "star"}">★</span>`;
    }).join("");
}

function clearMovieComments() {
    const commentsRoot = document.querySelector(".film-comments");
    if (!commentsRoot) return;
    commentsRoot.innerHTML = "";
}

function renderMovieComments(comments) {
    const commentsRoot = document.querySelector(".film-comments");
    if (!commentsRoot) return;

    if (!comments.length) {
        commentsRoot.innerHTML = `
            <div class="comment">
                <div class="user-info">
                    <div class="user">
                        <img src="../../assests/images/user-image.png" alt="User" />
                        <span>Be the first to comment</span>
                    </div>
                </div>
                <p>No comments yet for this movie.</p>
            </div>
        `;
        return;
    }

    commentsRoot.innerHTML = comments
        .map((comment) => {
            const date = comment.created_at ? new Date(comment.created_at).toLocaleString() : "Just now";
            return `
                <div class="comment">
                    <div class="user-info">
                        <div class="user">
                            <img src="../../assests/images/user-image.png" alt="User" />
                            <span>User</span>
                        </div>
                        <p>${date}</p>
                    </div>
                    <p>${comment.comment}</p>
                </div>
            `;
        })
        .join("");
}

async function renderMovieDetails(movieId) {
    try {
        const movie = await getMovieById(movieId);
        if (!movie) return;

        const mainTitle = document.querySelector(".film-name h1");
        const subtitle = document.querySelector(".film-name p");
        const bgImage = document.querySelector(".film-bg");
        const posterImage = document.querySelector(".film-image img");
        const watchLink = document.querySelector(".film-text-header-left a");
        const description = document.querySelector(".film-text");
        const rating = document.querySelector(".film-score span");
        const movieType = document.querySelector(".type p");
        const movieStatus = document.querySelector(".status p");
        const episodeCount = document.querySelector(".episodes p");
        const firstDate = document.querySelector(".first-date p");
        const addedTime = document.querySelector(".last-date p");
        const runtime = document.querySelector(".run-time p");
        const genres = document.querySelector(".genres p");
        const actorSlides = document.querySelector(".actor-slides");

        if (mainTitle) mainTitle.textContent = movie.title;
        if (subtitle) subtitle.textContent = `${movie.category?.name || "Movie"} / ${movie.title}`;
        if (bgImage) bgImage.src = movie.cover_url || bgImage.src;
        if (posterImage) posterImage.src = movie.cover_url || posterImage.src;
        if (watchLink) watchLink.href = movie.watch_url || "#";
        if (watchLink) watchLink.textContent = "Watch Link";
        if (description) description.textContent = movie.overview || "No overview available.";
        if (rating) rating.textContent = movie.imdb || "N/A";
        if (movieType) movieType.textContent = movie.category?.name || "Movie";
        if (movieStatus) movieStatus.textContent = movie.adult ? "Adult" : "General";
        if (episodeCount) episodeCount.textContent = movie.run_time_min ? `${movie.run_time_min} min` : "1";
        if (firstDate) firstDate.textContent = movie.created_at ? movie.created_at.split("T")[0] : "N/A";
        if (addedTime) addedTime.textContent = movie.created_at ? new Date(movie.created_at).toLocaleTimeString() : "N/A";
        if (runtime) runtime.textContent = movie.run_time_min ? `${movie.run_time_min} min` : "N/A";
        if (genres) genres.textContent = movie.category?.name || "Movie";

        if (actorSlides && Array.isArray(movie.actors) && movie.actors.length) {
            actorSlides.innerHTML = movie.actors
                .map((actor) => {
                    const actorName = `${actor.name || ""} ${actor.surname || ""}`.trim() || "Actor";
                    return `
                        <div class="actor">
                            <img src="${actor.img_url || "../../assests/images/detail/actor-defolt.jpg"}" alt="${actorName}" />
                            <span class="actor-name">${actorName}</span>
                        </div>
                    `;
                })
                .join("");
        }

        if (document.querySelector(".film-score")) {
            document.querySelector(".film-score").innerHTML = `
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.15327 2.34001L10.3266 4.68668C10.4866 5.01334 10.9133 5.32668 11.2733 5.38668L13.3999 5.74001C14.7599 5.96668 15.0799 6.95334 14.0999 7.92668L12.4466 9.58001C12.1666 9.86001 12.0133 10.4 12.0999 10.7867L12.5733 12.8333C12.9466 14.4533 12.0866 15.08 10.6533 14.2333L8.65994 13.0533C8.29994 12.84 7.70661 12.84 7.33994 13.0533L5.34661 14.2333C3.91994 15.08 3.05327 14.4467 3.42661 12.8333L3.89994 10.7867C3.98661 10.4 3.83327 9.86001 3.55327 9.58001L1.89994 7.92668C0.926606 6.95334 1.23994 5.96668 2.59994 5.74001L4.72661 5.38668C5.07994 5.32668 5.50661 5.01334 5.66661 4.68668L6.83994 2.34001C7.47994 1.06668 8.51994 1.06668 9.15327 2.34001Z" stroke="#FFAD49" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                <span>${movie.imdb || "N/A"}</span>
            `;
        }

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

        try {
            const favorites = await getFavoriteMovies();
            const favoriteMovieIds = favorites.map((fav) => Number(fav.id));
            setFavoriteButtonState(favoriteMovieIds.includes(Number(movie.id)));
        } catch (error) {
            console.warn("Unable to load favorites:", error);
        }

        const comments = await getMovieComments(movieId);
        renderMovieComments(comments);
    } catch (error) {
        console.error("Failed to load movie details:", error);
    }
}

async function submitComment(event) {
    event.preventDefault();

    const commentForm = document.querySelector("#comments form");
    const commentInput = commentForm ? commentForm.querySelector("textarea") : null;
    if (!commentForm || !commentInput) return;

    const movieId = new URLSearchParams(window.location.search).get("id") || "1";
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

const commentForm = document.querySelector("#comments form");
if (commentForm) {
    commentForm.addEventListener("submit", submitComment);
}

const movieId = new URLSearchParams(window.location.search).get("id") || "1";
renderMovieDetails(movieId);

