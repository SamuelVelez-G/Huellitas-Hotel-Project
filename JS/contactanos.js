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
const mensajeInput = document.querySelector('#inputMensaje')
const categoriaInput = document.querySelector('#inputCategoria')


//Contenedores
const divNombre = document.querySelector('.divNombreForm');
const divApellido = document.querySelector('.divApellidoForm');
const divEmail = document.querySelector('.divInputEmail');
const divWPS = document.querySelector('.divInputTelwsp');
const divTel = document.querySelector('.divInputTel');
const divMensaje = document.querySelector('.divInputMensaje');
const divCategoria = document.querySelector('.divInputCategoria')

//Regex
const regex = {
    nombreApellidos : /^[a-zñáéíóú ]+$/i,
    correoE : /^[a-z0-9_.+-]+@[a-z0-9-]+\.[a-z0-9-.]+$/i,
    telefonos : /^\d{10}$/,
    mensaje : /^[a-zA-Z0-9ñÑáéíóúÁÉÍÓÚüÜ¿?¡!.,:;()\s-]{5,}$/
}

//Funcion
function validarCampo(input, regex, divPadre, mensaje){
    let parrafo = divPadre.querySelector('.parrafoError');
    let valor = input.value.trim();

    if(valor){
        if(regex.test(valor)){
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

    habilitarBoton()
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

correo.addEventListener('input', function(){
    validarCampo(correo, regex.correoE, divEmail, '❌Por favor ingresa un correo valido' );
    } 
)

telwps.addEventListener('input', function(){
    validarCampo(telwps, regex.telefonos, divWPS, '❌Por favor ingresa 10 numeros' );
    } 
)

tel.addEventListener('input', function(){
    validarCampo(tel, regex.telefonos, divTel, '❌Por favor ingresa 10 numeros' );
    } 
)

mensajeInput.addEventListener('input', function(){
    validarCampo(mensajeInput, regex.mensaje, divMensaje, '❌Por favor escribe tu mensaje' );
    } 
)

//Falta poner categoriaInput y agregarla al array


//Funcion validar que todos los campos estan diligenciados antes de enviar el form
const inputConsolidado = [nombreInput, apellidoInput, correo,telwps, tel, mensajeInput];

//Deshabilitar boton enviar
const btnEnviar = document.querySelector('.btn-submit-form');
btnEnviar.disabled = true;

//Funcion validar
function habilitarBoton(){
    const camposCorrectos = inputConsolidado.every(input =>
        input.classList.contains('inputCorrecto')
    );
    
    if(camposCorrectos){
        btnEnviar.disabled = false;
    }else{
        btnEnviar.disabled = true;
    }
}





