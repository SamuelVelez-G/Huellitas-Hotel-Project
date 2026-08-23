const servicios = JSON.parse(localStorage.getItem("servicios")) || [];

const formulario = document.getElementById("formularioAdmin");
const alertaContenedor = document.getElementById("alertaContenedor");

formulario.addEventListener("submit", function (event) {

    event.preventDefault();

    // Validar campos obligatorios
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

    // Obtener datos
    const servicio = document.getElementById("servicio").value;
    const descripcion = document.getElementById("descripcion").value;
    const precio = document.getElementById("precio").value;
    const disponibilidad = document.getElementById("disponibilidad").value;

    // Crear servicio
    const nuevoServicio = {
        servicio: servicio,
        descripcion: descripcion,
        precio: Number(precio),
        disponibilidad: disponibilidad
    };

    // Guardar en localStorage
    servicios.push(nuevoServicio);

    localStorage.setItem("servicios", JSON.stringify(servicios));

    console.log("Array actual:", servicios);
    console.log("Guardado en localStorage:", localStorage.getItem("servicios"));

    // Mostrar alerta de éxito
    alertaContenedor.innerHTML = `
        <div class="alert alert-success alert-dismissible fade show" role="alert">
            <strong>¡Muy bien!</strong> El servicio se ha registrado correctamente.
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;

    // Limpiar formulario
    formulario.reset();

    // Quitar alerta después de 3 segundos
    setTimeout(() => {
        alertaContenedor.innerHTML = "";
    }, 3000);
});

function limpiarServicios() {
    localStorage.removeItem("servicios");

    alert("Servicios eliminados correctamente");
}