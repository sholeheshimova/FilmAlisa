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