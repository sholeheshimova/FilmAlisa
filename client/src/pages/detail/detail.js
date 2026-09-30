import { fetchMovieById } from "../../api/movies.js";

const token = sessionStorage.getItem("user_token");
if (!token) {
    window.location.href = "../../pages/login/login.html";
}

// URL Film ID
const urlSearch = window.location.search.substring(1);
const filmId = urlSearch.match(/\d+/) ? urlSearch.match(/\d+/)[0] : urlSearch;

// 1. Get DOM
async function fetchFilmDetails() {
    if (!filmId) {
        console.error("Film ID tapılmadı!");
        return;
    }

    try {
        const result = await fetchMovieById(filmId);

        // API-data
        const filmData = result.data;
        // Favorite-btn = movie ID 
        const favoriteButton = document.getElementById("favorite-btn");
        if (favoriteButton) {
            favoriteButton.setAttribute("data-movie-id", filmData.id);
        }
        // A. Modal Və Treyler
        const fragmanIframe = document.querySelector(".iframe-fragman");
        if (fragmanIframe) fragmanIframe.src = filmData.fragman || "";

        const filmModalName = document.querySelector(".film-modal-name");
        if (filmModalName) filmModalName.textContent = filmData.title || "";
        // B. Cover Image
        const filmBg = document.querySelector(".film-bg");
        if (filmBg) filmBg.src = filmData.cover_url || "../../Assets/images/details-bg.jpeg";

        const filmNameH1 = document.querySelector(".film-name h1");
        if (filmNameH1) filmNameH1.textContent = filmData.title || "";
        // C. filmData.category.name
        const filmCategoryP = document.querySelector(".film-name p");
        if (filmCategoryP) filmCategoryP.textContent = filmData.category?.name || "Kategoriya yoxdur";

        const genresP = document.querySelector(".genres p");
        if (genresP) genresP.textContent = filmData.category?.name || "Bilinmir";
        // D. Overview / IMDB
        const filmText = document.querySelector(".film-text");
        if (filmText) filmText.textContent = filmData.overview || "Açıqlama tapılmadı.";

        const filmScoreSpan = document.querySelector(".film-score span");
        if (filmScoreSpan) filmScoreSpan.textContent = filmData.imdb || "N/A";
        // E. datatime
        if (filmData.created_at) {
            const firstDateP = document.querySelector(".first-date p");
            if (firstDateP) firstDateP.textContent = formatDate(filmData.created_at);

            const lastDateP = document.querySelector(".last-date p");
            if (lastDateP) lastDateP.textContent = formatDateTime(filmData.created_at);
        }
        // F. Status (Adult & run_time_min)
        const statusP = document.querySelector(".status p");
        if (statusP) statusP.textContent = filmData.adult ? "18+ (Adult Content)" : "Hər kəs üçün";

        const runTimeP = document.querySelector(".run-time p");
        if (runTimeP) runTimeP.textContent = `${filmData.run_time_min || 0} dəq`;

        const filmImg = document.querySelector(".film-image img");
        if (filmImg) filmImg.src = filmData.cover_url || "../../Assets/images/lost-in-space.jpeg";

        // G. filmData.actors
        const actorSlides = document.querySelector(".film-actors .actors-slider .actor-slides");
        if (actorSlides && Array.isArray(filmData.actors)) {
            actorSlides.innerHTML = ""; 

            filmData.actors.forEach((actor) => {
                const actorSlide = document.createElement("div");
                actorSlide.classList.add("actor");
                actorSlide.innerHTML = `
          <img src="${actor.img_url}" alt="${actor.name} ${actor.surname}" />
          <div class="actor-name" style="display: flex; flex-direction: column;">
            <span>${actor.name}</span>
            <span>${actor.surname}</span>
          </div>
        `;
                actorSlides.appendChild(actorSlide);
            });
        }
        // H. Watch Now (watch_url)
        const watchLink = document.querySelector(".film-text-header-left a");
        if (watchLink) {
            watchLink.addEventListener("click", (event) => {
                event.preventDefault();
                if (filmData.watch_url) {
                    if (filmData.watch_url.startsWith("https://www.youtube.com/embed/")) {
                        const embedId = filmData.watch_url.split("embed/")[1].split("?")[0];
                        window.location.href = `details-2.html#${encodeURIComponent(embedId)}`;
                        sessionStorage.setItem("movie.name", filmData.title);
                    } else {
                        window.open(filmData.watch_url, "_blank");
                    }
                }
            });
        }
    } catch (error) {
        console.error("Film detalları yüklənərkən xəta baş verdi:", error.message);
    }
}
// time Format
function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
}

