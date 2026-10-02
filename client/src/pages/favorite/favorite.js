import "../../helpers/authGuard.js";
import { getFavoriteMovies } from "../../api/movies.js";

const slider = document.getElementById("favoritesSlider");
const searchInput = document.getElementById("favoritesSearchInput");
const searchButton = document.getElementById("favoritesSearchButton");

const MAX_STARS = 5;

let favorites = [];

// IMDb balını ulduzlara çevirir
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

// Film kartı
const movieCard = (movie) => `
  <article class="movie-card" data-id="${movie.id}">
    <img
      src="${movie.cover_url}"
      alt="${movie.title}"
      class="movie-poster"
    />

    <div class="movie-overlay">
      <span class="movie-genre">
        ${movie.category?.name ?? ""}
      </span>

      <div class="movie-rating">
        ${renderStars(movie.imdb)}
      </div>

      <h3 class="movie-title">
        ${movie.title}
      </h3>
    </div>
  </article>
`;

// Filmləri göstərir
function renderMovies(movies) {
  if (!movies.length) {
    slider.innerHTML = "<p class='no-movies'>No movies found.</p>";
    return;
  }

  slider.innerHTML = movies.map(movieCard).join("");
}

// Favoritləri API-dən bir dəfə gətirir
async function renderFavorites() {
  try {
    favorites = await getFavoriteMovies();

    renderMovies(favorites);
  } catch (error) {
    console.error("Favorites could not be loaded:", error);

    slider.innerHTML =
      "<p class='no-movies'>Could not load favorites. Please try again later.</p>";
  }
}

// 🔍 Search düyməsinə basanda axtarış edir
searchButton.addEventListener("click", () => {
  const query = searchInput.value.trim().toLowerCase();

  // Input boşdursa bütün favoritləri göstər
  if (!query) {
    renderMovies(favorites);
    return;
  }

  const filteredMovies = favorites.filter((movie) =>
    movie.title.toLowerCase().includes(query),
  );

  renderMovies(filteredMovies);
});

// Enter basanda da axtarış edir
searchInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    searchButton.click();
  }
});

// Film kartına klik
slider.addEventListener("click", (event) => {
  const card = event.target.closest(".movie-card");

  if (card) {
    window.location.href = `../detail/detail.html?id=${card.dataset.id}`;
  }
});

// Səhifə açılanda favoritləri gətir
renderFavorites();