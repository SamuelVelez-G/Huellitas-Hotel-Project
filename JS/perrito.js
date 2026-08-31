document.addEventListener("DOMContentLoaded", () => {

    const contenedor = document.createElement("div");
    contenedor.id = "perrito-contenedor";
    contenedor.innerHTML = `
        <div id="perrito-burbuja" class="burbuja-texto"></div>
        <img
            id="perrito-img"
            src="img/perrito-normal.gif"
            alt="Perrito acompañante"
        >
    `;
    document.body.appendChild(contenedor);

    // ESTILOS DE POSICIÓN Y CONTENEDOR
    Object.assign(contenedor.style, {
        position: "fixed",
        bottom: "20px",
        right: "20px",
        zIndex: "999999",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        userSelect: "none"
    });

    const perritoImg = document.getElementById("perrito-img");
    const burbuja = document.getElementById("perrito-burbuja");

    // ESTILO LIMPIO DEL PERRITO
    Object.assign(perritoImg.style, {
        width: "120px",
        height: "auto",
        cursor: "pointer",
        display: "block",
        transition: "transform 0.2s ease"
    });

    // ESTILO DE LA BURBUJA (Oculta por defecto hasta el clic)
    Object.assign(burbuja.style, {
        background: "#ffffff",
        color: "#4a2e80",
        border: "2px solid #8e52e0",
        padding: "8px 12px",
        borderRadius: "12px",
        marginBottom: "8px",
        maxWidth: "200px",
        fontSize: "13px",
        fontWeight: "bold",
        textAlign: "center",
        boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
        opacity: "0",
        transform: "translateY(10px)",
        transition: "opacity 0.3s ease, transform 0.3s ease",
        pointerEvents: "none"
    });

    // EFECTO AL PASAR EL MOUSE
    perritoImg.addEventListener("mouseenter", () => perritoImg.style.transform = "scale(1.1)");
    perritoImg.addEventListener("mouseleave", () => perritoImg.style.transform = "scale(1)");

    // RUTA DE GIFS Y FRASES
    const estados = {
        normal: "img/perrito-normal.gif",
        hablando: "img/perrito-hablando.gif",
        comiendo: "img/perrito-comiendo.gif",
        caminando: "img/perrito-caminando.gif",
        durmiendo: "img/perrito-durmiendo.gif"
    };

    const frases = [
        "¡Guau! Bienvenido a Hotel Huellitas 🐾💜",
        "¡Qué alegría tenerte por aquí! 🐶✨",
        "Tu peludito estará en buenas patitas ❤️",
        "¡Aquí cuidamos cada huellita con mucho amor! 🐾",
        "¿Buscas un lugar especial para tu mascota? 🏨🐶",
        "¡Estoy aquí para acompañarte! 💜",
        "En Hotel Huellitas, cada mascota es parte de la familia 🐾❤️"
    ];

    let tiempoOcultarMensaje;
    let tiempoDormir;
    let tiempoAccionTemporal;
    let estadoActual = "normal";

    function cambiarEstado(nuevoEstado) {
        if (!estados[nuevoEstado]) return;
        estadoActual = nuevoEstado;
        perritoImg.src = estados[nuevoEstado];
    }

    function mostrarMensajeTemporal(mensaje) {
        clearTimeout(tiempoOcultarMensaje);
        
        burbuja.textContent = mensaje;
        burbuja.style.opacity = "1";
        burbuja.style.transform = "translateY(0)";

        // Oculta el mensaje a los 3.5 segundos
        tiempoOcultarMensaje = setTimeout(() => {
            burbuja.style.opacity = "0";
            burbuja.style.transform = "translateY(10px)";
        }, 3500);
    }

    function reiniciarTiempoDormir() {
        clearTimeout(tiempoDormir);
        tiempoDormir = setTimeout(() => {
            cambiarEstado("durmiendo");
        }, 15000);
    }

    // EVENTO DE CLIC: MUESTRA EL TEXTO Y CAMBIA DE GIF
    perritoImg.addEventListener("click", () => {
        clearTimeout(tiempoAccionTemporal);

        // 1. Muestra una frase aleatoria
        const fraseAleatoria = frases[Math.floor(Math.random() * frases.length)];
        mostrarMensajeTemporal(fraseAleatoria);

        // 2. Cambia el estado del perrito
        cambiarEstado("comiendo");

        // 3. Vuelve al GIF normal a los 2.5 segundos
        tiempoAccionTemporal = setTimeout(() => {
            cambiarEstado("normal");
        }, 2500);

        reiniciarTiempoDormir();
    });

    // CAMINATA AUTOMÁTICA
    setInterval(() => {
        if (estadoActual === "comiendo") return;

        cambiarEstado("caminando");
        setTimeout(() => {
            cambiarEstado("normal");
            reiniciarTiempoDormir();
        }, 6000);
    }, 30000);

    reiniciarTiempoDormir();
});