function formatDateTime(dateString) {
    const date = new Date(dateString);
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
}

// Call
fetchFilmDetails();

// ==========
// 1. POPUP 
// ==========
const popup = document.getElementById("popup");
const popP = document.getElementById("pop-p");

// Popup
export function showPopup(message) {
    if (popup && popP) {
        popP.textContent = message;
        popup.classList.add("show"); // CSS-dəki .popup.show animasiyasını işə salır
    }
}

// Popup close
window.closePopup = function () {
    if (popup) {
        popup.classList.remove("show");
    }
};

// ==================
// 2. TREYLER MODAL
// ==================
const filmImage = document.querySelector(".film-image");
const filmModal = document.querySelector(".film-modal");
const filmOverlay = document.querySelector(".film-overlay");
const filmModalOverlay = document.querySelector(".film-modal-overlay");
const iframeFragman = document.querySelector(".iframe-fragman");

// film-image-click-btn
if (filmImage && filmModal) {
    filmImage.addEventListener("click", () => {
        filmModal.classList.add("active");
        if (filmOverlay) filmOverlay.classList.add("active");
    });
}

const closeFragmanModal = () => {
    if (filmModal) filmModal.classList.remove("active");
    if (filmOverlay) filmOverlay.classList.remove("active");

    if (iframeFragman) {
        const currentSrc = iframeFragman.src;
        iframeFragman.src = currentSrc;
    }
};

if (filmOverlay) filmOverlay.addEventListener("click", closeFragmanModal);
if (filmModalOverlay) filmModalOverlay.addEventListener("click", closeFragmanModal);


// ===================
// 3.  Modal-remove
// ===================
const modalRemove = document.getElementById("modal-remove");
const yesBtn = document.getElementById("yes-btn");
let selectedCommentId = null; // Silinəcək şərhin ID-si

// modal open-btn
export function openRemoveModal(commentId) {
    selectedCommentId = commentId;
    if (modalRemove) {
        modalRemove.style.display = "flex";
    }
}

// Modal close-btn
window.closeRemoveModal = function () {
    selectedCommentId = null;
    if (modalRemove) {
        modalRemove.style.display = "none";
    }
};

// Modal Yes-btn
if (yesBtn) {
    yesBtn.addEventListener("click", async () => {
        if (!selectedCommentId) return;

        try {
            // deleteComment(selectedCommentId) API function
            // await deleteComment(selectedCommentId);

            window.closeRemoveModal();
            showPopup("Şərh uğurla silindi!");

        } catch (error) {
            window.closeRemoveModal();
            showPopup(error.message || "Şərh silinərkən xəta baş verdi.");
        }
    });
}
// =========
// faworite
// =========
const favoriteBtn = document.getElementById("favorite-btn");
let isFavorite = false;  //status

if (favoriteBtn) {
    favoriteBtn.addEventListener("click", async () => {
        const movieId = favoriteBtn.getAttribute("data-movie-id");

        if (!movieId) {
            showPopup("Film ID-si tapılmadı!");
            return;
        }

        try {
            // Toggle : delete or add
            isFavorite = !isFavorite;

            if (isFavorite) {
                // API-add-faworite
                // await addToFavorites(movieId);

                favoriteBtn.classList.add("active");
                showPopup("Film sevimlilərə əlavə olundu!");
            } else {
                // API-delete-faworite
                // await removeFromFavorites(movieId);

                favoriteBtn.classList.remove("active");
                showPopup("Film sevimlilərdən çıxarıldı!");
            }
        } catch (error) {
            // Xəta olarsa statusu əvvəlki halına qaytarırıq
            isFavorite = !isFavorite;
            showPopup(error.message || "Xəta baş verdi!");
        }
    });
}

// Call-movie-data
export function setFavoriteStatus(movieId, inFavoriteList = false) {
    if (favoriteBtn) {
        favoriteBtn.setAttribute("data-movie-id", movieId);
        isFavorite = inFavoriteList;

        if (isFavorite) {
            favoriteBtn.classList.add("active");
        } else {
            favoriteBtn.classList.remove("active");
        }
    }
}