const servicios = JSON.parse(localStorage.getItem("servicios")) || [];

const formulario = document.getElementById("formularioAdmin");
const alertaContenedor = document.getElementById("alertaContenedor");

function mostrarAlerta(mensaje, tipo) {
    alertaContenedor.innerHTML = `
        <div class="alert alert-${tipo} alert-dismissible fade show" role="alert">
            ${mensaje}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>
        </div>
    `;

    setTimeout(() => {
        alertaContenedor.innerHTML = "";
    }, 3000);
}

formulario.addEventListener("submit", function (event) {
    event.preventDefault();

    if (!formulario.checkValidity()) {
        alertaContenedor.innerHTML = `
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                <strong>¡Campos incompletos!</strong>
                Por favor, complete todos los campos obligatorios.
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `;
        formulario.reportValidity();
        return;
    }

    const datosFormulario = new FormData(formulario);
    const archivoImagen = document.getElementById("imagen").files[0];

    // Usamos FileReader para convertir la imagen a texto (Base64) y poder guardarla en localStorage
    const reader = new FileReader();

    reader.onload = function (e) {
        const imagenBase64 = e.target.result;

        const nuevoServicio = {
            id: Date.now(),
            servicio: datosFormulario.get("servicio"),
            descripcion: datosFormulario.get("descripcion"),
            precio: Number(datosFormulario.get("precio")),
            disponibilidad: datosFormulario.get("disponibilidad"),
            categoria: datosFormulario.get("categoria"),
            imagen: imagenBase64
        };
        servicios.push(nuevoServicio);
        localStorage.setItem("servicios", JSON.stringify(servicios));

        console.log("Array actual guardado:", servicios);
        mostrarAlerta("<strong>¡Muy bien!</strong> El servicio se ha registrado correctamente.", "success");

        formulario.reset();
        quitarImagen();
        limpiarSeleccionPills();

        // Refresca la lista de servicios mostrada en el panel, sin recargar la página
        if (typeof renderizarServicios === "function") {
            renderizarServicios();
        }

        setTimeout(() => {
            alertaContenedor.innerHTML = "";
        }, 3000);
    };

    if (archivoImagen) {
        reader.readAsDataURL(archivoImagen);
    }
});

function limpiarServicios() {
    localStorage.removeItem("servicios");
    alert("Servicios eliminados correctamente");
    location.reload();
}

function eliminarServicio(id) {

    Swal.fire({
        title: "¿Eliminar servicio?",
        text: "No podrás recuperarlo después.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#dc3545"
    }).then((result) => {

        if (result.isConfirmed) {

            let servicios =
                JSON.parse(localStorage.getItem("servicios")) || [];

            servicios = servicios.filter(
                servicio => servicio.id !== id
            );

            localStorage.setItem(
                "servicios",
                JSON.stringify(servicios)
            );

            location.reload();
        }
    });
}

// ============================================================
// RENDER VISUAL de la lista (misma fuente de datos: localStorage,
// solo cambia el HTML/estilo de las tarjetas)
// ============================================================
function renderizarServicios(listaAMostrar) {
    const contenedor = document.getElementById("listaServicios");
    const todos = JSON.parse(localStorage.getItem("servicios")) || [];
    const items = listaAMostrar !== undefined ? listaAMostrar : todos;

    const contador = document.getElementById("contadorServicios");
    if (contador) {
        contador.textContent = `${todos.length} ${todos.length === 1 ? "servicio" : "servicios"}`;
    }

    if (todos.length === 0) {
        contenedor.innerHTML = `
            <div class="estado-vacio" id="sinServicios">
                <div class="estado-vacio-icono">📦</div>
                <p class="fw-bold mb-1" style="font-size:.9rem;">Todavía no hay servicios</p>
                <p class="text-muted small mb-0">Completa el formulario para añadir el primero.</p>
            </div>
        `;
        return;
    }

    if (items.length === 0) {
        contenedor.innerHTML = `<p class="text-muted small text-center mt-3">No se encontraron servicios coincidentes.</p>`;
        return;
    }

    contenedor.innerHTML = items.map((s) => `
        <div class="tarjeta-servicio">
            ${s.imagen ? `<img src="${s.imagen}" alt="${s.servicio || 'Servicio'}">` : ""}
            <div class="d-flex align-items-center gap-2 mb-2 flex-wrap">
                <span class="badge-categoria-servicio">${s.categoria || ""}</span>
                <span class="${s.disponibilidad === "Disponible" ? "badge-disponible" : "badge-no-disponible"}">
                    ${s.disponibilidad || ""}
                </span>
            </div>
            <h6 class="fw-bold mb-1" style="font-size:.9rem;">${s.servicio || "(Sin nombre)"}</h6>
            <p class="text-muted small mb-2">${s.descripcion || ""}</p>
            <div class="d-flex justify-content-between align-items-center">
                <span class="precio-servicio">$${s.precio ?? ""}</span>
                <button type="button" class="btn btn-sm btn-outline-danger" onclick="eliminarServicio(${s.id})">
                    🗑️ Eliminar
                </button>
            </div>
        </div>
    `).join("");
}

// ============================================================
// Helpers solo visuales (no tocan localStorage ni el envío del form)
// ============================================================

// Buscador rápido de la lista ya renderizada
function filtrarServicios(texto) {
    const termino = texto.toLowerCase().trim();
    const todos = JSON.parse(localStorage.getItem("servicios")) || [];

    if (!termino) {
        renderizarServicios(todos);
        return;
    }

    const filtrados = todos.filter(s =>
        (s.servicio || "").toLowerCase().includes(termino) ||
        (s.categoria || "").toLowerCase().includes(termino)
    );
    renderizarServicios(filtrados);
}

// Vista previa del nombre del archivo elegido en el input de imagen
function previsualizarImagen(input) {
    const badge = document.getElementById("archivoBadge");
    const nombre = document.getElementById("archivoNombre");
    if (input.files && input.files[0]) {
        nombre.textContent = input.files[0].name;
        badge.classList.remove("d-none");
    } else {
        badge.classList.add("d-none");
    }
}

function quitarImagen() {
    const input = document.getElementById("imagen");
    if (input) input.value = "";
    const badge = document.getElementById("archivoBadge");
    if (badge) badge.classList.add("d-none");
}

// Sincroniza los botones "pill" de categoría con el <select> real
function seleccionarCategoriaPill(boton) {
    const valor = boton.getAttribute("data-valor");
    const select = document.getElementById("categoria");
    select.value = valor;

    document.querySelectorAll(".pill-categoria").forEach(p => p.classList.remove("activa"));
    boton.classList.add("activa");
}

function sincronizarPillDesdeSelect(select) {
    document.querySelectorAll(".pill-categoria").forEach(p => {
        p.classList.toggle("activa", p.getAttribute("data-valor") === select.value);
    });
}

function limpiarSeleccionPills() {
    document.querySelectorAll(".pill-categoria").forEach(p => p.classList.remove("activa"));
    const filtro = document.getElementById("filtroServicios");
    if (filtro) filtro.value = "";
}

// Pinta la lista al cargar la página (incluye después de eliminar/limpiar, que recargan la página)
document.addEventListener("DOMContentLoaded", () => renderizarServicios());