const cards = document.querySelectorAll(".card-servicios");

cards.forEach(card => {
    card.addEventListener("click", () => {
        card.classList.toggle("girada");
    });
});

const contenedorServicios = document.getElementById("contenedorServicios");

function mostrarServicios() {
    const servicios = JSON.parse(localStorage.getItem("servicios")) || [];
    contenedorServicios.innerHTML = "";
    servicios.forEach((servicio) => {

        const card = document.createElement("div");
        card.className = "card card-servicios card-little-1";
        card.innerHTML = `
            
            <div class="card-delantera" id="card-room">
                <img 
                    src="../IMG/imagenes-servicios/habitaciones/little-luxury.png" 
                    class="card-room-img"
                    id="card-room-img"
                    alt="..."
                >
                <div class="card-body-texto" id="card-div-texto">

                    <p class="card-text card-room-title" id="card-room-parrafo">
                        ${servicio.servicio}
                    </p>
                </div>
            </div>
            <div class="card-trasera" id="card-room">
                <div>
                    <h5 class="card-title">
                        ${servicio.servicio}
                    </h5>
                    <p class="card-text">
                        ${servicio.descripcion}
                    </p>
                    <a class="precio-card">
                        $${Number(servicio.precio).toLocaleString("es-CO")}
                    </a>
                    <a 
                        href="../HTML/reservas.html" 
                        class="card-link"
                    >
                        reservar
                    </a>
                </div>
            </div>
        `;

        contenedorServicios.appendChild(card);
        // Giro de la card
        card.addEventListener("click", function () {
            card.classList.toggle("girada");
        });

    });
}

mostrarServicios();