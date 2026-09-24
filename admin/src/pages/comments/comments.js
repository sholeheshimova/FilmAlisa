const editBtn = document.querySelector("#edit-btn")
const deleteBtn = document.querySelector("#delete-btn")
const editModal = document.querySelector(".edit-modal");
const cancelEditBtn = document.querySelector(".cancel-edit-btn");
const deleteModal = document.querySelector(".delete-modal")
const cancelDeleteBtn = document.querySelector(".delete-cancel-btn")


editBtn.addEventListener("click", function () {
    editModal.style.display = "flex"
})

cancelEditBtn.addEventListener("click", function () {
    editModal.style.display = "none"
})


deleteBtn.addEventListener("click", function () {
    deleteModal.style.display = "flex"
})


cancelDeleteBtn.addEventListener("click", function () {
    deleteModal.style.display = "none"
})