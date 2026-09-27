// MODAL event
const filmPoster = document.querySelector('.film-image');
const filmModal = document.querySelector('.film-modal');
const filmOverlay = document.querySelector('.film-overlay');
const filmModalOverlay = document.querySelector('.film-modal-overlay');

function openFilmModal() {
    if (!filmModal || !filmOverlay) return;

    filmModal.classList.add('active');
    filmOverlay.classList.add('active');
    document.body.classList.add('modal-open');
}

function closeFilmModal() {
    if (!filmModal || !filmOverlay || !filmModal.classList.contains('active')) return;

    filmModal.classList.add('close-animation');
    filmOverlay.classList.remove('active');

    setTimeout(() => {
        filmModal.classList.remove('active');
        filmModal.classList.remove('close-animation');
        document.body.classList.remove('modal-open');
    }, 500);
}

if (filmPoster) {
    filmPoster.addEventListener('click', openFilmModal);
}

if (filmModalOverlay) {
    filmModalOverlay.addEventListener('click', closeFilmModal);
}

if (filmOverlay) {
    filmOverlay.addEventListener('click', closeFilmModal);
}

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        closeFilmModal();
    }
});

// faworit click event

//api here


document.addEventListener("DOMContentLoaded", () => {
    const favoriteButton = document.getElementById("favorite-btn");

    if (!favoriteButton) return;

    favoriteButton.addEventListener("click", () => {
        // add\ activ-class /delete
        favoriteButton.classList.toggle("active");

        if (favoriteButton.classList.contains("active")) {
            // selected green-icon
            favoriteButton.style.border = "2px solid #00FF00";
            favoriteButton.innerHTML = `
        <svg
          viewBox="8 8 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10 16L14 20L22 12"
            stroke="#00FF00"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>`;
        } else {
            // First second !
            favoriteButton.style.border = "2px solid #fff";
            favoriteButton.innerHTML = `
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M7.2 7.2L7.2 0H8.8L8.8 7.2L16 7.2V8.8L8.8 8.8L8.8 16H7.2L7.2 8.8L0 8.8V7.2L7.2 7.2Z"
            fill="white"
          />
        </svg>`;
        }
    });
});

