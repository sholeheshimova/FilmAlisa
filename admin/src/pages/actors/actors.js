const editModal = document.querySelector(".actor-edit-modal");

const editButtons = document.querySelectorAll(".edit");

const editNameInput = document.querySelector("#edit-name");
const editSurnameInput = document.querySelector("#edit-surname");
const editImageUrlInput = document.querySelector("#edit-image-url");

const editPhotoPreview = document.querySelector("#edit-photo-preview");

const editCancelButton = document.querySelector(".actor-edit-cancel");
const editSubmitButton = document.querySelector(".actor-edit-submit");


editButtons.forEach((button) => {

  button.addEventListener("click", () => {

    const row = button.closest("tr");

    const name = row.children[1].textContent.trim();
    const surname = row.children[2].textContent.trim();

    const image = row.querySelector(".img");

    const imageUrl = image ? image.src : "";


    editNameInput.value = name;

    editSurnameInput.value = surname;

    editImageUrlInput.value = imageUrl;

    editPhotoPreview.src = imageUrl;


    editModal.style.display = "flex";
  });

});


editCancelButton.addEventListener("click", () => {
  editModal.style.display = "none";
});


editSubmitButton.addEventListener("click", () => {

  const name = editNameInput.value.trim();
  const surname = editSurnameInput.value.trim();
  const imageUrl = editImageUrlInput.value.trim();

  if (!name || !surname || !imageUrl) {
    return;
  }

  editModal.style.display = "none";
});




// delete
const deleteModal = document.querySelector(".actor-delete-modal");
const deleteButtons = document.querySelectorAll(".delete");
const cancelDeleteButton = document.querySelector(".actor-cancel-delete");
const confirmDeleteButton = document.querySelector(".actor-confirm-delete");

deleteButtons.forEach((button) => {
  button.addEventListener("click", () => {
    deleteModal.style.display = "flex";
  });
});

cancelDeleteButton.addEventListener("click", () => {
  deleteModal.style.display = "none";
});

confirmDeleteButton.addEventListener("click", () => {
  deleteModal.style.display = "none";
});