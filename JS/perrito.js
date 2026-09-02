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
            celebrando: "perrito-celebrando.gif",
            durmiendo: "perrito-durmiendo.gif",
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
                aria-label="Hablar con el perrito acompañante"
            >
        `;
        document.body.appendChild(contenedor);

        const perritoImg = contenedor.querySelector("#perrito-img");
        const burbuja = contenedor.querySelector("#perrito-burbuja");
        const frases = configuracion.frases;

        let estadoActual = "saludando";
        let mensajeAnterior = -1;
        let accionEnCurso = false;
        let tiempoAccion;
        let tiempoDormir;
        let tiempoOcultarMensaje;
        let turnoAutomatico = 0;

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

        function programarSueno() {
            clearTimeout(tiempoDormir);
            tiempoDormir = setTimeout(() => {
                if (!accionEnCurso) cambiarEstado("durmiendo");
            }, configuracion.tiempos.dormir);
        }

        function finalizarAccion(demora = 3200) {
            clearTimeout(tiempoAccion);
            tiempoAccion = setTimeout(() => {
                accionEnCurso = false;
                cambiarEstado("normal");
                programarSueno();
            }, demora);
        }

        function hablar() {
            clearTimeout(tiempoAccion);
            clearTimeout(tiempoDormir);
            accionEnCurso = true;
            cambiarEstado("hablando");
            mostrarMensajeTemporal(fraseAleatoria());
            finalizarAccion();
        }

        function despertar() {
            if (estadoActual !== "durmiendo") return;
            cambiarEstado("normal");
            programarSueno();
        }

        perritoImg.addEventListener("click", hablar);
        perritoImg.addEventListener("mouseenter", despertar);
        perritoImg.addEventListener("keydown", (evento) => {
            if (evento.key === "Enter" || evento.key === " ") {
                evento.preventDefault();
                hablar();
            }
        });

        if (configuracion.movimientoAutomatico) {
            window.setInterval(() => {
                if (accionEnCurso || document.hidden) return;

                clearTimeout(tiempoDormir);
                accionEnCurso = true;
                ocultarMensaje();

                const acciones = ["caminando", "comiendo", "celebrando"];
                const accion = acciones[turnoAutomatico % acciones.length];
                turnoAutomatico += 1;
                cambiarEstado(accion);
                finalizarAccion(accion === "caminando" ? 6000 : 3500);
            }, configuracion.tiempos.accionAutomatica);
        }

        mostrarMensajeTemporal(frases[0], configuracion.tiempos.saludo);
        finalizarAccion(configuracion.tiempos.saludo);
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
