document.addEventListener("DOMContentLoaded", () => {

    const cards = document.querySelectorAll(".card");

    cards.forEach(card => {

        card.addEventListener("click", () => {

            // Solo funciona en celular
            if (window.innerWidth <= 768) {

                // Mostrar / ocultar descripción
                card.classList.toggle("show-description");

            }

        });

    });

});