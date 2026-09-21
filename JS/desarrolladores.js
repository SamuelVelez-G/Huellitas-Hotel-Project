function openModal(element) {
    const name = element.getAttribute('data-name');
    const role = element.getAttribute('data-role');
    const desc = element.getAttribute('data-desc');
    const img = element.getAttribute('data-img');
    const github = element.getAttribute('data-github');
    const linkedin = element.getAttribute('data-linkedin');

    document.getElementById('modalName').textContent = name;
    document.getElementById('modalRole').textContent = role;
    document.getElementById('modalDesc').textContent = desc;
    document.getElementById('modalImg').src = img;

    // Obtener los botones del modal
    const btnGithub = document.getElementById('modalGithub');
    const btnLinkedin = document.getElementById('modalLinkedin');

    // Configurar botón de GitHub
    if (github) {
        btnGithub.href = github;
        btnGithub.style.display = ''; // Restaura el display original del CSS
    } else {
        btnGithub.style.display = 'none'; // Lo oculta si no hay enlace
    }

    // Configurar botón de LinkedIn
    if (linkedin) {
        btnLinkedin.href = linkedin;
        btnLinkedin.style.display = ''; 
    } else {
        btnLinkedin.style.display = 'none'; 
    }

    document.getElementById('teamModal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('teamModal').style.display = 'none';
}

window.onclick = function (event) {
    const modal = document.getElementById('teamModal');
    if (event.target == modal) {
        closeModal();
    }
}

// --- LÓGICA DEL MENÚ DE NAVEGACIÓN ACTIVO ---
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('nav ul li a');

const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.5 // Se activa cuando la sección es visible al 50%
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            // Remover la clase 'active' de todos los enlaces
            navLinks.forEach(link => {
                link.classList.remove('active');
                // Agregar la clase 'active' al enlace correspondiente
                if (link.getAttribute('href') === `#${id}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}, observerOptions);

// Observar cada sección
sections.forEach(section => {
    observer.observe(section);
});