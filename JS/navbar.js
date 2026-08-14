const nav = `
<nav class="navbar navbar-expand-lg bg-body-tertiary fixed-top nav-fixed">
    <div class="container-fluid">
        <a class="navbar-brand justify-content-center">
            <img src="../IMG/pata.png" width="20" height="20" class="d-inline-block align-text-top ms-5">
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown"
            aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse mx-auto justify-content-center" id="navbarNavDropdown">
            <ul class="navbar-nav gap-3">
                <li class="nav-item">
                    <a class="nav-link" aria-current="page" href="../index.html"> Inicio</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="/HTML/acercaNosotros.html">Sobre nosotros</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="/HTML/contactanos.html">Contactanos</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="../admin.html">Reservas/Admin</a>
                </li>

            </ul>
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-person m-3 userIcon" viewBox="0 0 16 16">
            <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z"/>
          </svg>
    </div>
</nav>
`;

document.getElementById("navbar-general").innerHTML = nav;
document.body.classList.add("cargado");



//Marcar activo una pagina en el nav

const actualPage = window.location.pathname;
const linkNav = document.querySelectorAll('.nav-link');

linkNav.forEach(link => {
    let enlace = link.getAttribute("href");
    if(enlace && actualPage.endsWith(enlace.replace("./", ""))){
        link.classList.add("active")
    }    
});
