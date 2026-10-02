import "../../helpers/authGuard.js";
import { getMovies, searchMovies } from "../../api/movies.js";

const searchInput = document.querySelector(".search-input");
const searchButton = document.querySelector(".search-button");
const moviesGrid = document.querySelector(".movies-grid");

function renderMovies(movies) {
  if (!movies.length) {
    window.location.href = "../error404/error.html";
    return;
  }

  moviesGrid.innerHTML = movies
    .map(
      (movie) => `
        <div class="movie-card">
          <img 
            src="${movie.cover_url}" 
            alt="${movie.title}" 
          />

          <div class="movie-info">
            <span class="movie-type">${movie.category?.name || ""}</span>
            <h3>${movie.title}</h3>

            <div class="movie-rating">
              <i class="fa-solid fa-star"></i>
              <span>${movie.imdb}</span>
            </div>
          </div>
        </div>
      `,
    )
    .join("");
}

async function loadMovies() {
  try {
    const movies = await getMovies();

    console.log("MOVIES:", movies);

    renderMovies(movies);
  } catch (error) {
    console.error("MOVIES LOAD ERROR:", error);

    moviesGrid.innerHTML = `
      <p class="search-message">${error.message}</p>
    `;
  }
}

async function handleSearch() {
  const search = searchInput.value.trim();

  if (!search) {
    await loadMovies();
    return;
  }

  try {
    const data = await searchMovies(search);
    renderMovies(data.data || []);
  } catch (error) {
    console.error(error);

    moviesGrid.innerHTML = `
      <p class="search-message">${error.message}</p>
    `;
  }
}

searchButton.addEventListener("click", handleSearch);

searchInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    handleSearch();
  }
});

loadMovies();
