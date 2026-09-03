const servicios = JSON.parse(localStorage.getItem("servicios")) || [];

const formulario = document.getElementById("formularioAdmin");
const alertaContenedor = document.getElementById("alertaContenedor");

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
        alertaContenedor.innerHTML = `
            <div class="alert alert-success alert-dismissible fade show" role="alert">
                <strong>¡Muy bien!</strong> El servicio se ha registrado correctamente.
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `;

        formulario.reset();

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

function renderizarServicios() {
    const contenedor = document.getElementById("listaServicios");
    const servicios = JSON.parse(localStorage.getItem("servicios")) || [];

    if (servicios.length === 0) {
        contenedor.innerHTML = '<p id="sinServicios" class="text-muted small mb-0">Todavía no hay servicios agregados.</p>';
        return;
    }

    contenedor.innerHTML = servicios.map((s) => `
        <div class="card mb-3 shadow-sm">
            ${s.imagen ? `<img src="${s.imagen}" class="card-img-top" alt="${s.servicio || 'Servicio'}" style="max-height:120px; object-fit:cover;">` : ""}
            <div class="card-body py-2 px-3">
                <h6 class="card-title fw-bold mb-1">${s.servicio || "(Sin nombre)"}</h6>
                <p class="card-text small mb-1">${s.descripcion || ""}</p>
                <div class="d-flex justify-content-between align-items-center small text-muted mb-2">
                    <span>${s.categoria || ""}</span>
                    <span>$${s.precio ?? ""}</span>
                </div>
                <span class="badge ${s.disponibilidad === "Disponible" ? "bg-success" : "bg-secondary"} mb-2">
                    ${s.disponibilidad || ""}
                </span>
                <div>
                    <button type="button" class="btn btn-sm btn-outline-danger w-100" onclick="eliminarServicio(${s.id})">
                        🗑️ Eliminar
                    </button>
                </div>
            </div>
        </div>
    `).join("");
}

// Pinta la lista al cargar la página (incluye después de eliminar/limpiar, que recargan la página)
document.addEventListener("DOMContentLoaded", renderizarServicios);