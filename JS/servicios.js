const API_BASE = "https://huellitas-hotel-backend.onrender.com/api";

// Giro de tarjetas estáticas definidas en el HTML
const cards = document.querySelectorAll(".card-servicios");
cards.forEach(card => {
    card.addEventListener("click", () => {
        card.classList.toggle("girada");
    });
});

// Contenedor para servicios que no tienen categoría reconocida
const contenedorServicios = document.getElementById("contenedorServicios");

async function mostrarServicios() {
    const contenedores = {
        perro: document.querySelector(".servicio-hab-collap-dog"),
        gato: document.querySelector(".servicio-hab-collap-cat"),
        ave: document.querySelector(".servicio-hab-collap-bird"),
        pequenos: document.querySelector(".servicio-hab-collap-little"),
    };

    let servicios = [];

    try {
        const res = await fetch(`${API_BASE}/servicios/disponibles`);
        if (!res.ok) throw new Error(`Error ${res.status} al obtener servicios`);
        servicios = await res.json();
    } catch (err) {
        console.error("No se pudo conectar con el backend:", err);
        Object.values(contenedores).forEach(cont => {
            if (cont) cont.innerHTML = `<p class="text-center text-muted">No se pudieron cargar los servicios. Intenta más tarde.</p>`;
        });
        return;
    }

    if (servicios.length === 0) {
        Object.values(contenedores).forEach(cont => {
            if (cont) cont.innerHTML = `<p class="text-center text-muted">Aún no hay servicios disponibles en esta categoría.</p>`;
        });
        return;
    }

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
                <img src="${imagenSrc}" class="card-room-img" id="card-room-img" alt="${servicio.nombre || ''}">
                <div class="card-body-texto" id="card-div-texto">
                    <p class="card-text card-room-title" id="card-room-parrafo">
                        ${servicio.nombre}
                    </p>
                </div>
            </div>
            <div class="card-trasera" id="card-room">
                <div class="card-body-trasero">
                    <h5 class="card-title">${servicio.nombre}</h5>
                    <p class="card-text">${servicio.descripcion || ''}</p>
                    <div class="card-footer-info">
                        <a class="precio-card">${servicio.precio ? '$' + servicio.precio.toLocaleString("es-CO") + ' / noche' : 'valor del servicio'}</a>
                        <a href="../HTML/reservas.html" class="card-link">reservar</a>
                    </div>   
                </div>
            </div>
        `;

        // 🚀 LÓGICA DE CATEGORÍAS 🚀
        // La especie viene como objeto anidado desde el backend: servicio.especie.nombre
        const nombreEspecie = (servicio.especie?.nombre || "").toLowerCase();

        let selectorContenedor = "";
        switch (nombreEspecie) {
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
            case "pequeño":
            case "pequena":
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