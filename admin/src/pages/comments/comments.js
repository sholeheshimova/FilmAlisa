import "../../helpers/authGuard.js";
import "../../helpers/logout.js";
import { getComments, deleteComment } from "../../api/comments.js";
import { createTablePaginator } from "../../helpers/tablePaginator.js";

const tbody = document.querySelector(".movies-table tbody");

const editModal = document.querySelector(".edit-modal");
const cancelEditBtn = document.querySelector(".cancel-edit-btn");

const deleteModal = document.querySelector(".delete-modal");
const cancelDeleteBtn = document.querySelector(".delete-cancel-btn");
const confirmDeleteBtn = document.querySelector(".confirm-delete-btn");

let selectedComment = null; //burda deyirik ki hasni comment secilib ilk basda null edirik

const commentsPager = createTablePaginator({
  tableBody: tbody,
  pagerEl: document.querySelector(".table-pager"),
  colSpan: 5,
  pageSize: 8,
  emptyText: "No comments found.",
  renderRow: (item) => createCommentRow(item),
});

function createCommentRow(item) {
  const row = document.createElement("tr");

  const idCell = document.createElement("td");
  idCell.textContent = item.id;

  const userCell = document.createElement("td");
  const userLabel = document.createElement("div");
  userLabel.className = "movie-title";
  const userName = document.createElement("span");
  userName.textContent = "User";
  userLabel.appendChild(userName);
  userCell.appendChild(userLabel);

  const movieCell = document.createElement("td");
  movieCell.textContent = item.movie.title;

  const commentCell = document.createElement("td");
  const comment = document.createElement("span");
  comment.className = "comment";
  comment.textContent = item.comment;
  commentCell.appendChild(comment);

  const actionsCell = document.createElement("td");
  const actions = document.createElement("div");
  actions.className = "table-actions";

  const editButton = document.createElement("button");
  editButton.type = "button";
  editButton.className = "action-btn edit-btn";
  editButton.title = "View";
  editButton.innerHTML = '<i class="fa-solid fa-magnifying-glass"></i>';
  editButton.addEventListener("click", () => {
    selectedComment = item;
    document.querySelector("#edit-comment").value = item.comment;
    editModal.style.display = "flex";
  });

  const deleteButton = document.createElement("button");
  deleteButton.type = "button";
  deleteButton.className = "action-btn delete-btn";
  deleteButton.title = "Delete";
  deleteButton.innerHTML = '<i class="fa-solid fa-trash"></i>';
  deleteButton.addEventListener("click", () => {
    selectedComment = item;
    deleteModal.style.display = "flex";
  });

  actions.append(editButton, deleteButton);
  actionsCell.appendChild(actions);
  row.append(idCell, userCell, movieCell, commentCell, actionsCell);
  return row;
}

// Get comments
async function loadComments() {
  const comments = await getComments();
  commentsPager.setItems(comments);
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
