const USERS_KEY = 'huellitasUsuarios';
const SESSION_KEY = 'huellitasSesion';

const authForm = document.getElementById('auth-form');
const loginTab = document.getElementById('tab-login');
const registerTab = document.getElementById('tab-register');
const nameInput = document.getElementById('name');
const nameLabel = document.getElementById('name-label');
const phoneInput = document.getElementById('phone');
const phoneLabel = document.getElementById('phone-label');
const submitButton = document.getElementById('submit-button');
const description = document.getElementById('auth-description');
const message = document.getElementById('form-message');
let isRegistering = false;

function obtenerUsuarios() {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
}

function mostrarMensaje(texto, tipo) {
    message.textContent = texto;
    message.className = `form-message ${tipo}`;
}

function cambiarModo(registro) {
    isRegistering = registro;
    loginTab.classList.toggle('active', !registro);
    registerTab.classList.toggle('active', registro);
    loginTab.setAttribute('aria-selected', String(!registro));
    registerTab.setAttribute('aria-selected', String(registro));
    nameInput.classList.toggle('hidden', !registro);
    nameLabel.classList.toggle('hidden', !registro);
    nameInput.required = registro;
    phoneInput.classList.toggle('hidden', !registro);
    phoneLabel.classList.toggle('hidden', !registro);
    phoneInput.required = registro;
    submitButton.textContent = registro ? 'Crear cuenta' : 'Iniciar sesion';
    description.textContent = registro ? 'Crea tu cuenta para reservar con facilidad.' : 'Ingresa para continuar con tu reserva.';
    mostrarMensaje('', '');
}

function destinoDespuesDeIniciar() {
    const destino = new URLSearchParams(window.location.search).get('redirect');
    return destino || './inicio.html';
}

loginTab.addEventListener('click', () => cambiarModo(false));
registerTab.addEventListener('click', () => cambiarModo(true));

authForm.addEventListener('submit', function (evento) {
    evento.preventDefault();
    if (!authForm.checkValidity()) {
        authForm.reportValidity();
        mostrarMensaje('Completa los campos obligatorios.', 'error');
        return;
    }

    const email = document.getElementById('email').value.trim().toLowerCase();
    const password = document.getElementById('password').value;
    const usuarios = obtenerUsuarios();

    if (isRegistering) {
        if (usuarios.some(usuario => usuario.email === email)) {
            mostrarMensaje('Ese correo ya esta registrado.', 'error');
            return;
        }
        const usuario = {
            nombre: nameInput.value.trim(),
            telefono: phoneInput.value.trim(),
            email,
            password
        };
        usuarios.push(usuario);
        localStorage.setItem(USERS_KEY, JSON.stringify(usuarios));
        localStorage.setItem(SESSION_KEY, JSON.stringify({
            nombre: usuario.nombre,
            telefono: usuario.telefono,
            email: usuario.email
        }));
    } else {
        const usuario = usuarios.find(item => item.email === email && item.password === password);
        if (!usuario) {
            mostrarMensaje('Correo o contraseña incorrectos.', 'error');
            return;
        }
        localStorage.setItem(SESSION_KEY, JSON.stringify({
            nombre: usuario.nombre,
            telefono: usuario.telefono || '',
            email: usuario.email
        }));
    }

    window.location.href = destinoDespuesDeIniciar();
});
