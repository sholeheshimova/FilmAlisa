import "../../helpers/authGuard.js";
import { getFavoriteMovies } from "../../api/movies.js";

const slider = document.getElementById("favoritesSlider");
const searchInput = document.getElementById("favoritesSearchInput");
const MAX_STARS = 5;

let favorites = [];

// imdb balı ulduz çevirim görsetmek üçün
const renderStars = (imdb) => {
  const filled = Math.round(Number(imdb) / 2);
  let stars = "";

  for (let i = 0; i < MAX_STARS; i++) {
    stars +=
      i < filled
        ? '<i class="fa-solid fa-star"></i>'
        : '<i class="fa-regular fa-star"></i>';
  }

  return stars;
};

// tək film üçün kart
const movieCard = (movie) => `
  <article class="movie-card" data-id="${movie.id}">
    <img src="${movie.cover_url}" alt="${movie.title}" class="movie-poster" />
    <div class="movie-overlay">
      <span class="movie-genre">${movie.category?.name ?? ""}</span>
      <div class="movie-rating">${renderStars(movie.imdb)}</div>
      <h3 class="movie-title">${movie.title}</h3>
    </div>
  </article>`;

// verilən filmləri ekrana çıxarır
function renderMovies(movies) {
  slider.innerHTML = movies.length
    ? movies.map(movieCard).join("")
    : "<p>No movies found.</p>";
}

// favorti filimi apiden getirir çıxarır
async function renderFavorites() {
  try {
    favorites = await getFavoriteMovies();
    renderMovies(favorites);
  } catch (error) {
    console.error("Favorites could not be loaded:", error);
    slider.innerHTML =
      "<p>Could not load favorites. Please try again later.</p>";
  }
}

// axdarış yerinde ise search eliyende filim herfi yazılır ve çıarmtaq üçün
searchInput.addEventListener("input", () => {
  const query = searchInput.value.trim().toLowerCase();
  renderMovies(
    favorites.filter((movie) => movie.title.toLowerCase().includes(query)),
  );
});

// favoritdən filmə basanda filmin detail səhifəsinə keçir
slider.addEventListener("click", (event) => {
  const card = event.target.closest(".movie-card");
  if (card)
    window.location.href = `../detail/detail.html?id=${card.dataset.id}`;
});

renderFavorites();
