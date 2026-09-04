console.log("¡ESTOY EDITANDO EL ARCHIVO CORRECTO!");

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
            servicio: datosFormulario.get("servicio"),
            descripcion: datosFormulario.get("descripcion"),
            precio: Number(datosFormulario.get("precio")),
            disponibilidad: datosFormulario.get("disponibilidad"),
            categoria: datosFormulario.get("categoria"), // Guardamos la categoría
            imagen: imagenBase64 // Guardamos la imagen
        };

        servicios.push(nuevoServicio);
        localStorage.setItem("servicios", JSON.stringify(servicios));

        console.log("Array actual guardado:", servicios);
        mostrarAlerta("<strong>¡Muy bien!</strong> El servicio se ha registrado correctamente.", "success");

        formulario.reset();
    };
    
    if (archivoImagen) {
        reader.readAsDataURL(archivoImagen);
    }
});

function limpiarServicios() {
    localStorage.removeItem("servicios");
    mostrarAlerta("<strong>Listo.</strong> Los servicios se eliminaron correctamente.", "success");

    setTimeout(() => {
        location.reload();
    }, 900);
}