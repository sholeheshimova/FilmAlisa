document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('videoModal');
    const frame = document.getElementById('videoFrame');
    const closeBtn = document.querySelector('.close');
    const watchBtn = document.querySelector('.btn-primary');
    const playBtn = document.getElementById('playBtn');

    const trailerUrl = 'https://www.youtube.com/embed/7R5x2R8j0VQ?autoplay=1&rel=0';

    const openModal = () => {
        if (!modal || !frame) return;
        frame.src = trailerUrl;
        modal.style.display = 'flex';
    };

    const closeModal = () => {
        if (!modal || !frame) return;
        modal.style.display = 'none';
        frame.src = '';
    };

    if (watchBtn) {
        watchBtn.addEventListener('click', openModal);
    }

    if (playBtn) {
        playBtn.addEventListener('click', openModal);
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    if (modal) {
        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                closeModal();
            }
        });
    }
});
