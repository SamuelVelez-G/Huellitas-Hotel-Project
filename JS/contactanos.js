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
const nombreInput = document.querySelector('#inputNombreForm');
const apellidoInput = document.querySelector('#inputApellidoForm');
const correo = document.querySelector('#inputEmail');
const telwps = (document.querySelector('#inputTelefonoWSForm'));
const tel = (document.querySelector('#inputTelefono'));

//Contenedores
const divNombre = document.querySelector('.divNombreForm');
const divApellido = document.querySelector('.divApellidoForm');
const divEmail = document.querySelector('.divInputEmail');
const divWPS = document.querySelector('.divInputTelwsp');
const divTel = document.querySelector('.divInputTel');
const divMensaje = document.querySelector('.divInputMensaje');

//Regex
const regex = {
    nombreApellidos : /^[a-zñáéíóú ]+$/i,
    correoE : /^[a-z0-9_.+-]+@[a-z0-9-]+\.[a-z0-9-.]+$/i,
    telefonos : /^\d{10}$/ 
}

//Funcion
function validarCampo(input, regex, divPadre, mensaje){
    let parrafo = divPadre.querySelector('.parrafoError');

    if(input.value.trim()){
        if(regex.test(input.value.trim())){
            input.classList.remove('inputIncorrecto'); 
            input.classList.add('inputCorrecto');
            if(parrafo !== null){
                parrafo.remove();            
            }
            
        } else {
            input.classList.remove('inputCorrecto') 
            input.classList.add('inputIncorrecto'); 
            if(parrafo === null){
                let nuevoParrafo = document.createElement('p');
                nuevoParrafo.classList.add('parrafoError');             
                nuevoParrafo.textContent= mensaje;
                divPadre.appendChild(nuevoParrafo)
            } else {
                parrafo.textContent= mensaje;
            }                 
        }
    }else {
        input.classList.remove('inputIncorrecto');
        input.classList.remove('inputCorrecto');
        if(parrafo){
            parrafo.remove(); 
        }        
    }
}


//Aplicacion de la  funcion
nombreInput.addEventListener('keyup', function(){
    validarCampo(nombreInput, regex.nombreApellidos, divNombre, '❌Por favor ingresa solo letras' );
    } 
)

apellidoInput.addEventListener('keyup', function(){
    validarCampo(apellidoInput, regex.nombreApellidos, divApellido, '❌Por favor ingresa solo letras' );
    } 
)

correo.addEventListener('blur', function(){
    validarCampo(correo, regex.correoE, divEmail, '❌Por favor ingresa un correo valido' );
    } 
)

telwps.addEventListener('keyup', function(){
    validarCampo(telwps, regex.telefonos, divWPS, '❌Por favor ingresa solo numeros' );
    } 
)

tel.addEventListener('keyup', function(){
    validarCampo(tel, regex.telefonos, divTel, '❌Por favor ingresa solo numeros' );
    } 
)

tel.addEventListener('keyup', function(){
    validarCampo(tel, regex.telefonos, divTel, '❌Por favor ingresa solo numeros' );
    } 
)





