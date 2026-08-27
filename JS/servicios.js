// Giro de tarjetas estáticas definidas en el HTML
const cards = document.querySelectorAll(".card-servicios");

cards.forEach(card => {
    card.addEventListener("click", () => {
        card.classList.toggle("girada");
    });
});

// Contenedor para servicios renderizados dinámicamente desde el localStorage
const contenedorServicios = document.getElementById("contenedorServicios");

function mostrarServicios() {
    const servicios = JSON.parse(localStorage.getItem("servicios")) || [];
    contenedorServicios.innerHTML = "";

    servicios.forEach((servicio) => {
        const card = document.createElement("div");
        card.className = "card card-servicios card-little-1";
        
        // Listener para permitir la rotación de las tarjetas cargadas dinámicamente
        card.addEventListener("click", () => {
            card.classList.toggle("girada");
        });

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
                <div class="card-body-trasero">
                    <h5 class="card-title">
                        ${servicio.servicio}
                    </h5>
                    <p class="card-text">${servicio.descripcion || ''}</p>
                    <div class="card-footer-info">
                        <a class="precio-card">${servicio.precio ? '$' + servicio.precio + ' | Sesión' : 'valor del servicio'}</a>
                        <a href="../HTML/reservas.html" class="card-link">reservar</a>
                    </div>    
                </div>
            </div>
        `;
        contenedorServicios.appendChild(card);
    });
}

mostrarServicios();

// Redirección del botón final "Reserva ahora"
const botonReservaFin = document.getElementById("botonReserva");
if (botonReservaFin) {
    botonReservaFin.addEventListener("click", (e) => {
        window.location.href = "../HTML/reservas.html";
    });
}