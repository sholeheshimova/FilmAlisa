import "../../helpers/authGuard.js";
import { getProfile, updateProfile } from "../../api/account.js";

const image = document.querySelector("#image");
const imageInput = document.querySelector("#profile-image");
const fullnameInput = document.querySelector("#fullname");
const emailInput = document.querySelector("#email");
const passwordInput = document.querySelector("#password");
const form = document.querySelector("#form");

async function loadProfile() {
  const profile = await getProfile();

  console.log("PROFILE:", profile);
  console.log("IMAGE URL:", profile.img_url);

  if (!profile) return;

  const defaultImage = "../../assests/images/user-image.png";

  image.src = profile.img_url || defaultImage;
  imageInput.value = profile.img_url || "";
  fullnameInput.value = profile.full_name;
  emailInput.value = profile.email;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const payload = {
    full_name: fullnameInput.value,
    email: emailInput.value,
    img_url: imageInput.value,
    password: passwordInput.value,
  };

  const updatedProfile = await updateProfile(payload);

  if (!updatedProfile) return;

  image.src = updatedProfile.img_url || "../../assests/images/user-image.png";

  alert("Profile updated successfully");
});

loadProfile();