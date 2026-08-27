const SESSION_KEY = 'huellitasSesion';
const RESERVATIONS_KEY = 'huellitasReservas';
const reservationForm = document.getElementById('reservation-form');
const reservationMessage = document.getElementById('reservation-message');

reservationForm.addEventListener('submit', function (evento) {
    evento.preventDefault();
    const session = JSON.parse(localStorage.getItem(SESSION_KEY));

    if (!session) {
        window.location.href = './login.html?redirect=reservas.html';
        return;
    }

    const reservations = JSON.parse(localStorage.getItem(RESERVATIONS_KEY)) || [];
    reservations.push({
        usuario: session.email,
        mascota: document.getElementById('pet-name').value.trim(),
        servicio: document.getElementById('service').value,
        fecha: document.getElementById('reservation-date').value
    });
    localStorage.setItem(RESERVATIONS_KEY, JSON.stringify(reservations));
    reservationMessage.textContent = `Reserva confirmada para ${session.nombre || session.email}.`;
    reservationMessage.style.color = '#357347';
    reservationForm.reset();
});
