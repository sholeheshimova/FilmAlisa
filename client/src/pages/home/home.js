import { fetchMovies, fetchCategories } from "../../api/movies.js";

const carousel = document.querySelector(".carousel");
let dots = [];
const token = sessionStorage.getItem("user_token");

if (!token) {
    window.location.href = "../../pages/login/login.html";
}

let currentIndex = 0;

function showSlide(index) {
    if (!carousel) return;
    carousel.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((dot, idx) => {
        dot.classList.toggle("active", idx === index);
    });
}

function createDots(movies) {
    const dotsContainer = document.querySelector(".carousel-buttons");
    if (!dotsContainer) return;
    dotsContainer.innerHTML = "";

    movies.forEach((_, index) => {
        const dot = document.createElement("button");
        dot.className = `dot ${index === 0 ? "active" : ""}`;
        dot.addEventListener("click", () => {
            currentIndex = index;
            showSlide(currentIndex);
        });
        dotsContainer.appendChild(dot);
    });

    dots = Array.from(document.querySelectorAll(".dot"));
}

setInterval(() => {
    if (dots.length > 0) {
        currentIndex = (currentIndex + 1) % dots.length;
        showSlide(currentIndex);
    }
}, 5000);

// API Slider
async function getMovies() {
    try {
        const result = await fetchMovies();
        // API data 
        const moviesList = Array.isArray(result) ? result : result.data;
        const topMovies = moviesList.slice(0, 3);

        populateCarousel(topMovies);
        createDots(topMovies);
    } catch (error) {
        console.error("Karusel yüklənərkən xəta:", error.message);
    }
}

function populateCarousel(movies) {
    if (!carousel) return;
    carousel.innerHTML = "";

    movies.forEach((movie, index) => {
        const slide = document.createElement("div");
        slide.className = `slide slide-${index + 1}`;
        slide.style.backgroundImage = `url(${movie.cover_url})`;
        slide.style.backgroundSize = "cover";
        slide.style.backgroundPosition = "center";

        slide.innerHTML = `
      <div class="text-overlay">
        <span class="category">${movie.category?.name || "Movie"}</span>
        <h1>${movie.title}</h1>
        <p>${movie.overview}</p>
        <button class="watch-btn" onclick="window.open('${movie.watch_url}', '_blank')">Watch Now</button>
      </div>
    `;
        carousel.appendChild(slide);
    });
}

// GET API 
async function getMoviesByCategory() {
    try {
        const categoriesData = await fetchCategories();
        const categories = categoriesData.data || categoriesData;

        const mainContainer = document.querySelector(".main-container");
        if (!mainContainer) return;
        mainContainer.innerHTML = "";

        categories.forEach((category) => {
            if (!category.movies || category.movies.length === 0) return;

            const categorySection = document.createElement("div");
            categorySection.className = "category-section";

            const categoryHeader = document.createElement("div");
            categoryHeader.className = "category-header";

            const categoryTitle = document.createElement("p");
            categoryTitle.className = "category-P";
            categoryTitle.textContent = category.name;

            const chevronIcon = document.createElement("div");
            chevronIcon.className = "chevron-icon";

            categoryHeader.appendChild(categoryTitle);
            categoryHeader.appendChild(chevronIcon);

            const categoryCardContainer = document.createElement("div");
            categoryCardContainer.className = "category-card";

            let isDown = false;
            let startX, scrollLeft, isDrag = false, clickTimeout;

            categoryCardContainer.addEventListener("mousedown", (e) => {
                isDown = true;
                isDrag = false;
                categoryCardContainer.classList.add("active");
                startX = e.pageX - categoryCardContainer.offsetLeft;
                scrollLeft = categoryCardContainer.scrollLeft;

                clickTimeout = setTimeout(() => {
                    isDrag = true;
                    categoryCardContainer.querySelectorAll(".movie-card").forEach((card) => {
                        card.style.pointerEvents = "none";
                    });
                }, 150);
            });

            categoryCardContainer.addEventListener("mouseleave", () => {
                isDown = false;
                clearTimeout(clickTimeout);
                categoryCardContainer.classList.remove("active");
                categoryCardContainer.querySelectorAll(".movie-card").forEach((card) => {
                    card.style.pointerEvents = "auto";
                });
            });

            categoryCardContainer.addEventListener("mouseup", () => {
                isDown = false;
                clearTimeout(clickTimeout);
                categoryCardContainer.classList.remove("active");
                categoryCardContainer.querySelectorAll(".movie-card").forEach((card) => {
                    card.style.pointerEvents = "auto";
                });
            });

            categoryCardContainer.addEventListener("mousemove", (e) => {
                if (!isDown || !isDrag) return;
                e.preventDefault();
                const x = e.pageX - categoryCardContainer.offsetLeft;
                const walk = (x - startX) * 2;
                categoryCardContainer.scrollLeft = scrollLeft - walk;
            });

            category.movies.forEach((movie) => {
                const movieCard = document.createElement("div");
                movieCard.className = "movie-card";

                const movieImage = document.createElement("img");
                movieImage.src = movie.cover_url;
                movieImage.alt = movie.title;
                movieImage.className = "movie-image";
                movieImage.ondragstart = (e) => e.preventDefault();

                const movieDetails = document.createElement("div");
                movieDetails.className = "movie-details";

                const movieTitle = document.createElement("p");
                movieTitle.className = "movie-title";
                movieTitle.textContent = movie.title;

                const movieCategory = document.createElement("span");
                movieCategory.className = "movie-category";
                movieCategory.textContent = category.name;

                const movieRating = document.createElement("div");
                movieRating.className = "movie-rating";

                const starCount = Math.floor(movie.imdb / 2);
                const hasHalfStar = (movie.imdb / 2) % 1 !== 0;

                for (let i = 1; i <= 5; i++) {
                    const star = document.createElement("span");
                    star.innerHTML = "★";
                    if (i <= starCount) {
                        star.className = "star filled";
                    } else if (i === starCount + 1 && hasHalfStar) {
                        star.className = "star half";
                    } else {
                        star.className = "star";
                    }
                    movieRating.appendChild(star);
                }

                movieDetails.appendChild(movieCategory);
                movieDetails.appendChild(movieRating);
                movieDetails.appendChild(movieTitle);

                movieCard.appendChild(movieImage);
                movieCard.appendChild(movieDetails);

                movieCard.addEventListener("click", () => {
                    if (!isDrag) {
                        window.location.href = `../detail/detail.html?${movie.id}`;
                    }
                });

                categoryCardContainer.appendChild(movieCard);
            });

            categorySection.appendChild(categoryHeader);
            categorySection.appendChild(categoryCardContainer);
            mainContainer.appendChild(categorySection);
        });
    } catch (error) {
        console.error("Kateqoriya yüklənərkən xəta:", error.message);
    }
}

getMoviesByCategory();
getMovies();