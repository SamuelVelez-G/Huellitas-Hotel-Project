const cards = document.querySelectorAll(".card-servicios");

cards.forEach(card => {
    card.addEventListener("click", () => {
        card.classList.toggle("girada");
    });
});