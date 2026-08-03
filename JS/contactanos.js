document.addEventListener("DOMContentLoaded", () => {
    const btnContactar = document.getElementById("btnContactar");

    if (btnContactar) { 
    btnContactar.addEventListener ('click',  () => {

        Swal.fire({
            title: "Entendido!",
            text: "su mensaje se ha enviado exitosamente",
            icon: "success"
        })
    })
    }else{
        Swal.fire({
            title: "subida fallida",
            text:"intentelo de nuevo"
        })
    }
})