document.addEventListener("DOMContentLoaded", () => {
    const formularioContactanos = document.getElementById("formularioContactanos");

    formularioContactanos.addEventListener("submit", async (e) => {
        e.preventDefault();
        try {
            const respuesta = await fetch(formularioContactanos.action, {
                method: "POST",
                body: new FormData(formularioContactanos),
                headers: { "Accept": "application/json" }
            });
            if (respuesta.ok) {
                Swal.fire("¡Enviado!", "Su mensaje se ha enviado exitosamente", "success");
                formularioContactanos.reset();
            } else {
                Swal.fire("Error", "No se pudo enviar el formulario", "error");
            }
        } catch {
            Swal.fire("Error", "No se pudo conectar con el servidor", "error");
        }
    });
});