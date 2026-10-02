import { fetchContacts, deleteContact } from "../../api/contactus.js";
import { createTablePaginator } from "../../helpers/tablePaginator.js";
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

const contactsPager = createTablePaginator({
    tableBody,
    pagerEl: document.querySelector(".table-pager"),
    colSpan: 5,
    pageSize: 8,
    emptyText: "No contact requests found.",
    renderRow: (contact, index) => createContactRow(contact, index),
});

function createContactRow(contact, index) {
    const row = document.createElement("tr");

    const idCell = document.createElement("td");
    idCell.textContent = String(index + 1);

    const nameCell = document.createElement("td");
    nameCell.textContent = contact.full_name || "Anonymous";

    const emailCell = document.createElement("td");
    emailCell.textContent = contact.email || "No Email";

    const message = contact.reason || "";
    const messageCell = document.createElement("td");
    messageCell.className = "view-msg-trigger";
    messageCell.dataset.msg = message;
    messageCell.style.cursor = "pointer";
    messageCell.textContent = message.length > 40
        ? `${message.substring(0, 40)}...`
        : message || "Message is empty";

    const actionsCell = document.createElement("td");
    actionsCell.className = "col-action";
    actionsCell.style.textAlign = "center";

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "delete delete-btn";
    deleteButton.setAttribute("aria-label", "Delete contact");
    deleteButton.dataset.id = contact.id;
    deleteButton.innerHTML = '<i class="fa-solid fa-trash" style="pointer-events: none;"></i>';
    actionsCell.appendChild(deleteButton);

    row.append(idCell, nameCell, emailCell, messageCell, actionsCell);
    return row;
}

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
        contactsPager.setItems(contacts);

    } catch (error) {
        console.error("Error loading data:", error.message);
        contactsPager.setItems([]);
        tableBody.innerHTML = `<tr><td colspan="5" style="color:red; text-align:center;">Error: ${error.message}</td></tr>`;
    }
}

tableBody?.addEventListener("click", (event) => {
    const messageCell = event.target.closest(".view-msg-trigger");
    if (messageCell && fullMessageText && viewMessageModal) {
        fullMessageText.innerText = messageCell.dataset.msg || "No message content available.";
        viewMessageModal.style.display = "flex";
        return;
    }

    const deleteButton = event.target.closest(".delete-btn");
    if (deleteButton) {
        currentDeleteId = deleteButton.dataset.id;
        if (deleteModal) deleteModal.style.display = "flex";
    }
});

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