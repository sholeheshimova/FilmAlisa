document.addEventListener("DOMContentLoaded", () => {
    const loader = document.getElementById("page-loader");
    const mainContent = document.getElementById("main-content");

    // loader 1s.
    setTimeout(() => {
        // delete after 1sec:
        if (loader) {
            loader.remove();
        }
        // show home page (1s)
        if (mainContent) {
            mainContent.style.display = "block";
        }
    }, 1000);
});