(() => {
    const navbarHost = document.getElementById("navbar-general");
    if (!navbarHost) {
        document.body.classList.add("cargado");
        return;
    }

    const scriptActual = document.currentScript;
    const scriptUrl = scriptActual?.src
        ?? document.querySelector('script[src*="navbar.js"]')?.src
        ?? window.location.href;
    const raizProyecto = new URL("../", scriptUrl);
    const ruta = (archivo) => new URL(archivo, raizProyecto).href;

    const enlaces = [
        ["Inicio", "HTML/inicio.html"],
        ["Sobre nosotros", "HTML/acercaNosotros.html"],
        ["Contáctanos", "HTML/contactanos.html"],
        ["Servicios", "HTML/servicios.html"],
        ["Reservas", "HTML/reservas.html"]
    ];
    const sesionActiva = Boolean(localStorage.getItem("huellitasSesion"));
 
    if (sesionActiva && typeof Swal === "undefined") {
        const sweetAlertScript = document.createElement("script");
        sweetAlertScript.src = "https://cdn.jsdelivr.net/npm/sweetalert2@11";
        document.head.appendChild(sweetAlertScript);
    }

    navbarHost.innerHTML = `
        <nav class="navbar navbar-expand-lg fixed-top nav-fixed" aria-label="Navegación principal">
            <div class="container-fluid px-3 px-lg-5">
                <a class="navbar-brand" href="${ruta("HTML/inicio.html")}" aria-label="Ir al inicio">
                    <img src="${ruta("IMG/pata.png")}" width="24" height="24" alt="Huellitas Hotel">
                </a>

                <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
                    data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown"
                    aria-expanded="false" aria-label="Abrir menú de navegación">
                    <span class="navbar-toggler-icon"></span>
                </button>

                <div class="collapse navbar-collapse justify-content-center" id="navbarNavDropdown">
                    <ul class="navbar-nav gap-lg-3">
                        ${enlaces.map(([texto, archivo]) => `
                            <li class="nav-item">
                                <a class="nav-link" href="${ruta(archivo)}">${texto}</a>
                            </li>
                        `).join("")}
                    </ul>
                </div>

                <div class="nav-actions">
                    <button id="btn-modo-oscuro" data-theme-toggle class="theme-toggle"
                        type="button" aria-label="Cambiar tema"></button>
                    ${sesionActiva ? `
                    <button type="button" class="login-link" aria-label="Cerrar sesión">
                    ` : `
                    <a href="${ruta("HTML/login.html")}" class="login-link"
                        aria-label="Iniciar sesión o registrarse">
                    `}
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22"
                            fill="currentColor" class="userIcon" viewBox="0 0 16 16" aria-hidden="true">
                            <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z"/>
                        </svg>
                        <span class="login-text">${sesionActiva ? "Cerrar sesión" : "Iniciar sesión"}</span>
                    ${sesionActiva ? `</button>` : `</a>`}
                </div>
            </div>
        </nav>
    `;

    const paginaActual = window.location.pathname.toLowerCase();
    const loginLink = navbarHost.querySelector('.login-link');
    const paginaOrigen = window.location.pathname.split('/').pop() || 'inicio.html';
    if (!sesionActiva) {
        const loginUrl = new URL(loginLink.href);
        loginUrl.searchParams.set('redirect', paginaOrigen);
        loginLink.href = loginUrl.href;
    } else {
        loginLink.addEventListener('click', (evento) => {
            evento.preventDefault();
            localStorage.removeItem('huellitasSesion');

            const redirigirAlInicio = () => {
                window.location.href = ruta('HTML/inicio.html');
            };

            if (typeof Swal !== 'undefined') {
                Swal.fire({
                    icon: 'success',
                    text: 'Ya saliste de sesión.',
                    confirmButtonColor: '#173C2C'
                }).then(redirigirAlInicio);
            } else {
                window.alert('Ya saliste de sesión.');
                redirigirAlInicio();
            }
        });
    }

    navbarHost.querySelectorAll(".nav-link").forEach((enlace) => {
        const paginaEnlace = new URL(enlace.href).pathname.toLowerCase();
        const activo = paginaActual === paginaEnlace;
        enlace.classList.toggle("active", activo);
        if (activo) enlace.setAttribute("aria-current", "page");
    });

    const botonTema = document.getElementById("btn-modo-oscuro");
    if (window.HuellitasTheme) {
        window.HuellitasTheme.connectToggle(botonTema);
        window.HuellitasTheme.apply(window.HuellitasTheme.getTheme());
    }

    document.body.classList.add("cargado");
})();
