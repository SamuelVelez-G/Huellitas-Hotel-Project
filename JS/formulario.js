console.log("¡ESTOY EDITANDO EL ARCHIVO CORRECTO!");

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
        alertaContenedor.innerHTML = `
            <div class="alert alert-success alert-dismissible fade show" role="alert">
                <strong>¡Muy bien!</strong> El servicio se ha registrado correctamente.
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `;

        formulario.reset();

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