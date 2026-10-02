import { fetchContacts, deleteContact } from "../../api/contactus.js";
import { createTablePaginator } from "../../helpers/tablePaginator.js";
import "../../helpers/authGuard.js";
import "../../helpers/logout.js";

// DOM
const tableBody = document.getElementById("tableBody");

const editModal = document.querySelector(".edit-modal");
const cancelEditBtn = document.querySelector(".cancel-edit-btn");
const editMessage = document.querySelector("#edit-message");

const deleteModal = document.querySelector(".delete-modal");
const cancelDeleteBtn = document.querySelector(".delete-cancel-btn");
const confirmDeleteBtn = document.querySelector(".confirm-delete-btn");

let selectedContact = null;

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

  const messageCell = document.createElement("td");

  const message = contact.reason || "";

  const messageText = document.createElement("span");
  messageText.className = "comment";
  messageText.textContent =
    message.length > 40
      ? `${message.substring(0, 40)}...`
      : message || "Message is empty";

  messageCell.appendChild(messageText);

  const actionsCell = document.createElement("td");

  const actions = document.createElement("div");
  actions.className = "table-actions";

  // View message
  const viewButton = document.createElement("button");

  viewButton.type = "button";
  viewButton.className = "action-btn edit-btn";
  viewButton.title = "View";
  viewButton.innerHTML =
    '<i class="fa-solid fa-magnifying-glass"></i>';

  viewButton.addEventListener("click", () => {
    selectedContact = contact;

    editMessage.value =
      contact.reason || "No message content available.";

    editModal.style.display = "flex";
  });

  // Delete contact
  const deleteButton = document.createElement("button");

  deleteButton.type = "button";
  deleteButton.className = "action-btn delete-btn";
  deleteButton.title = "Delete";
  deleteButton.innerHTML =
    '<i class="fa-solid fa-trash"></i>';

  deleteButton.addEventListener("click", () => {
    selectedContact = contact;

    deleteModal.style.display = "flex";
  });

  actions.append(viewButton, deleteButton);
  actionsCell.appendChild(actions);

  row.append(
    idCell,
    nameCell,
    emailCell,
    messageCell,
    actionsCell
  );

  return row;
}

// Fetch API
async function loadContacts() {
  if (!tableBody) return;

  try {
    tableBody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align:center;">
          Loading...
        </td>
      </tr>
    `;

    const contacts = await fetchContacts();
    contactsPager.setItems([...contacts].reverse());
  } catch (error) {
    console.error("Error loading data:", error.message);

    contactsPager.setItems([]);

    tableBody.innerHTML = `
      <tr>
        <td colspan="5" style="color:red; text-align:center;">
          Error: ${error.message}
        </td>
      </tr>
    `;
  }
}


// Close view modal
cancelEditBtn.addEventListener("click", () => {
  editModal.style.display = "none";
  selectedContact = null;
});


// Close delete modal
cancelDeleteBtn.addEventListener("click", () => {
  deleteModal.style.display = "none";
  selectedContact = null;
});


// Confirm delete
confirmDeleteBtn.addEventListener("click", async () => {
  if (!selectedContact) return;

  try {
    await deleteContact(selectedContact.id);

    deleteModal.style.display = "none";

    selectedContact = null;

    await loadContacts();
  } catch (error) {
    alert("An error occurred during deletion: " + error.message);
  }
});


// Start
loadContacts();

