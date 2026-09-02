/*
 * CONFIGURACIÓN DEL AVATAR
 *
 * Para usar un solo perro en toda la página:
 * 1. Copia tu GIF, PNG, JPG o WebP dentro de la carpeta IMG.
 * 2. Escribe aquí su nombre. Ejemplo: imagenUnica: "mi-perrito.gif"
 * 3. Deja "" para volver a usar todos los movimientos originales.
 */
window.HUELLITAS_AVATAR_CONFIG = {
    imagenUnica: "",

    // Configuración avanzada: archivos usados cuando imagenUnica está vacía.
    estados: {
        normal: "perrito-normal.gif",
        hablando: "perrito-hablando.gif",
        comiendo: "perrito-comiendo.gif",
        celebrando: "perrito-celebrando.gif.gif",
        durmiendo: "perrito-durmiendo-corregido.png",
        saludando: "perrito-saludando.gif"
    },

    frases: [
        "¡Guau! Bienvenido a Hotel Huellitas 🐾💕",
        "¡Qué alegría tenerte por aquí! 🐶✨",
        "Tu peludito estará en buenas patitas ❤️",
        "¡Aquí cuidamos cada huellita con mucho amor! 🐾",
        "¿Buscas un lugar especial para tu mascota? 🏨🐶",
        "¡Estoy aquí para acompañarte! 💕",
        "En Hotel Huellitas, cada mascota es parte de la familia 🐾❤️"
    ],

    tiempos: {
        mensaje: 3800,
        saludo: 4200,
        dormir: 15000,
        accionAutomatica: 30000
    },

    movimientoAutomatico: true
};
