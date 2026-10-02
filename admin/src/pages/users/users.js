import { getUsers } from "../../api/users.js";
import { createTablePaginator } from "../../helpers/tablePaginator.js";
import "../../helpers/authGuard.js";
import "../../helpers/logout.js";

const usersTbody = document.querySelector(".users-tbody");
const usersPager = createTablePaginator({
  tableBody: usersTbody,
  pagerEl: document.querySelector(".table-pager"),
  colSpan: 3,
  pageSize: 8,
  emptyText: "No users found.",
  renderRow: (user) => {
    const row = document.createElement("tr");

    const idCell = document.createElement("td");
    idCell.className = "table-users-id";
    idCell.textContent = user.id;

    const nameCell = document.createElement("td");
    nameCell.className = "table-users-name";
    nameCell.textContent = user.full_name;

    const emailCell = document.createElement("td");
    emailCell.className = "table-users-email";
    emailCell.textContent = user.email;

    row.append(idCell, nameCell, emailCell);
    return row;
  },
});

async function renderUsers() {
  try {
    const data = await getUsers();

    usersPager.setItems(data.data);
  } catch (error) {
    console.error(error);
    usersPager.setItems([]);
    usersTbody.innerHTML = `
      <tr>
        <td colspan="3">${error.message}</td>
      </tr>
    `;
  }
}

renderUsers();
