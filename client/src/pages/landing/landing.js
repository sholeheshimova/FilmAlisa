// sing in 
function toggleAccordion(header) {
    const content = header.nextElementSibling;
    const isOpen = content.classList.contains("open");
    if (isOpen) {
        content.classList.remove("open");
        header.querySelector("span").classList.remove("rotate");
    } else {
        content.classList.add("open");
        header.querySelector("span").classList.add("rotate");
    }
}
