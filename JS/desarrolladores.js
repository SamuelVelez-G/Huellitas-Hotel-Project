function openModal(element) {
    const name = element.getAttribute('data-name');
    const role = element.getAttribute('data-role');
    const desc = element.getAttribute('data-desc');
    const img = element.getAttribute('data-img');

    document.getElementById('modalName').textContent = name;
    document.getElementById('modalRole').textContent = role;
    document.getElementById('modalDesc').textContent = desc;
    document.getElementById('modalImg').src = img;

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

// --- LÓGICA DEL MENÚ DE NAVEGACIÓN ACTIVO (Nuevo) ---
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
