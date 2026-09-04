(() => {
    const scriptActual = document.currentScript;
    const scriptUrl = scriptActual?.src
        ?? document.querySelector('script[src*="perrito.js"]')?.src
        ?? window.location.href;
    const raizProyecto = new URL("../", scriptUrl);

    const configuracionPredeterminada = {
        imagenUnica: "",
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
            duracionEstado: 5000,
            accionAutomatica: 30000
        },
        movimientoAutomatico: true
    };

    function cargarConfiguracion() {
        if (window.HUELLITAS_AVATAR_CONFIG) return Promise.resolve();

        const configuracionExistente = document.querySelector('script[data-configuracion-perrito]');
        if (configuracionExistente) {
            return new Promise((resolver) => {
                configuracionExistente.addEventListener("load", resolver, { once: true });
                configuracionExistente.addEventListener("error", resolver, { once: true });
            });
        }

        return new Promise((resolver) => {
            const scriptConfiguracion = document.createElement("script");
            scriptConfiguracion.src = new URL("JS/perrito.config.js", raizProyecto).href;
            scriptConfiguracion.dataset.configuracionPerrito = "true";
            scriptConfiguracion.addEventListener("load", resolver, { once: true });
            scriptConfiguracion.addEventListener("error", resolver, { once: true });
            document.head.appendChild(scriptConfiguracion);
        });
    }

    function obtenerConfiguracion() {
        const personalizada = window.HUELLITAS_AVATAR_CONFIG ?? {};
        const frasesPersonalizadas = Array.isArray(personalizada.frases)
            ? personalizada.frases.filter((frase) => typeof frase === "string" && frase.trim())
            : [];

        return {
            ...configuracionPredeterminada,
            ...personalizada,
            imagenUnica: typeof personalizada.imagenUnica === "string"
                ? personalizada.imagenUnica.trim()
                : "",
            estados: {
                ...configuracionPredeterminada.estados,
                ...(personalizada.estados ?? {})
            },
            frases: frasesPersonalizadas.length
                ? frasesPersonalizadas
                : configuracionPredeterminada.frases,
            tiempos: {
                ...configuracionPredeterminada.tiempos,
                ...(personalizada.tiempos ?? {})
            }
        };
    }

    function iniciarPerrito() {
        if (document.getElementById("perrito-contenedor")) return;

        const configuracion = obtenerConfiguracion();
        const rutaImagen = (archivo) => new URL(`IMG/${archivo}`, raizProyecto).href;
        const archivoParaEstado = (estado) => configuracion.imagenUnica || configuracion.estados[estado];

        // El componente carga su propio CSS para poder incluirlo con un solo script.
        if (!document.querySelector('link[data-estilos-perrito]')) {
            const estilos = document.createElement("link");
            estilos.rel = "stylesheet";
            estilos.href = new URL("CSS/perrito.css", raizProyecto).href;
            estilos.dataset.estilosPerrito = "true";
            document.head.appendChild(estilos);
        }

        const contenedor = document.createElement("aside");
        contenedor.id = "perrito-contenedor";
        contenedor.setAttribute("aria-label", "Asistente de Huellitas Hotel");
        contenedor.innerHTML = `
            <div id="perrito-burbuja" class="burbuja-texto" role="status" aria-live="polite"></div>
            <img
                id="perrito-img"
                src="${rutaImagen(archivoParaEstado("saludando"))}"
                alt="Perrito acompañante de Huellitas Hotel"
                role="button"
                tabindex="0"
                data-estado="saludando"
                data-imagen-unica="${Boolean(configuracion.imagenUnica)}"
                aria-label="Cambiar estado del perrito"
            >
        `;
        document.body.appendChild(contenedor);

        const perritoImg = contenedor.querySelector("#perrito-img");
        const burbuja = contenedor.querySelector("#perrito-burbuja");
        const frases = configuracion.frases;

        let estadoActual = "saludando";
        let mensajeAnterior = -1;
        let estadosPendientes = [];
        let accionEnCurso = false;
        let tiempoAccion;
        let tiempoOcultarMensaje;

        function cambiarEstado(nuevoEstado) {
            const estadoVisual = nuevoEstado === "caminando" ? "normal" : nuevoEstado;
            const archivo = archivoParaEstado(estadoVisual);
            if (!archivo) return;

            estadoActual = nuevoEstado;
            perritoImg.dataset.estado = nuevoEstado;
            perritoImg.classList.remove("perrito-caminando");
            perritoImg.src = rutaImagen(archivo);

            if (nuevoEstado === "caminando") {
                void perritoImg.offsetWidth;
                perritoImg.classList.add("perrito-caminando");
            }
        }

        function ocultarMensaje() {
            burbuja.classList.remove("burbuja-visible");
        }

        function mostrarMensajeTemporal(mensaje, duracion = configuracion.tiempos.mensaje) {
            clearTimeout(tiempoOcultarMensaje);
            burbuja.textContent = mensaje;
            burbuja.classList.add("burbuja-visible");
            tiempoOcultarMensaje = setTimeout(ocultarMensaje, duracion);
        }

        function fraseAleatoria() {
            let indice;
            do {
                indice = Math.floor(Math.random() * frases.length);
            } while (frases.length > 1 && indice === mensajeAnterior);
            mensajeAnterior = indice;
            return frases[indice];
        }

        function siguienteEstado() {
            if (!estadosPendientes.length) {
                estadosPendientes = ["saludando", "caminando", "hablando", "comiendo", "celebrando", "durmiendo"]
                    .sort(() => Math.random() - 0.5);
            }

            return estadosPendientes.pop();
        }

        function celebrar() {
            clearTimeout(tiempoAccion);
            accionEnCurso = true;
            cambiarEstado("celebrando");
            mostrarMensajeTemporal("¡Reserva confirmada! ¡Estamos celebrando!", configuracion.tiempos.duracionEstado);
            tiempoAccion = setTimeout(() => {
                accionEnCurso = false;
                if (configuracion.movimientoAutomatico) {
                    mostrarEstadoAleatorio();
                } else {
                    cambiarEstado("normal");
                }
            }, configuracion.tiempos.duracionEstado);
        }

        window.HuellitasPerrito = { celebrar };

        function mostrarEstadoAleatorio() {
            if (document.hidden) {
                tiempoAccion = setTimeout(mostrarEstadoAleatorio, configuracion.tiempos.duracionEstado);
                return;
            }

            accionEnCurso = true;
            cambiarEstado(siguienteEstado());
            mostrarMensajeTemporal(fraseAleatoria(), configuracion.tiempos.duracionEstado);
            tiempoAccion = setTimeout(() => {
                accionEnCurso = false;
                mostrarEstadoAleatorio();
            }, configuracion.tiempos.duracionEstado);
        }

        function activarEstadoPorInteraccion() {
            clearTimeout(tiempoAccion);
            accionEnCurso = false;
            mostrarEstadoAleatorio();
        }

        perritoImg.addEventListener("click", activarEstadoPorInteraccion);
        perritoImg.addEventListener("keydown", (evento) => {
            if (evento.key === "Enter" || evento.key === " ") {
                evento.preventDefault();
                activarEstadoPorInteraccion();
            }
        });

        if (configuracion.movimientoAutomatico) {
            mostrarEstadoAleatorio();
        } else {
            mostrarMensajeTemporal(fraseAleatoria(), configuracion.tiempos.duracionEstado);
        }
    }

    function prepararPerrito() {
        cargarConfiguracion().finally(iniciarPerrito);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", prepararPerrito, { once: true });
    } else {
        prepararPerrito();
    }
})();
