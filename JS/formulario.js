// ============================================================
// 0. CONFIGURACIÓN DE CONEXIÓN CON LA API
// ============================================================
const API_BASE = "https://huellitas-hotel-backend.onrender.com/api";
const TOKEN_KEY = "authToken"; // ⚠️ ajusta esto si guardas el token con otro nombre

// Mapa temporal categoría → ID de especie real en tu base de datos.
// Ajusta estos números según los IDs que te devolvió Postman al crear cada especie.
const MAPA_ESPECIE_ID = {
    perro: 1,
    gato: 2,
    ave: 3,
    pequenos: 4
};

function obtenerToken() {
    return localStorage.getItem(TOKEN_KEY);
}

function headersConAuth(extra = {}) {
    const token = obtenerToken();
    return {
        "Content-Type": "application/json",
        ...(token ? { "Authorization": `Bearer ${token}` } : {}),
        ...extra
    };
}

async function manejarRespuesta(res) {
    if (res.status === 401 || res.status === 403) {
        mostrarAlerta("<strong>Sesión no válida.</strong> Debes iniciar sesión como administrador para hacer esto.", "danger");
        throw new Error("No autorizado");
    }
    if (!res.ok) {
        let mensaje = "Ocurrió un error al comunicarse con el servidor.";
        try {
            const cuerpo = await res.json();
            if (cuerpo.message) mensaje = cuerpo.message;
        } catch (_) { /* el body no era JSON, seguimos con el mensaje genérico */ }
        throw new Error(mensaje);
    }
    if (res.status === 204) return null; // sin contenido (típico de DELETE)
    return res.json();
}

// ============================================================
// 1. GESTIÓN DE SERVICIOS (CRUD CONECTADO A LA API)
// ============================================================
const formulario = document.getElementById("formularioAdmin");
const alertaContenedor = document.getElementById("alertaContenedor");

let editandoServicioId = null;
let serviciosCache = []; // copia local para filtrar/renderizar sin volver a pedir a la API

function mostrarAlerta(mensaje, tipo) {
    if (!alertaContenedor) return;
    alertaContenedor.innerHTML = `
        <div class="alert alert-${tipo} alert-dismissible fade show" role="alert">
            ${mensaje}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>
        </div>
    `;
    setTimeout(() => {
        alertaContenedor.innerHTML = "";
    }, 3000);
}

async function obtenerServiciosAPI() {
    const res = await fetch(`${API_BASE}/servicios`, { headers: headersConAuth() });
    return manejarRespuesta(res);
}

async function crearServicioAPI(payload) {
    const res = await fetch(`${API_BASE}/servicios`, {
        method: "POST",
        headers: headersConAuth(),
        body: JSON.stringify(payload)
    });
    return manejarRespuesta(res);
}

async function actualizarServicioAPI(id, payload) {
    const res = await fetch(`${API_BASE}/servicios/${id}`, {
        method: "PUT",
        headers: headersConAuth(),
        body: JSON.stringify(payload)
    });
    return manejarRespuesta(res);
}

async function eliminarServicioAPI(id) {
    const res = await fetch(`${API_BASE}/servicios/${id}`, {
        method: "DELETE",
        headers: headersConAuth()
    });
    return manejarRespuesta(res);
}

