// delete
const deleteModal = document.querySelector(".delete-modal");
const deleteButtons = document.querySelectorAll(".delete-btn");
const cancelBtn = document.querySelector(".cancel-btn");

deleteButtons.forEach((button) => {
  button.addEventListener("click", () => {
    deleteModal.style.display = "flex";
  });
});

cancelBtn.addEventListener("click", () => {
  deleteModal.style.display = "none";
});



// edit

const editMovieModal = document.querySelector("#editMovieModal");
const saveEditBtn = document.querySelector("#saveEditBtn");

// Modalı açmaq
document.addEventListener("click", function (event) {
    if (event.target.closest(".edit-btn")) {   // "edit-btn" olmalıdır
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
modalForm.addEventListener("submit", function (event) {
    console.log("Submit işə düşdü!");
    event.preventDefault(); // səhifənin yenilənməsinin (reload) qarşısını alır
    modalOverlay.classList.remove("is-open");
});