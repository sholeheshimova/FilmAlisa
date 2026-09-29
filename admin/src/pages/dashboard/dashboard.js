import { getDashboard } from "../../api/dashboard.js";
import "../../helpers/authGuard.js";
import "../../helpers/logout.js";

const favoritesCount = document.querySelector("#favoritesCount");
const usersCount = document.querySelector("#usersCount");
const moviesCount = document.querySelector("#moviesCount");
const commentsCount = document.querySelector("#commentsCount");
const categoriesCount = document.querySelector("#categoriesCount");
const actorsCount = document.querySelector("#actorsCount");
const contactsCount = document.querySelector("#contactsCount");

async function renderDashboard() {
  try {
    const result = await getDashboard();

    const data = result.data;

    favoritesCount.textContent = data.favorites;
    usersCount.textContent = data.users;
    moviesCount.textContent = data.movies;
    commentsCount.textContent = data.comments;
    categoriesCount.textContent = data.categories;
    actorsCount.textContent = data.actors;
    contactsCount.textContent = data.contacts;
  } catch (error) {
    console.error(error);
  }
}

renderDashboard();