if (formulario) {
    formulario.addEventListener("submit", async function (event) {
        event.preventDefault();

        if (!formulario.checkValidity()) {
            mostrarAlerta("<strong>¡Campos incompletos!</strong> Por favor, complete todos los campos obligatorios.", "danger");
            formulario.reportValidity();
            return;
        }

        const datosFormulario = new FormData(formulario);
        const archivoImagen = document.getElementById("imagen").files[0];
        const categoria = datosFormulario.get("categoria");

        async function guardarYFinalizar(imagenFinal) {
            const payload = {
                nombre: datosFormulario.get("servicio"),
                descripcion: datosFormulario.get("descripcion"),
                precio: Number(datosFormulario.get("precio")),
                disponible: datosFormulario.get("disponibilidad") === "Disponible",
                imagen: imagenFinal,
                fechaCreacion: editandoServicioId !== null
                    ? serviciosCache.find(s => s.id === editandoServicioId)?.fechaCreacion
                    : new Date().toISOString(),
                especie: { id: MAPA_ESPECIE_ID[categoria] ?? null }
            };

            try {
                if (editandoServicioId !== null) {
                    await actualizarServicioAPI(editandoServicioId, payload);
                    mostrarAlerta("<strong>¡Actualizado!</strong> El servicio se ha modificado correctamente.", "success");
                    editandoServicioId = null;
                    const btnSubmit = document.querySelector("#formularioAdmin button[type='submit']");
                    if (btnSubmit) {
                        btnSubmit.textContent = "Agregar servicio";
                        btnSubmit.classList.remove("btn-warning");
                    }
                } else {
                    await crearServicioAPI(payload);
                    mostrarAlerta("<strong>¡Muy bien!</strong> El servicio se ha registrado correctamente.", "success");
                }

                const inputImagen = document.getElementById("imagen");
                if (inputImagen) inputImagen.required = true;

                formulario.reset();
                quitarImagen();
                limpiarSeleccionPills();
                await renderizarServicios();
                await cargarDatosReales();
            } catch (err) {
                if (err.message !== "No autorizado") {
                    mostrarAlerta(`<strong>Error:</strong> ${err.message}`, "danger");
                }
            }
        }

        if (archivoImagen) {
            const reader = new FileReader();
            reader.onload = function (e) {
                guardarYFinalizar(e.target.result);
            };
            reader.readAsDataURL(archivoImagen);
        } else if (editandoServicioId !== null) {
            const servicioExistente = serviciosCache.find(s => s.id === editandoServicioId);
            const imagenAnterior = servicioExistente ? servicioExistente.imagen : "";
            guardarYFinalizar(imagenAnterior);
        } else {
            mostrarAlerta("Por favor, selecciona una imagen para el servicio.", "danger");
        }
    });
}

