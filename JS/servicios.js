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
    
    // Opcional: limpiar los contenedores dinámicos antes de cargar si vas a recargar múltiples veces
    // (No borramos el HTML inicial de los estáticos para no romperlos)

    servicios.forEach((servicio) => {
        const card = document.createElement("div");
        card.className = "card card-servicios";
        
        // Listener para permitir la rotación de las tarjetas cargadas dinámicamente
        card.addEventListener("click", () => {
            card.classList.toggle("girada");
        });

        // Verificamos si tiene imagen propia, sino ponemos una por defecto
        const imagenSrc = servicio.imagen ? servicio.imagen : "../IMG/imagenes-servicios/limpieza_inicio.png";

        card.innerHTML = `
            <div class="card-delantera" id="card-room">
                <img src="${imagenSrc}" class="card-room-img" id="card-room-img" alt="...">
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
                        <a class="precio-card">${servicio.precio ? '$' + servicio.precio + ' / noche' : 'valor del servicio'}</a>
                        <a href="../HTML/reservas.html" class="card-link">reservar</a>
                    </div>   
                </div>
            </div>
        `;
        
        // 🚀 LÓGICA DE CATEGORÍAS 🚀
        // Dependiendo del animal, elegimos en qué contenedor inyectar la tarjeta
        let selectorContenedor = "";
        
        switch (servicio.categoria) {
            case "perro":
                selectorContenedor = ".servicio-hab-collap-dog";
                break;
            case "gato":
                selectorContenedor = ".servicio-hab-collap-cat";
                break;
            case "ave":
                selectorContenedor = ".servicio-hab-collap-bird";
                break;
            case "pequenos":
                selectorContenedor = ".servicio-hab-collap-little";
                break;
            default:
                // Si por alguna razón no tiene categoría, lo manda a los servicios adicionales de abajo
                selectorContenedor = "#contenedorServicios"; 
                break;
        }

        const contenedorDestino = document.querySelector(selectorContenedor);
        
        if (contenedorDestino) {
            contenedorDestino.appendChild(card);
        }
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