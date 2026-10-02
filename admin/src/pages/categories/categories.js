import {
  createCategory,
  deleteCategory,
  fetchCategories,
  updateCategory,
} from "../../api/categories.js";
import { createTablePaginator } from "../../helpers/tablePaginator.js";

import "../../helpers/authGuard.js";
import "../../helpers/logout.js";

const createDialog = document.querySelector("#example-dialog");
const createForm = document.querySelector("#contact-form");
const createNameInput = document.querySelector("#modal-name");
const createSubmitBtn = document.querySelector("#submit-dialog");

const deleteModal = document.querySelector(".delete-modal");
const cancelDeleteBtn = document.querySelector(".cancel-btn");
const confirmDeleteBtn = document.querySelector(".confirm-delete-btn");
const editModal = document.querySelector(".edit-modal");
const editCategoryInput = document.querySelector("#edit-category");
const editCancelBtn = document.querySelector(".edit-cancel-btn");
const editSubmitBtn = document.querySelector(".edit-submit-btn");

const tbody = document.querySelector(".tbody");
let selectedCategoryId = null;

const pager = createTablePaginator({
  tableBody: tbody,
  pagerEl: document.querySelector(".table-pager"),
  colSpan: 3,
  pageSize: 8,
  emptyText: "No categories found.",
  renderRow: (category) => createCategoryRow(category),
});

function createCategoryRow(category) {
  const row = document.createElement("tr");
  row.classList.add("row");
  row.dataset.id = category.id;

  const idCell = document.createElement("td");
  idCell.classList.add("cell");
  idCell.textContent = category.id;

  const nameCell = document.createElement("td");
  nameCell.classList.add("cell", "row-name");
  nameCell.textContent = category.name;

  const actionsCell = document.createElement("td");
  actionsCell.classList.add("cell", "actions");
  actionsCell.innerHTML = `
    <button type="button" class="edit" aria-label="Edit category">
      <i class="fa-solid fa-pen-to-square"></i>
    </button>
    <button type="button" class="delete" aria-label="Delete category">
      <i class="fa-solid fa-trash"></i>
    </button>
  `;

  row.append(idCell, nameCell, actionsCell);
  return row;
}

async function loadCategories() {
  try {
    const categories = await fetchCategories();
    pager.setItems(categories);
  } catch (error) {
    console.error("Error loading categories:", error);
    pager.setItems([]);
    tbody.innerHTML = '<tr><td class="cell" colspan="3">Could not load categories.</td></tr>';
  }
}

loadCategories();

tbody.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;

  if (button.classList.contains("delete")) {
    selectedCategoryId = button.closest("tr").dataset.id;
    deleteModal.style.display = "flex";
  }

  if (button.classList.contains("edit")) {
    const row = button.closest("tr");
    selectedCategoryId = row.dataset.id;
    editCategoryInput.value = row.querySelector(".row-name").textContent;
    editModal.style.display = "flex";
  }
});

createForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const name = createNameInput.value.trim();
  if (!name) return;

  createSubmitBtn.disabled = true;
  try {
    await createCategory(name);
    createForm.reset();
    createDialog.close();
    await loadCategories();
  } catch (error) {
    alert(error.message);
  } finally {
    createSubmitBtn.disabled = false;
  }
});

// =========================
// DELETE MODAL
// =========================

cancelDeleteBtn.addEventListener("click", () => {
  deleteModal.style.display = "none";
});

confirmDeleteBtn.addEventListener("click", () => {
  if (!selectedCategoryId) return;

  confirmDeleteBtn.disabled = true;
  deleteCategory(selectedCategoryId)
    .then(async () => {
      deleteModal.style.display = "none";
      selectedCategoryId = null;
      await loadCategories();
    })
    .catch((error) => alert(error.message))
    .finally(() => {
      confirmDeleteBtn.disabled = false;
    });
});

// =========================
// EDIT MODAL
// =========================
editCancelBtn.addEventListener("click", () => {
  editModal.style.display = "none";
  selectedCategoryId = null;
});

editSubmitBtn.addEventListener("click", async () => {
  const newCategory = editCategoryInput.value.trim();
  if (!newCategory || !selectedCategoryId) return;

  editSubmitBtn.disabled = true;
  try {
    await updateCategory(selectedCategoryId, newCategory);
    editModal.style.display = "none";
    selectedCategoryId = null;
    await loadCategories();
  } catch (error) {
    alert(error.message);
  } finally {
    editSubmitBtn.disabled = false;
  }
});