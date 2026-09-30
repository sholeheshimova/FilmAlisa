import {
  getMovies,
  getMovie,
  createMovie,
  updateMovie,
  deleteMovie,
  getCategories,
} from "../../api/movies.js";
import { getActors } from "../../api/actors.js";

import "../../helpers/authGuard.js";
import "../../helpers/logout.js";

const fallbackImg = "../../assets/image/movie-poster.svg";
const tableBody = document.querySelector("tbody");

const emptyRow = `
  <tr>
    <td colspan="6" class="empty">Heç bir film tapılmadı.</td>
  </tr>
`;

let moviesById = new Map();
let categories = [];
let actors = [];
let editId = null;
let deleteId = null;

// ---------- köməkçilər ----------
const categoryName = (m) =>
  m.category?.name ??
  m.category_name ??
  categories.find((c) => String(c.id) === String(m.category_id ?? m.category))
    ?.name ??
  "N/A";

const optionsHtml = (items, labelFn) =>
  items.map((i) => `<option value="${i.id}">${labelFn(i)}</option>`).join("");

const selectedIds = (select) =>
  [...select.selectedOptions].map((o) => Number(o.value));

const setSelected = (select, ids) => {
  const set = new Set(ids.map(String));
  [...select.options].forEach((o) => (o.selected = set.has(o.value)));
};

// ---------- cədvəl ----------
const movieRow = (movie) => `
  <tr>
    <td>${movie.id}</td>

    <td>
      <div class="movie-title-cell">
        <img
          class="movie-poster"
          src="${movie.cover_url || fallbackImg}"
          alt="${movie.title}"
        />
        <span>${movie.title}</span>
      </div>
    </td>

    <td>${movie.overview ? `${movie.overview.slice(0, 30)}...` : "N/A"}</td>

    <td>${categoryName(movie)}</td>

    <td>${movie.imdb || "N/A"}</td>

    <td class="table-actions">
      <button
        type="button"
        class="action-btn edit-btn"
        title="Edit"
        data-id="${movie.id}"
      >
        <i class="fa-solid fa-pen-to-square"></i>
      </button>

      <button
        type="button"
        class="action-btn delete-btn"
        title="Delete"
        data-id="${movie.id}"
      >
        <i class="fa-solid fa-trash"></i>
      </button>
    </td>
  </tr>
`;

async function renderMoviesTable() {
  try {
    const response = await getMovies();
    const movies = response.data || [];

    moviesById = new Map(movies.map((m) => [String(m.id), m]));

    tableBody.innerHTML = movies.length
      ? movies.map(movieRow).join("")
      : emptyRow;
  } catch (error) {
    console.error("Filmler yüklenirken hata oluştu:", error);
  }
}

// ---------- elementlər ----------
const editMovieModal = document.querySelector("#editMovieModal");
const saveEditBtn = document.querySelector("#saveEditBtn");
const editTitle = document.querySelector("#edit-title");
const editDescription = document.querySelector("#edit-description");
const editImage = document.querySelector("#edit-image");
const editVideo = document.querySelector("#edit-video");
const editDownload = document.querySelector("#edit-download");
const editRating = document.querySelector("#edit-rating");
const editDuration = document.querySelector("#edit-duration");
const editActors = document.querySelector("#edit-actors");
const editGenre = document.querySelector("#edit-genre");
const editAdult = document.querySelector("#edit-adult");
const editPreviewImg = document.querySelector("#editPreviewImg");

const createBtn = document.querySelector(".create-btn");
const modalOverlay = document.querySelector(".modal-overlay");
const modalForm = document.querySelector(".modal-form");
const createActors = document.querySelector("#create-actors");
const createCategory = document.querySelector("#create-category");

const deleteModal = document.querySelector(".delete-modal");
const cancelBtn = document.querySelector(".cancel-btn");
const confirmBtn = document.querySelector(".confirm-delete-btn");

// ---------- aktor və kateqoriya siyahıları ----------
async function loadLookups() {
  try {
    const res = await getCategories();
    categories = res.data || [];
  } catch (error) {
    console.error("Kateqoriyalar yüklənmədi:", error);
  }

  try {
    const res = await getActors();
    actors = res.data || [];
  } catch (error) {
    console.error("Aktyorlar yüklənmədi:", error);
  }

  const actorLabel = (a) => `${a.name} ${a.surname}`;

  createCategory.innerHTML =
    `<option value="" disabled selected>category</option>` +
    optionsHtml(categories, (c) => c.name);
  editGenre.innerHTML = optionsHtml(categories, (c) => c.name);

  createActors.innerHTML = optionsHtml(actors, actorLabel);
  editActors.innerHTML = optionsHtml(actors, actorLabel);
}

