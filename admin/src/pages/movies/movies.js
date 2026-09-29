import { getMovies, deleteMovie, createMovie } from "../../api/movies.js";

const tableBody = document.querySelector("tbody");

const emptyRow = `<tr><td colspan="6" class="empty">Heç bir film tapılmadı.</td></tr>`;

const movieRow = ({ id, title, cover_url, overview, category_name, imdb }) => `
  <tr>
    <td>${id}</td>
    <td>
      <div class="movie-title-cell">
        <img class="movie-poster" src="${cover_url || "../../assets/image/movie-poster.svg"}" alt="${title}" />
        <span>${title}</span>
      </div>
    </td>
    <td>${overview ? `${overview.slice(0, 30)}...` : "N/A"}</td>
    <td>${category_name || "N/A"}</td>
    <td>${imdb || "N/A"}</td>
    <td class="table-actions">
      <button type="button" class="action-btn edit-btn" title="Edit" data-id="${id}">
        <i class="fa-solid fa-pen-to-square"></i>
      </button>
      <button type="button" class="action-btn delete-btn" title="Delete" data-id="${id}">
        <i class="fa-solid fa-trash"></i>
      </button>
    </td>
  </tr>`;

async function renderMoviesTable() {
  try {
    // const { data: movies = [] } = await getMovies();
    const response = await getMovies();
    const movies = response.data || [];
    tableBody.innerHTML = movies.length
      ? movies.map(movieRow).join("")
      : emptyRow;
  } catch (error) {
    console.error("Filmler yüklenirken hata oluştu:", error);
  }
}

renderMoviesTable();

// delete
const deleteModal = document.querySelector(".delete-modal");
const cancelBtn = document.querySelector(".cancel-btn");
const confirmBtn = document.querySelector(".confirm-delete-btn");
let deleteId = null;

document.addEventListener("click", (event) => {
  const btn = event.target.closest(".delete-btn");
  if (!btn) return;
  deleteId = btn.dataset.id;
  deleteModal.style.display = "flex";
});

cancelBtn.addEventListener("click", () => {
  deleteModal.style.display = "none";
});

confirmBtn.addEventListener("click", async () => {
  try {
    await deleteMovie(deleteId);
    renderMoviesTable();
  } catch (error) {
    console.error("Film silinərkən xəta baş verdi:", error);
  } finally {
    deleteModal.style.display = "none";
  }
});

// edit

const editMovieModal = document.querySelector("#editMovieModal");
const saveEditBtn = document.querySelector("#saveEditBtn");

// Modalı açmaq
document.addEventListener("click", function (event) {
  if (event.target.closest(".edit-btn")) {
    // "edit-btn" olmalıdır
    editMovieModal.classList.add("is-open");
  }
});

// Modalı bağlamaq - Edit düyməsinə basanda
saveEditBtn.addEventListener("click", function () {
  editMovieModal.classList.remove("is-open");
});

// create

const createBtn = document.querySelector(".create-btn");
const modalOverlay = document.querySelector(".modal-overlay");
const modalForm = document.querySelector(".modal-form");
console.log(modalForm);

// Modalı açmaq
createBtn.addEventListener("click", function () {
  modalOverlay.classList.add("is-open");
});

// Modalı bağlamaq - Submit basanda
modalForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(modalForm));
  try {
    await createMovie({
      ...data,
      run_time_min: Number(data.run_time_min),
      category: Number(data.category),
      adult: modalForm.adult.checked,
    });
    modalForm.reset();
    modalOverlay.classList.remove("is-open");
    renderMoviesTable();
  } catch (error) {
    console.error("Film əlavə edilərkən xəta baş verdi:", error);
  }
});
