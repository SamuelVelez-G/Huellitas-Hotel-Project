const servicios = JSON.parse(localStorage.getItem("servicios")) || [];

const formulario = document.getElementById("formularioAdmin");

formulario.addEventListener("submit", function(event) {

    event.preventDefault();

    const servicio = document.getElementById("servicio").value;
    const cliente = document.getElementById("cliente").value;
    const numero = document.getElementById("numero").value;
    const mascota = document.getElementById("mascota").value;
    const descripcion = document.getElementById("descripcion").value;
    const fecha = document.getElementById("fecha").value;
    const precio = document.getElementById("precio").value;
    const disponibilidad = document.getElementById("disponibilidad").value;

    const nuevoServicio = {
        servicio: servicio,
        cliente: cliente,
        numero: numero,
        mascota: mascota,
        descripcion: descripcion,
        fecha: fecha,
        precio: Number(precio),
        disponibilidad: disponibilidad
    };

    servicios.push(nuevoServicio);

    localStorage.setItem("servicios", JSON.stringify(servicios));

    console.log(JSON.stringify(servicios, null, 2));

    const contenedorAlerta = document.getElementById("alertaContenedor");

    contenedorAlerta.innerHTML = `
        <div class="alert alert-success alert-dismissible fade show" role="alert">
            El servicio se ha registrado correctamente. </div>`;

    formulario.reset();

    setTimeout(() => {

        const alerta = contenedorAlerta.querySelector(".alert");

        if (alerta) {
            alerta.remove();
        }

    }, 3000);

});