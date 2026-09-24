const viewMessageModal = document.querySelector("#viewMessageModal");
const fullMessageText = document.querySelector("#fullMessageText");
const closeViewModalBtn = document.querySelector("#closeViewModalBtn");

const deleteModal = document.querySelector("#deleteModal");

// "Böyüdücü şüşə" (View) ikonuna klik - mesajı göstər
document.addEventListener("click", function (event) {
    const viewBtn = event.target.closest(".edit-btn");
    if (viewBtn) {
        fullMessageText.textContent = viewBtn.dataset.message;
        viewMessageModal.classList.add("active");
    }
});

// Close düyməsi - view modalı bağla
closeViewModalBtn.addEventListener("click", function () {
    viewMessageModal.classList.remove("active");
});

// Trash ikonuna klik - delete modalı aç
document.addEventListener("click", function (event) {
    if (event.target.closest(".delete-btn")) {
        deleteModal.classList.add("active");
    }
});


// cancel
const cancelDeleteBtn = document.querySelector(".btn-cancel");

cancelDeleteBtn.addEventListener("click", function () {
    deleteModal.classList.remove("active");
});