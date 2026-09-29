import { getUsers } from "../../api/users.js";

const usersTbody = document.querySelector(".users-tbody");

async function renderUsers() {
  try {
    const data = await getUsers();

    usersTbody.innerHTML = "";

    data.data.forEach((user) => {
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td class="table-users-id">${user.id}</td>
        <td class="table-users-name">${user.full_name}</td>
        <td class="table-users-email">${user.email}</td>
      `;

      usersTbody.appendChild(tr);
    });
  } catch (error) {
    console.error(error);
    usersTbody.innerHTML = `
      <tr>
        <td colspan="3">${error.message}</td>
      </tr>
    `;
  }
}

renderUsers();
