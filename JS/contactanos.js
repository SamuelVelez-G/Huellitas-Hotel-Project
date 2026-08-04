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



//Funcion validar datos formulario
//Input
const formulario = document.querySelector('#formularioContactanos');
const nombreInput = document.querySelector('#inputNombreForm');
const apellidoInput = document.querySelector('#inputApellidoForm');
const correo = document.querySelector('#inputEmail');
const telwps = (document.querySelector('#inputTelefonoWSForm'));
const tel = (document.querySelector('#inputTelefono'));
const categoria = document.querySelector('#inputCategoria');
//Contenedores
const divNombreInput = document.querySelector('.divNombreForm');


const expresionesRegex = {
    nombreApellidos : /^[a-zñáéíóú ]+$/i,
    correoE : /^[a-z0-9_.+-]+@[a-z0-9-]+\.[a-z0-9-.]+$/i,
    telefonos : /^\d{10}$/ 
}

function validarCampos(input){
   
    switch (input){
        case input:
            if(expresionesRegex.nombreApellidos.test(input.value)){
                input.classList.remove('inputIncorrecto') 
                input.classList.add('inputCorrecto') 
                                  
            } else {
                input.classList.remove('inputCorrecto') 
                input.classList.add('inputIncorrecto');                
                let mensaje = document.createElement('p');
                mensaje.textContent= '❌Por favor ingresa solo letras'
                divNombreInput.appendChild(mensaje)
            }              
    }
}




