import {
  getActors,
  createActor,
  updateActor,
  deleteActor,
} from "../../api/actors.js";

let selectedActorId = null;
let actorsById = new Map();

const tbody = document.querySelector(".tbody");

const actorRow = ({ id, name, surname, img_url }) => `
  <tr class="row" data-id="${id}">
    <td class="cell">${id}</td>
    <td class="cell"><img src="${img_url}" alt="${name} ${surname}" class="img" width="40" /></td>
    <td class="cell row-name">${name}</td>
    <td class="cell row-name">${surname}</td>
    <td class="cell actions">
      <button type="button" class="edit" aria-label="Edit actor"><i class="fa-solid fa-pen-to-square"></i></button>
      <button type="button" class="delete" aria-label="Delete actor"><i class="fa-solid fa-trash"></i></button>
    </td>
  </tr>`;

async function renderActors() {
  try {
    const { data: actors = [] } = await getActors();
    actorsById = new Map(actors.map((a) => [String(a.id), a]));
    tbody.innerHTML = actors.map(actorRow).join("");
  } catch (error) {
    console.error("Aktyorlar yüklənərkən xəta baş verdi:", error);
  }
}

renderActors();

// ---------- CREATE ----------
const createDialog = document.querySelector("#example-dialog");
const createNameInput = document.querySelector("#modal-name");
const createSurnameInput = document.querySelector("#modal-surname");
const createImgUrlInput = document.querySelector("#modal-img-url");
const createSubmitButton = document.querySelector("#submit-dialog");

createSubmitButton.addEventListener("click", async () => {
  const name = createNameInput.value.trim();
  const surname = createSurnameInput.value.trim();
  const img_url = createImgUrlInput.value.trim();

  if (!name || !surname || !img_url) return;

  try {
    await createActor({ name, surname, img_url });
    createDialog.close();
    createNameInput.value = "";
    createSurnameInput.value = "";
    createImgUrlInput.value = "";
    await renderActors();
  } catch (error) {
    console.error("Aktyor yaradılarkən xəta baş verdi:", error);
  }
});

// ---------- EDIT ----------
const editModal = document.querySelector(".actor-edit-modal");
const editNameInput = document.querySelector("#edit-name");
const editSurnameInput = document.querySelector("#edit-surname");
const editImageUrlInput = document.querySelector("#edit-image-url");
const editPhotoPreview = document.querySelector("#edit-photo-preview");
const editCancelButton = document.querySelector(".actor-edit-cancel");
const editSubmitButton = document.querySelector(".actor-edit-submit");

// delete modal
const deleteModal = document.querySelector(".actor-delete-modal");
const cancelDeleteButton = document.querySelector(".actor-cancel-delete");
const confirmDeleteButton = document.querySelector(".actor-confirm-delete");

tbody.addEventListener("click", (e) => {
  const editBtn = e.target.closest(".edit");
  const deleteBtn = e.target.closest(".delete");
  const row = e.target.closest("tr");

  if (!row) return;

  selectedActorId = row.dataset.id;

  if (editBtn) {
    const actor = actorsById.get(selectedActorId);
    if (!actor) return;

    editNameInput.value = actor.name;
    editSurnameInput.value = actor.surname;
    editImageUrlInput.value = actor.img_url;
    editPhotoPreview.src = actor.img_url;

    editModal.style.display = "flex";
  }

  if (deleteBtn) {
    deleteModal.style.display = "flex";
  }
});

editImageUrlInput.addEventListener("input", () => {
  editPhotoPreview.src = editImageUrlInput.value.trim();
});

editCancelButton.addEventListener("click", () => {
  editModal.style.display = "none";
});

editSubmitButton.addEventListener("click", async () => {
  const name = editNameInput.value.trim();
  const surname = editSurnameInput.value.trim();
  const img_url = editImageUrlInput.value.trim();

  if (!name || !surname || !img_url) return;

  try {
    await updateActor(selectedActorId, { name, surname, img_url });
    editModal.style.display = "none";
    await renderActors();
  } catch (error) {
    console.error("Yeniləmə zamanı xəta baş verdi:", error);
  }
});

// ---------- DELETE ----------
cancelDeleteButton.addEventListener("click", () => {
  deleteModal.style.display = "none";
});

confirmDeleteButton.addEventListener("click", async () => {
  try {
    await deleteActor(selectedActorId);
    deleteModal.style.display = "none";
    await renderActors();
  } catch (error) {
    console.error("Silinmə zamanı xəta baş verdi:", error);
  }
});