loadLookups().then(renderMoviesTable);

// ---------- edit / delete klikləri ----------
document.addEventListener("click", async (event) => {
  const editBtn = event.target.closest(".edit-btn");
  const deleteBtn = event.target.closest(".delete-btn");

  if (deleteBtn) {
    deleteId = deleteBtn.dataset.id;
    deleteModal.style.display = "flex";
    return;
  }

  if (editBtn) {
    editId = editBtn.dataset.id;
    let movie = moviesById.get(String(editId)) || {};

    try {
      const res = await getMovie(editId);
      movie = { ...movie, ...(res?.data || {}) };
    } catch (error) {
      console.warn("Tək film yüklənmədi, cədvəldəki data istifadə olunur.");
    }

    editTitle.value = movie.title ?? "";
    editDescription.value = movie.overview ?? "";
    editImage.value = movie.cover_url ?? "";
    editVideo.value = movie.fragman ?? "";
    editDownload.value = movie.watch_url ?? "";
    editRating.value = movie.imdb ?? "";
    editDuration.value = movie.run_time_min ?? "";
    editAdult.checked = Boolean(movie.adult);
    editPreviewImg.src = movie.cover_url || fallbackImg;

    const categoryId =
      movie.category?.id ?? movie.category_id ?? movie.category;
    editGenre.value = categoryId ?? "";

    const actorIds = (movie.actors || []).map((a) =>
      typeof a === "object" ? a.id : a,
    );
    setSelected(editActors, actorIds);

    editMovieModal.classList.add("is-open");
  }
});

editImage.addEventListener("input", () => {
  editPreviewImg.src = editImage.value.trim() || fallbackImg;
});

// ---------- edit submit ----------
saveEditBtn.addEventListener("click", async () => {
  const payload = {
    title: editTitle.value.trim(),
    overview: editDescription.value.trim(),
    cover_url: editImage.value.trim(),
    fragman: editVideo.value.trim(),
    watch_url: editDownload.value.trim(),
    imdb: editRating.value.trim(),
    run_time_min: Number(editDuration.value),
    adult: editAdult.checked,
    category: Number(editGenre.value),
    actors: selectedIds(editActors),
  };

  try {
    await updateMovie(editId, payload);
    editMovieModal.classList.remove("is-open");
    await renderMoviesTable();
  } catch (error) {
    console.error("Film yenilənərkən xəta baş verdi:", error);
  }
});

editMovieModal.addEventListener("click", (event) => {
  if (event.target === editMovieModal) {
    editMovieModal.classList.remove("is-open");
  }
});

// ---------- create ----------
createBtn.addEventListener("click", () => {
  modalOverlay.classList.add("is-open");
});

modalOverlay.addEventListener("click", (event) => {
  if (event.target === modalOverlay) {
    modalOverlay.classList.remove("is-open");
  }
});

modalForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const data = Object.fromEntries(new FormData(modalForm));

  try {
    await createMovie({
      title: data.title,
      overview: data.overview,
      cover_url: data.cover_url,
      fragman: data.fragman,
      watch_url: data.watch_url,
      imdb: String(data.imdb),
      run_time_min: Number(data.run_time_min),
      category: Number(data.category),
      adult: modalForm.adult.checked,
      actors: selectedIds(createActors),
    });

    modalForm.reset();
    modalOverlay.classList.remove("is-open");
    await renderMoviesTable();
  } catch (error) {
    console.error("Film əlavə edilərkən xəta baş verdi:", error);
  }
});

// ---------- delete ----------
cancelBtn.addEventListener("click", () => {
  deleteModal.style.display = "none";
});

confirmBtn.addEventListener("click", async () => {
  try {
    await deleteMovie(deleteId);
    await renderMoviesTable();
  } catch (error) {
    console.error("Film silinərkən xəta baş verdi:", error);
  } finally {
    deleteModal.style.display = "none";
    deleteId = null;
  }
});
