(() => {
    const STORAGE_KEY = "theme";
    const scriptActual = document.currentScript;
    const temaSistema = window.matchMedia("(prefers-color-scheme: dark)");

    function leerTemaGuardado() {
        try {
            return localStorage.getItem(STORAGE_KEY);
        } catch {
            return null;
        }
    }

    function guardarTema(tema) {
        try {
            localStorage.setItem(STORAGE_KEY, tema);
        } catch {
            // El tema sigue funcionando aunque el navegador bloquee localStorage.
        }
    }

    const temaInicial = leerTemaGuardado()
        || (temaSistema.matches ? "dark" : "light");

    function cargarEstilos() {
        if (document.querySelector("link[data-estilos-tema]")) return;

        const scriptUrl = scriptActual?.src
            ?? document.querySelector('script[src*="theme.js"]')?.src
            ?? window.location.href;
        const raizProyecto = new URL("../", scriptUrl);
        const estilos = document.createElement("link");
        estilos.rel = "stylesheet";
        estilos.href = new URL("CSS/theme.css", raizProyecto).href;
        estilos.dataset.estilosTema = "true";
        document.head.appendChild(estilos);
    }

    function actualizarBoton(boton, tema) {
        if (!boton) return;
        const oscuro = tema === "dark";
        boton.innerHTML = `<span aria-hidden="true">${oscuro ? "☀" : "☾"}</span>`;
        boton.setAttribute("aria-label", oscuro ? "Activar modo claro" : "Activar modo oscuro");
        boton.setAttribute("title", oscuro ? "Activar modo claro" : "Activar modo oscuro");
        boton.setAttribute("aria-pressed", String(oscuro));
    }

    function aplicarTema(tema, persistir = false) {
        const temaValido = tema === "dark" ? "dark" : "light";
        document.documentElement.setAttribute("data-bs-theme", temaValido);
        document.documentElement.style.colorScheme = temaValido;

        if (document.body) {
            document.body.classList.toggle("dark-mode", temaValido === "dark");
        }

        document.querySelectorAll("[data-theme-toggle], #btn-modo-oscuro")
            .forEach((boton) => actualizarBoton(boton, temaValido));

        if (persistir) guardarTema(temaValido);
        window.dispatchEvent(new CustomEvent("huellitas:themechange", {
            detail: { theme: temaValido }
        }));
        return temaValido;
    }

    function alternarTema() {
        const actual = document.documentElement.getAttribute("data-bs-theme");
        return aplicarTema(actual === "dark" ? "light" : "dark", true);
    }

    function conectarBoton(boton) {
        if (!boton || boton.dataset.themeBound === "true") return;
        boton.dataset.themeBound = "true";
        actualizarBoton(boton, document.documentElement.getAttribute("data-bs-theme"));
        boton.addEventListener("click", alternarTema);
    }

    cargarEstilos();
    document.documentElement.setAttribute("data-bs-theme", temaInicial);
    document.documentElement.style.colorScheme = temaInicial;

    window.HuellitasTheme = {
        apply: aplicarTema,
        toggle: alternarTema,
        connectToggle: conectarBoton,
        getTheme: () => document.documentElement.getAttribute("data-bs-theme")
    };

    const iniciar = () => {
        aplicarTema(temaInicial);
        document.querySelectorAll("[data-theme-toggle], #btn-modo-oscuro")
            .forEach(conectarBoton);
    };

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", iniciar, { once: true });
    } else {
        iniciar();
    }

    temaSistema.addEventListener?.("change", (evento) => {
        if (!leerTemaGuardado()) aplicarTema(evento.matches ? "dark" : "light");
    });
})();
