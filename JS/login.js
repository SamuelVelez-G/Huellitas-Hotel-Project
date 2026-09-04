const USERS_KEY = 'huellitasUsuarios';
const SESSION_KEY = 'huellitasSesion';

const authForm = document.getElementById('auth-form');
const loginTab = document.getElementById('tab-login');
const registerTab = document.getElementById('tab-register');
const nameInput = document.getElementById('name');
const nameLabel = document.getElementById('name-label');
const phoneInput = document.getElementById('phone');
const phoneLabel = document.getElementById('phone-label');

const togglePasswordBtn = document.querySelectorAll('.toggle-password');
const passworDivConfirm = document.getElementById('confirm-password-group')
const confirmPasswordInput = document.getElementById('confirm-password');
const confirmPasswordLabel = document.getElementById('confirm-password-label');

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

function mostrarAlerta(texto, tipo) {
    if (typeof Swal !== 'undefined') {
        return Swal.fire({
            icon: tipo === 'error' ? 'error' : 'success',
            text: texto,
            confirmButtonColor: '#173C2C'
        });
    }

    mostrarMensaje(texto, tipo);
    return Promise.resolve();
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

    passworDivConfirm.classList.toggle('hidden', !registro);
    confirmPasswordInput.classList.toggle('hidden', !registro);
    confirmPasswordLabel.classList.toggle('hidden', !registro);
    confirmPasswordInput.required = registro;

    submitButton.textContent = registro ? 'Crear cuenta' : 'Iniciar sesion';
    description.textContent = registro ? 'Crea tu cuenta para reservar con facilidad.' : 'Ingresa para continuar con tu reserva.';
    mostrarMensaje('', '');

     togglePasswordBtn.forEach(btn => {
        const input = btn.closest('.password-group').querySelector('input');
        const icon = btn.querySelector('i');
        input.type = 'password';
        if (icon) icon.className = 'fas fa-eye';
        btn.setAttribute('aria-label', 'Mostrar contraseña');
    });
}

function destinoDespuesDeIniciar() {
    const destino = new URLSearchParams(window.location.search).get('redirect');
    return destino || './index.html';
}

loginTab.addEventListener('click', () => cambiarModo(false));
registerTab.addEventListener('click', () => cambiarModo(true));

authForm.addEventListener('submit', function (evento) {
    evento.preventDefault();
    if (!authForm.checkValidity()) {
        authForm.reportValidity();
        mostrarAlerta('Completa los campos obligatorios.', 'error');
        return;
    }

    const email = document.getElementById('email').value.trim().toLowerCase();
    const password = document.getElementById('password').value;
    const usuarios = obtenerUsuarios();

    if (isRegistering) {
        // Validar que las contraseñas coincidan
        const confirmPassword = confirmPasswordInput.value;
        if (password !== confirmPassword) {
            mostrarAlerta('Las contraseñas no coinciden.', 'error');
            return;
        }

        if (usuarios.some(usuario => usuario.email === email)) {
            mostrarAlerta('Ese correo ya esta registrado.', 'error');
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
            mostrarAlerta('Correo o contraseña incorrectos.', 'error');
            return;
        }
        localStorage.setItem(SESSION_KEY, JSON.stringify({
            nombre: usuario.nombre,
            telefono: usuario.telefono || '',
            email: usuario.email
        }));
    }

    mostrarAlerta(isRegistering ? 'Registro exitoso.' : 'Inicio de sesión exitoso.', 'success')
        .then(() => {
            window.location.href = destinoDespuesDeIniciar();
        });
});

togglePasswordBtn.forEach(btn => {
    btn.addEventListener('click', function () {
        const passwordInput = this.closest('.password-group').querySelector('input');
        const icon = this.querySelector('i');

        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            icon.classList.replace('fa-eye', 'fa-eye-slash');
            this.setAttribute('aria-label', 'Ocultar contraseña');
        } else {
            passwordInput.type = 'password';
            icon.classList.replace('fa-eye-slash', 'fa-eye');
            this.setAttribute('aria-label', 'Mostrar contraseña');
        }
    });
});