function cargarServicioParaEditar(id) {
    const servicioAEditar = serviciosCache.find(s => s.id === id);
    if (!servicioAEditar) return;

    document.getElementById("servicio").value = servicioAEditar.nombre || "";
    document.getElementById("descripcion").value = servicioAEditar.descripcion || "";
    document.getElementById("precio").value = servicioAEditar.precio || "";
    document.getElementById("disponibilidad").value = servicioAEditar.disponible ? "Disponible" : "No disponible";

    // La imagen deja de ser obligatoria mientras editas: un <input type="file">
    // nunca puede rellenarse por código, así que si no la quitamos, el navegador
    // bloquea el envío del formulario por "campo requerido vacío".
    const inputImagen = document.getElementById("imagen");
    if (inputImagen) inputImagen.required = false;

    const categoriaActual = Object.keys(MAPA_ESPECIE_ID)
        .find(key => MAPA_ESPECIE_ID[key] === servicioAEditar.especie?.id) || "";

    const inputCategoria = document.getElementById("categoria");
    if (inputCategoria) inputCategoria.value = categoriaActual;

    document.querySelectorAll(".pill-categoria").forEach(p => {
        p.classList.toggle("activa", p.getAttribute("data-valor") === categoriaActual);
    });

    if (servicioAEditar.imagen) {
        const badge = document.getElementById("archivoBadge");
        const nombre = document.getElementById("archivoNombre");
        if (badge && nombre) {
            nombre.textContent = "Imagen actual guardada";
            badge.classList.remove("d-none");
        }
    }

    editandoServicioId = id;

    const btnSubmit = document.querySelector("#formularioAdmin button[type='submit']");
    if (btnSubmit) {
        btnSubmit.textContent = "Actualizar servicio";
        btnSubmit.classList.add("btn-warning");
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function limpiarServicios() {
    if (serviciosCache.length === 0) return;

    const confirmar = typeof Swal !== 'undefined'
        ? (await Swal.fire({
            title: "¿Eliminar todos los servicios?",
            text: "Esta acción no se puede deshacer.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, eliminar todos",
            cancelButtonText: "Cancelar",
            confirmButtonColor: "#dc3545"
        })).isConfirmed
        : confirm("¿Seguro que deseas eliminar TODOS los servicios?");

    if (!confirmar) return;

    try {
        await Promise.all(serviciosCache.map(s => eliminarServicioAPI(s.id)));
        if (typeof Swal !== 'undefined') {
            Swal.fire({ icon: "success", title: "Servicios eliminados", timer: 1500, showConfirmButton: false });
        }
        await renderizarServicios();
        await cargarDatosReales();
    } catch (err) {
        mostrarAlerta(`<strong>Error al eliminar:</strong> ${err.message}`, "danger");
    }
}

function eliminarServicio(id) {
    if (typeof Swal !== 'undefined') {
        Swal.fire({
            title: "¿Eliminar servicio?",
            text: "No podrás recuperarlo después.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
            confirmButtonColor: "#dc3545"
        }).then((result) => {
            if (result.isConfirmed) ejecutarEliminacion(id);
        });
    } else {
        if (confirm("¿Seguro que deseas eliminar este servicio?")) ejecutarEliminacion(id);
    }
}

async function ejecutarEliminacion(id) {
    try {
        await eliminarServicioAPI(id);
        await renderizarServicios();
        await cargarDatosReales();
    } catch (err) {
        if (err.message !== "No autorizado") {
            mostrarAlerta(`<strong>Error al eliminar:</strong> ${err.message}`, "danger");
        }
    }
}

async function renderizarServicios(listaAMostrar) {
    const contenedor = document.getElementById("listaServicios");
    if (!contenedor) return;

    if (listaAMostrar === undefined) {
        try {
            serviciosCache = await obtenerServiciosAPI();
        } catch (err) {
            contenedor.innerHTML = `<p class="text-muted small text-center mt-3">No se pudieron cargar los servicios: ${err.message}</p>`;
            return;
        }
    }

    const items = listaAMostrar !== undefined ? listaAMostrar : serviciosCache;
    const contador = document.getElementById("contadorServicios");

    if (contador) contador.textContent = `${serviciosCache.length} ${serviciosCache.length === 1 ? "servicio" : "servicios"}`;

    if (serviciosCache.length === 0) {
        contenedor.innerHTML = `
            <div class="estado-vacio" id="sinServicios">
                <div class="estado-vacio-icono">📦</div>
                <p class="fw-bold mb-1" style="font-size:.9rem;">Todavía no hay servicios</p>
                <p class="text-muted small mb-0">Completa el formulario para añadir el primero.</p>
            </div>
        `;
        return;
    }

    if (items.length === 0) {
        contenedor.innerHTML = `<p class="text-muted small text-center mt-3">No se encontraron servicios coincidentes.</p>`;
        return;
    }

    contenedor.innerHTML = items.map((s) => `
        <div class="tarjeta-servicio mb-3 p-3 border rounded bg-white shadow-sm">
            ${s.imagen ? `<img src="${s.imagen}" alt="${s.nombre || 'Servicio'}" class="img-fluid rounded mb-2" style="max-height: 120px; object-fit: cover; width: 100%;">` : ""}
            <div class="d-flex align-items-center gap-2 mb-2 flex-wrap">
                <span class="badge bg-secondary">${s.especie?.nombre || ""}</span>
                <span class="badge ${s.disponible ? "bg-success" : "bg-danger"}">
                    ${s.disponible ? "Disponible" : "No disponible"}
                </span>
            </div>
            <h6 class="fw-bold mb-1" style="font-size:.9rem;">${s.nombre || "(Sin nombre)"}</h6>
            <p class="text-muted small mb-2">${s.descripcion || ""}</p>
            <div class="d-flex justify-content-between align-items-center">
                <span class="fw-bold text-success">$${s.precio ?? ""}</span>
                <div class="d-flex gap-1">
                    <button type="button" class="btn btn-sm btn-outline-primary" onclick="cargarServicioParaEditar(${s.id})">
                        ✏️ Editar
                    </button>
                    <button type="button" class="btn btn-sm btn-outline-danger" onclick="eliminarServicio(${s.id})">
                        🗑️ Eliminar
                    </button>
                </div>
            </div>
        </div>
    `).join("");
}

function filtrarServicios(texto) {
    const termino = texto.toLowerCase().trim();
    if (!termino) {
        renderizarServicios(serviciosCache);
        return;
    }
    const filtrados = serviciosCache.filter(s =>
        (s.nombre || "").toLowerCase().includes(termino) ||
        (s.especie?.nombre || "").toLowerCase().includes(termino)
    );
    renderizarServicios(filtrados);
}

function previsualizarImagen(input) {
    const badge = document.getElementById("archivoBadge");
    const nombre = document.getElementById("archivoNombre");
    if (input.files && input.files[0]) {
        nombre.textContent = input.files[0].name;
        badge.classList.remove("d-none");
    } else {
        badge.classList.add("d-none");
    }
}

function quitarImagen() {
    const input = document.getElementById("imagen");
    if (input) input.value = "";
    const badge = document.getElementById("archivoBadge");
    if (badge) badge.classList.add("d-none");
}

function seleccionarCategoriaPill(boton) {
    const valor = boton.getAttribute("data-valor");
    const select = document.getElementById("categoria");
    if (select) select.value = valor;
    document.querySelectorAll(".pill-categoria").forEach(p => p.classList.remove("activa"));
    boton.classList.add("activa");
}

function limpiarSeleccionPills() {
    document.querySelectorAll(".pill-categoria").forEach(p => p.classList.remove("activa"));
    const filtro = document.getElementById("filtroServicios");
    if (filtro) filtro.value = "";
}


// ============================================================
// 2. DASHBOARD Y CARGA DE DATOS (Servicios y Usuarios ← API; Reservas ← localStorage)
// ============================================================
async function obtenerUsuariosAPI() {
    const res = await fetch(`${API_BASE}/usuarios`, { headers: headersConAuth() });
    return manejarRespuesta(res);
}

async function cargarDatosReales() {
    let usuarios = [];
    try {
        usuarios = await obtenerUsuariosAPI();
    } catch (err) {
        console.error("No se pudieron cargar los usuarios:", err.message);
    }

    const reservas = JSON.parse(localStorage.getItem('huellitasReservas')) || [];

    const kpiClientes = document.getElementById('kpiClientes');
    const kpiReservas = document.getElementById('kpiReservas');
    const kpiServicios = document.getElementById('kpiServicios');

    if (kpiClientes) kpiClientes.textContent = usuarios.length;
    if (kpiReservas) kpiReservas.textContent = reservas.length;
    if (kpiServicios) kpiServicios.textContent = serviciosCache.length;

    let totalPerros = 0, totalGatos = 0, totalAves = 0, totalPequenos = 0;
    let totalMascotasAlojadas = 0;

    reservas.forEach(r => {
        if (r.mascotas && Array.isArray(r.mascotas)) {
            r.mascotas.forEach(m => {
                totalMascotasAlojadas++;
                if (m.animalType === 'perro') totalPerros++;
                else if (m.animalType === 'gato') totalGatos++;
                else if (m.animalType === 'aves') totalAves++;
                else if (m.animalType === 'pequenos') totalPequenos++;
            });
        }
    });

    const kpiOcupacion = document.getElementById('kpiOcupacion');
    const kpiEspacios = document.getElementById('kpiEspacios');
    const espaciosMaximos = 50;

    if (kpiOcupacion && kpiEspacios) {
        let porcentajeOcup = totalMascotasAlojadas > 0 ? Math.round((totalMascotasAlojadas / espaciosMaximos) * 100) : 0;
        kpiOcupacion.textContent = porcentajeOcup + '%';
        let libres = espaciosMaximos - totalMascotasAlojadas;
        kpiEspacios.textContent = `${libres} libres`;
    }

    const pPerros = totalMascotasAlojadas > 0 ? Math.round((totalPerros / totalMascotasAlojadas) * 100) : 0;
    const pGatos = totalMascotasAlojadas > 0 ? Math.round((totalGatos / totalMascotasAlojadas) * 100) : 0;
    const pAves = totalMascotasAlojadas > 0 ? Math.round((totalAves / totalMascotasAlojadas) * 100) : 0;
    const pPequenos = totalMascotasAlojadas > 0 ? Math.round((totalPequenos / totalMascotasAlojadas) * 100) : 0;

    const leyendaAnimales = document.getElementById('leyendaAnimales');
    if (leyendaAnimales) {
        if (totalMascotasAlojadas === 0) {
            leyendaAnimales.innerHTML = `<span class="text-muted small">No hay mascotas reservadas aún.</span>`;
        } else {
            leyendaAnimales.innerHTML = `
                <span class="d-flex align-items-center gap-1 text-muted small"><span class="punto-leyenda" style="background-color: var(--color-verde, #173C2C);"></span>Perros (${pPerros}%)</span>
                <span class="d-flex align-items-center gap-1 text-muted small"><span class="punto-leyenda" style="background-color: var(--color-coral, #E68A5C);"></span>Gatos (${pGatos}%)</span>
                <span class="d-flex align-items-center gap-1 text-muted small"><span class="punto-leyenda" style="background-color: #3b82f6;"></span>Aves (${pAves}%)</span>
                <span class="d-flex align-items-center gap-1 text-muted small"><span class="punto-leyenda" style="background-color: #eab308;"></span>Pequeños (${pPequenos}%)</span>
            `;
        }
    }

    let pctWeb = reservas.length > 0 ? 100 : 0;
    const cWeb = document.getElementById('canalWeb');
    if (cWeb) {
        cWeb.textContent = `${pctWeb}%`;
        document.getElementById('deltaWeb').textContent = reservas.length > 0 ? 'online' : '0%';
        document.getElementById('canalWhatsapp').textContent = '0%';
        document.getElementById('deltaWhatsapp').textContent = '0%';
        document.getElementById('canalRecepcion').textContent = '0%';
        document.getElementById('deltaRecepcion').textContent = '0%';
        document.getElementById('canalTelefono').textContent = '0%';
        document.getElementById('deltaTelefono').textContent = '0%';
    }

    const tablaBody = document.getElementById('tablaUsuariosBody');
    if (tablaBody) {
        if (usuarios.length === 0) {
            tablaBody.innerHTML = `<tr><td colspan="4" class="text-center text-muted py-4">No hay usuarios registrados aún.</td></tr>`;
        } else {
            let filasHTML = "";
            usuarios.forEach(user => {
                const totalMascotas = user.mascotas ? user.mascotas.length : 0;
                filasHTML += `
                <tr>
                    <td class="fw-semibold">${user.nombre || 'Sin nombre'}</td>
                    <td>${user.email}</td>
                    <td>${user.telefono || 'No registrado'}</td>
                    <td>
                        <span class="badge rounded-pill" style="background-color: var(--color-verde, #173C2C);">
                            ${totalMascotas}
                        </span>
                    </td>
                </tr>`;
            });
            tablaBody.innerHTML = filasHTML;
        }
    }

    renderizarEquipo();
}

// ============================================================
// 3. GRÁFICO DE BARRAS POR SEMANA (sin cambios, sigue en localStorage)
// ============================================================
const selectorSemana = document.getElementById('selectorSemana');

function obtenerSemanaActualInput() {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 3 - (d.getDay() + 6) % 7);
    const week1 = new Date(d.getFullYear(), 0, 4);
    const weekNum = 1 + Math.round(((d.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
    return `${d.getFullYear()}-W${weekNum.toString().padStart(2, '0')}`;
}

function obtenerLunesDeSemana(weekString) {
    const [year, week] = weekString.split('-W');
    const simple = new Date(year, 0, 1 + (week - 1) * 7);
    const dow = simple.getDay();
    const ISOweekStart = simple;
    if (dow <= 4) ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1);
    else ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay());
    return ISOweekStart;
}

function actualizarGraficoSemanal() {
    const grafContenedor = document.getElementById('contenedorGraficoBarras');
    const grafDias = document.getElementById('etiquetasDiasGrafico');
    if (!grafContenedor || !selectorSemana) return;

    const reservas = JSON.parse(localStorage.getItem('huellitasReservas')) || [];
    const fechaLunes = obtenerLunesDeSemana(selectorSemana.value);

    let datosSemana = [];
    const nombresDias = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

    for (let i = 0; i < 7; i++) {
        let dia = new Date(fechaLunes);
        dia.setDate(fechaLunes.getDate() + i);
        datosSemana.push({
            fechaRaw: dia.toISOString().split('T')[0],
            etiqueta: `${nombresDias[i]} ${dia.getDate()}`,
            cantidad: 0
        });
    }

    reservas.forEach(r => {
        if (r.fechaCreacion) {
            let fechaReserva = r.fechaCreacion.split('T')[0];
            let diaMatch = datosSemana.find(d => d.fechaRaw === fechaReserva);
            if (diaMatch) diaMatch.cantidad += 1;
        }
    });

    const maxReservas = Math.max(...datosSemana.map(d => d.cantidad));

    grafContenedor.innerHTML = datosSemana.map(dia => `
        <div class="d-flex flex-column align-items-center flex-grow-1" style="width: 14%;">
            <div class="fw-bold small mb-1" style="color: #754C2E; font-size: 0.8rem; opacity: ${dia.cantidad > 0 ? '1' : '0'};">${dia.cantidad}</div>
            <div style="height: 100%; width: 100%; display: flex; align-items: flex-end; justify-content: center;">
                <div style="width: 50%; max-width: 30px; background-color: #754C2E; border-radius: 6px 6px 0 0; height: ${maxReservas > 0 ? (dia.cantidad / maxReservas) * 100 : 0}%; transition: 0.4s;"></div>
            </div>
        </div>
    `).join('');

    const hoyTxt = new Date().toISOString().split('T')[0];
    grafDias.innerHTML = datosSemana.map(dia => `
        <span class="text-center ${dia.fechaRaw === hoyTxt ? 'fw-bold' : ''}" style="width: 14%; color: ${dia.fechaRaw === hoyTxt ? '#754C2E' : '#6c757d'};">${dia.etiqueta}</span>
    `).join('');
}

if (selectorSemana) {
    selectorSemana.addEventListener('change', actualizarGraficoSemanal);
}


// ============================================================
// 4. CALENDARIO DE RESERVAS (sin cambios, sigue en localStorage)
// ============================================================
let fechaCalendarioActual = new Date();

function renderizarCalendario() {
    const contenedorDias = document.getElementById('diasDelCalendario');
    const textoMes = document.getElementById('textoMesCalendario');
    if (!contenedorDias) return;

    const año = fechaCalendarioActual.getFullYear();
    const mes = fechaCalendarioActual.getMonth();

    if (textoMes) {
        textoMes.textContent = fechaCalendarioActual.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
    }

    const primerDiaMes = new Date(año, mes, 1).getDay();
    const diasEnMes = new Date(año, mes + 1, 0).getDate();
    const reservas = JSON.parse(localStorage.getItem('huellitasReservas')) || [];

    let htmlDias = '';
    for (let i = 0; i < primerDiaMes; i++) {
        htmlDias += `<div class="cal-dia inactivo"></div>`;
    }

    for (let dia = 1; dia <= diasEnMes; dia++) {
        const fechaCadena = `${año}-${String(mes + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;

        let mascotasHoyHTML = '';
        reservas.forEach(reserva => {
            if (reserva.mascotas) {
                reserva.mascotas.forEach(mascota => {
                    if (mascota.checkIn === fechaCadena) {
                        let claseBadge = 'bg-secondary text-white';
                        let icono = '🐾';
                        if (mascota.animalType === 'perro') { claseBadge = 'badge-perro'; icono = '🐶'; }
                        if (mascota.animalType === 'gato') { claseBadge = 'badge-gato'; icono = '🐱'; }
                        if (mascota.animalType === 'aves') { claseBadge = 'badge-ave'; icono = '🦜'; }
                        if (mascota.animalType === 'pequenos') { claseBadge = 'badge-pequeno'; icono = '🐰'; }

                        mascotasHoyHTML += `<div class="cal-reserva ${claseBadge}" title="${mascota.name} - ${reserva.usuario}">
                            ${icono} ${mascota.name || 'Sin nombre'}
                        </div>`;
                    }
                });
            }
        });

        const esHoy = fechaCadena === new Date().toISOString().split('T')[0];
        const estiloHoy = esHoy ? 'background: #fdf5f0; border-color: #754C2E;' : '';

        htmlDias += `
            <div class="cal-dia" style="${estiloHoy}">
                <div class="cal-num" style="${esHoy ? 'color: #754C2E;' : ''}">${dia}</div>
                <div style="flex-grow: 1; overflow-y: auto;">${mascotasHoyHTML}</div>
            </div>
        `;
    }
    contenedorDias.innerHTML = htmlDias;
}

function cambiarMesCalendario(direccion) {
    fechaCalendarioActual.setMonth(fechaCalendarioActual.getMonth() + direccion);
    renderizarCalendario();
}


// ============================================================
// 5. EQUIPO Y PERSONAL (sin cambios, sigue en localStorage)
// ============================================================
const formEquipo = document.getElementById('formEquipo');
if (formEquipo) {
    formEquipo.addEventListener('submit', function (e) {
        e.preventDefault();
        const empleados = JSON.parse(localStorage.getItem('huellitasEquipo')) || [];

        const nuevoEmpleado = {
            id: Date.now(),
            nombre: document.getElementById('empNombre').value,
            rol: document.getElementById('empRol').value,
            estado: document.getElementById('empEstado').value
        };

        empleados.push(nuevoEmpleado);
        localStorage.setItem('huellitasEquipo', JSON.stringify(empleados));

        formEquipo.reset();
        renderizarEquipo();

        if (typeof Swal !== 'undefined') {
            Swal.fire({ icon: 'success', title: 'Empleado guardado', timer: 1500, showConfirmButton: false });
        }
    });
}

function cambiarEstadoEmpleado(id) {
    let empleados = JSON.parse(localStorage.getItem('huellitasEquipo')) || [];
    let emp = empleados.find(e => e.id === id);
    if (emp) {
        emp.estado = emp.estado === 'Activo' ? 'Inactivo' : 'Activo';
        localStorage.setItem('huellitasEquipo', JSON.stringify(empleados));
        renderizarEquipo();
    }
}

function eliminarEmpleado(id) {
    let empleados = JSON.parse(localStorage.getItem('huellitasEquipo')) || [];
    empleados = empleados.filter(e => e.id !== id);
    localStorage.setItem('huellitasEquipo', JSON.stringify(empleados));
    renderizarEquipo();
}

function renderizarEquipo() {
    const empleados = JSON.parse(localStorage.getItem('huellitasEquipo')) || [];

    const tablaBody = document.getElementById('tablaEquipoBody');
    if (tablaBody) {
        tablaBody.innerHTML = empleados.length === 0
            ? `<tr><td colspan="4" class="text-center text-muted">No hay empleados registrados</td></tr>`
            : empleados.map(e => `
                <tr>
                    <td class="fw-bold">${e.nombre}</td>
                    <td>${e.rol}</td>
                    <td>
                        <span class="badge ${e.estado === 'Activo' ? 'bg-success' : 'bg-danger'}" 
                              style="cursor:pointer;" onclick="cambiarEstadoEmpleado(${e.id})">
                            ${e.estado}
                        </span>
                    </td>
                    <td>
                        <button class="btn btn-sm btn-outline-danger" onclick="eliminarEmpleado(${e.id})">🗑️</button>
                    </td>
                </tr>
            `).join('');
    }

    const empleadosActivos = empleados.filter(e => e.estado === 'Activo');
    const contenedorDashboard = document.getElementById('listaEquipoDashboard');
    const conteoActivos = document.getElementById('conteoEquipoActivo');

    if (conteoActivos) conteoActivos.textContent = `${empleadosActivos.length} Activos`;

    if (contenedorDashboard) {
        contenedorDashboard.innerHTML = empleadosActivos.length === 0
            ? `<p class="text-muted small">Nadie en turno.</p>`
            : empleadosActivos.map(e => {
                let iniciales = e.nombre.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
                return `
                <div class="equipo-item d-flex justify-content-between align-items-center mb-2 p-2 border rounded">
                    <div class="d-flex align-items-center gap-2 min-w-0">
                        <div class="avatar-iniciales rounded-circle bg-light d-flex align-items-center justify-content-center text-secondary fw-bold" style="width:35px; height:35px; font-size:14px; border: 1px solid #ddd;">${iniciales}</div>
                        <div class="min-w-0">
                            <h6 class="mb-0 text-truncate" style="font-size:.85rem;">${e.nombre}</h6>
                            <p class="text-muted small mb-0 text-truncate">${e.rol}</p>
                        </div>
                    </div>
                    <span class="fw-bold small text-success">🟢 En turno</span>
                </div>
                `;
            }).join('');
    }
}


// ============================================================
// 6. INICIALIZACIÓN GLOBAL AL CARGAR LA PÁGINA
// ============================================================
document.addEventListener("DOMContentLoaded", async () => {
    const fechaSpan = document.getElementById("fechaHoyPanel");
    if (fechaSpan) {
        fechaSpan.textContent = new Date().toLocaleDateString("es-ES", {
            day: "numeric", month: "long", year: "numeric"
        });
    }

    await renderizarServicios();
    await cargarDatosReales();

    if (selectorSemana) {
        selectorSemana.value = obtenerSemanaActualInput();
        actualizarGraficoSemanal();
    }

    renderizarCalendario();
});