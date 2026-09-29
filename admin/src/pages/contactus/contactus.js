import { fetchContacts, deleteContact } from "../../api/contactus.js";
import "../../helpers/authGuard.js";
import "../../helpers/logout.js";

// DOM
const tableBody = document.getElementById("tableBody");
const deleteModal = document.getElementById("deleteModal");
const viewMessageModal = document.getElementById("viewMessageModal");
const fullMessageText = document.getElementById("fullMessageText");
const closeViewModalBtn = document.getElementById("closeViewModalBtn");
const btnCancelDelete = deleteModal?.querySelector(".btn-cancel");
const btnOkDelete = deleteModal?.querySelector(".btn-ok");

let currentDeleteId = null;

// Fetch API
async function loadContacts() {
    if (!tableBody) return;

    try {
        // loading
        tableBody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align:center;">Loading...</td>
            </tr>`;

        const contacts = await fetchContacts();
        tableBody.innerHTML = "";

        if (contacts.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="5" style="text-align:center;">No contact requests found.</td>
                </tr>`;
            return;
        }

        // Loop contacts rows
        contacts.forEach((contact, index) => {
            const shortMessage =
                contact.reason && contact.reason.length > 40
                    ? contact.reason.substring(0, 40) + "..."
                    : contact.reason || "Message is empty";

            const row = `
                <tr>
                    <td>${index + 1}</td>
                    <td>${contact.full_name || "Anonymous"}</td>
                    <td>${contact.email || "No Email"}</td>
                    <td class="view-msg-trigger" data-msg="${contact.reason || ''}" style="cursor:pointer; text-decoration:none;">
                        ${shortMessage}
                    </td>
                    <td class="col-action" style="text-align:center;">
                        <button type="button" class="delete delete-btn" aria-label="Delete contact" data-id="${contact.id}">
                            <i class="fa-solid fa-trash" style="pointer-events: none;"></i>
                        </button>
                    </td>
                </tr>
            `;

            tableBody.innerHTML += row;
        });

        addTableEvents();

    } catch (error) {
        console.error("Error loading data:", error.message);
        tableBody.innerHTML = `<tr><td colspan="5" style="color:red; text-align:center;">Error: ${error.message}</td></tr>`;
    }
}

function addTableEvents() {
    // message modal
    const msgCells = document.querySelectorAll(".view-msg-trigger");

    msgCells.forEach(cell => {
        cell.addEventListener("click", (e) => {
            const fullMsg = e.currentTarget.getAttribute("data-msg");

            if (fullMessageText && viewMessageModal) {
                fullMessageText.innerText =
                    fullMsg || "No message content available.";

                viewMessageModal.style.display = "flex";
            }
        });
    });

    // popup delete
    const deleteButtons = document.querySelectorAll(".delete-btn");

    deleteButtons.forEach(button => {
        button.addEventListener("click", (e) => {
            currentDeleteId = e.currentTarget.getAttribute("data-id");

            if (deleteModal) {
                deleteModal.style.display = "flex";
            }
        });
    });
}

// MODAL

// delete confirm
if (deleteModal && btnCancelDelete && btnOkDelete) {
    btnCancelDelete.addEventListener("click", () => {
        deleteModal.style.display = "none";
        currentDeleteId = null;
    });

    // API call
    btnOkDelete.addEventListener("click", async () => {
        if (currentDeleteId) {
            try {
                await deleteContact(currentDeleteId);

                deleteModal.style.display = "none";
                currentDeleteId = null;

                loadContacts();

            } catch (error) {
                alert("An error occurred during deletion: " + error.message);
            }
        }
    });
}

if (closeViewModalBtn && viewMessageModal) {
    closeViewModalBtn.addEventListener("click", () => {
        viewMessageModal.style.display = "none";
    });
}

// Start
document.addEventListener("DOMContentLoaded", loadContacts);