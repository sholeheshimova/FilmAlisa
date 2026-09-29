import "../../helpers/authGuard.js";
import "../../helpers/logout.js";
import { getComments, deleteComment } from "../../api/comments.js";

const tbody = document.querySelector(".movies-table tbody");

const editModal = document.querySelector(".edit-modal");
const cancelEditBtn = document.querySelector(".cancel-edit-btn");

const deleteModal = document.querySelector(".delete-modal");
const cancelDeleteBtn = document.querySelector(".delete-cancel-btn");
const confirmDeleteBtn = document.querySelector(".confirm-delete-btn");

let selectedComment = null; //burda deyirik ki hasni comment secilib ilk basda null edirik

// Get comments
async function loadComments() {
  const comments = await getComments();
  //   console.log(comments);

  tbody.innerHTML = "";

  comments.forEach((item) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${item.id}</td>

      <td>
        <div class="movie-title">
          <span>User</span>
        </div>
      </td>


      <td>${item.movie.title}</td>

      <td>
        <span class="comment">
          ${item.comment}
        </span>
      </td>

      <td>
        <div class="table-actions">

          <button
            type="button"
            class="action-btn edit-btn"
            title="View"
          >
            <i class="fa-solid fa-magnifying-glass"></i>
          </button>

          <button
            type="button"
            class="action-btn delete-btn"
            title="Delete"
          >
            <i class="fa-solid fa-trash"></i>
          </button>

        </div>
      </td>
    `;

    const editBtn = row.querySelector(".edit-btn");
    const deleteBtn = row.querySelector(".delete-btn");

    // View full comment
    editBtn.addEventListener("click", () => {
      selectedComment = item;

      document.querySelector("#edit-comment").value = item.comment;

      editModal.style.display = "flex";
    });

    // Open delete modal
    deleteBtn.addEventListener("click", () => {
      selectedComment = item;

      deleteModal.style.display = "flex";
    });

    tbody.appendChild(row);
  });
}

// Close edit modal
cancelEditBtn.addEventListener("click", () => {
  editModal.style.display = "none";
});

// Close delete modal
cancelDeleteBtn.addEventListener("click", () => {
  deleteModal.style.display = "none";
});

// Delete comment
confirmDeleteBtn.addEventListener("click", async () => {
  if (!selectedComment) return;

  await deleteComment(selectedComment.movie.id, selectedComment.id);

  deleteModal.style.display = "none";

  await loadComments(); //apiler yeniden gelir refresh olunmadan

  selectedComment = null; //artiq secilmis comment yoxdur
});

// Load comments when page opens
loadComments(); //sehife acilan kimi yene bu funksiya cagirilri
