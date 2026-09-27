const deleteModal = document.querySelector(".delete-modal");

const deleteButtons = document.querySelectorAll(".delete");

const cancelDeleteBtn = document.querySelector(".cancel-btn");

const confirmDeleteBtn = document.querySelector(".confirm-delete-btn");


// =========================
// DELETE MODAL
// =========================

deleteButtons.forEach((button) => {
  button.addEventListener("click", () => {
    deleteModal.style.display = "flex";
  });
});


cancelDeleteBtn.addEventListener("click", () => {
  deleteModal.style.display = "none";
});


confirmDeleteBtn.addEventListener("click", () => {
  deleteModal.style.display = "none";

  // Backend gələndə burada DELETE request olacaq
});


// =========================
// EDIT MODAL
// =========================

const editModal = document.querySelector(".edit-modal");

const editButtons = document.querySelectorAll(".edit");

const editCategoryInput = document.querySelector("#edit-category");

const editCancelBtn = document.querySelector(".edit-cancel-btn");

const editSubmitBtn = document.querySelector(".edit-submit-btn");


editButtons.forEach((button) => {
  button.addEventListener("click", () => {

    const row = button.closest("tr");

    const categoryName = row.querySelector(".row-name").textContent;

    editCategoryInput.value = categoryName;

    editModal.style.display = "flex";
  });
});


editCancelBtn.addEventListener("click", () => {
  editModal.style.display = "none";
});


editSubmitBtn.addEventListener("click", () => {

  const newCategory = editCategoryInput.value.trim();

  if (!newCategory) {
    return;
  }

  editModal.style.display = "none";

  // Backend gələndə burada PUT/PATCH request olacaq
});