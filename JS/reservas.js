let currentPetCount = 1;
const maxPets = 5;

const STORAGE_KEY = 'huellitas_reserva_temp';

const SERVICES = {
  hospedaje: { name: 'Hospedaje (Día/Noche)'/*, price: 60000*/ },
  recreacion: { name: 'Recreación y Juegos', price: 30000 },
  socializacion: { name: 'Socialización de Mascotas', price: 35000},
  peluqueria: { name: 'Peluquería y Estética', price: 45000}
};

const HOSPEDAJE = {
  perro: {
    luxury: {
      name: "Habitación Luxury", description: "Privada premium",price: 100000,
    },
    confort: {
      name: "Habitación Confort",description: "Semi privada",price: 80000,
    },
    familiar: {
      name: "Suite Familiar", description: "Familiar",price: 170000,
    }    
  },

  gato: {
    luxury: {
      name: "Gatuna Luxury", description: "Privada premium",price: 100000,
    },
    confort: {
      name: "Gatuna Confort",description: "Semi privada",price: 80000,
    },
    familiar: {
      name: "Gatuna Familiar", description: "Familiar",price: 170000,
    }    
  }, 

  aves: {
    luxury: {
      name: "Aviario Luxury", description: "Privada premium",price: 100000,
    },
    confort: {
      name: "Aviario Confort",description: "Semi privada",price: 80000,
    },
    familiar: {
      name: "Aviario Familiar", description: "Familiar",price: 170000,
    }    
  }, 

  pequenos: {
    luxury: {
      name: "Pequeños Huéspedes Luxury", description: "Privada premium",price: 100000,
    },
    confort: {
      name: "Pequeños Huéspedes Confort",description: "Semi privada",price: 80000,
    },
    familiar: {
      name: "Pequeños Huéspedes Explorador", description: "Familiar",price: 170000,
    }    
  },

}

const currencyFormatter = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0
});

const defaultPetState = [
  { 
    id: 1, 
    name: '', 
    animalType: 'perro', 
    breed: '', 
    service: 'hospedaje', 
    room: '',
    checkIn: '',
    checkOut: '',
    days: 1,
    extraServices: {}, 
    subtotal: 0 
  }
];

let petsData = loadFromLocalStorage();

function saveToLocalStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(petsData));
}

function loadFromLocalStorage() {
  const savedData = localStorage.getItem(STORAGE_KEY);
  if (savedData) {
    try {
      const parsed = JSON.parse(savedData);
      if (Array.isArray(parsed) && parsed.length > 0) {
        currentPetCount = parsed.length;
        return parsed;
      }
    } catch (e) {
      console.error('Error al parsear localStorage:', e);
    }
  }
  return defaultPetState;
}

function clearLocalStorage() {
  localStorage.removeItem(STORAGE_KEY);
}

function calculateDays(checkIn, checkOut) {
  if (!checkIn || !checkOut) return 1;
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const diffDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 1;
}

function calculateSubtotal(pet) {
  let basePrice = 0;
  
  if (pet.service === 'hospedaje') {
    //precio
    const animalRoom = HOSPEDAJE[pet.animalType];
    const roomSelected = (animalRoom && pet.room) ? animalRoom[pet.room] : null;
    const roomPrice = roomSelected ? roomSelected.price : 0;
    //dias
    pet.days = calculateDays(pet.checkIn, pet.checkOut);
    basePrice = roomPrice * pet.days; 

  } else {
    pet.days = 1;
    basePrice = SERVICES[pet.service] ? SERVICES[pet.service].price || 0 : 0;
  }

  let extrasTotal = 0;
  for (const [extraKey, qty] of Object.entries(pet.extraServices)) {
    if (SERVICES[extraKey] && qty > 0) {
      extrasTotal += SERVICES[extraKey].price * qty;
    }
  }

  return basePrice + extrasTotal;
}

function updatePetCount(change) {
  const newCount = currentPetCount + change;
  if (newCount >= 1 && newCount <= maxPets) {
    if (change > 0) {
      petsData.push({
        id: Date.now(),
        name: '',
        animalType: 'perro',
        breed: '',
        service: 'hospedaje',
        checkIn: '',
        checkOut: '',
        days: 1,
        extraServices: {},
        subtotal: SERVICES.hospedaje.price
      });
    } else {
      petsData.pop();
    }
    currentPetCount = petsData.length;
    saveToLocalStorage();
    renderForms();
  }
}

function removePet(index) {
  if (petsData.length > 1) {
    petsData.splice(index, 1);
    currentPetCount = petsData.length;
    saveToLocalStorage();
    renderForms();
  }
}

function updateMainService(index, serviceKey) {
  petsData[index].service = serviceKey;
  if (petsData[index].extraServices[serviceKey]) {
    delete petsData[index].extraServices[serviceKey];
  }
  petsData[index].subtotal = calculateSubtotal(petsData[index]);
  saveToLocalStorage();
  renderForms();
}

function updateHospedajeDates(index, field, value) {
  petsData[index][field] = value;
  petsData[index].subtotal = calculateSubtotal(petsData[index]);
  saveToLocalStorage();
  document.getElementById(`subtotal-${index}`).innerText = currencyFormatter.format(petsData[index].subtotal);
  renderSummary();
}

function updateExtraQuantity(index, serviceKey, qty) {
  const quantity = parseInt(qty) || 0;
  if (quantity > 0) {
    petsData[index].extraServices[serviceKey] = quantity;
  } else {
    delete petsData[index].extraServices[serviceKey];
  }
  petsData[index].subtotal = calculateSubtotal(petsData[index]);
  saveToLocalStorage();
  document.getElementById(`subtotal-${index}`).innerText = currencyFormatter.format(petsData[index].subtotal);
  renderSummary();
}

function renderForms() {
  document.getElementById('pet-count-display').innerText = currentPetCount;
  const container = document.getElementById('pets-container');
  container.innerHTML = '';

  const addBtn = document.getElementById('btn-add-pet');
  if (addBtn) {
    addBtn.style.display = currentPetCount >= maxPets ? 'none' : 'flex';
  }

  petsData.forEach((pet, index) => {
    pet.subtotal = calculateSubtotal(pet);

    const formHtml = `
      <section class="card bg-surface-bright border-0 shadow-sm mb-4">
        <div class="card-header bg-light bg-opacity-50 p-3 d-flex justify-content-between align-items-center border-0">
          <h3 class="h5 text-sage-deep m-0">Mascota ${index + 1}</h3>
          <div>
            ${petsData.length > 1 ? `
              <button type="button" class="btn btn-sm btn-outline-danger d-flex align-items-center p-1" onclick="removePet(${index})" title="Eliminar mascota">
                <span class="material-symbols-outlined fs-6">delete</span>
              </button>
            ` : ''}
          </div>
        </div>
        <div class="card-body p-4">
          
          <div class="row g-3 mb-3">
            <div class="col-md-4">
              <label class="form-label fw-semibold text-muted small">Nombre de la mascota *</label>
              <input type="text" class="form-control" placeholder="Ej. Max" value="${pet.name}" required oninput="petsData[${index}].name = this.value; saveToLocalStorage(); renderSummary();">
              <div class="invalid-feedback">Por favor ingresa el nombre.</div>
            </div>
            <div class="col-md-4">
              <label class="form-label fw-semibold text-muted small">Tipo de Animal *</label>
              <select class="form-select" required onchange="updateTipoAnimal(${index}, this.value)">
                <option value="perro" ${pet.animalType === 'perro' ? 'selected' : ''}>Perro</option>
                <option value="gato" ${pet.animalType === 'gato' ? 'selected' : ''}>Gato</option>
                <option value="aves" ${pet.animalType === 'aves' ? 'selected' : ''}>Aves</option>
                <option value="pequenos" ${pet.animalType === 'pequenos' ? 'selected' : ''}>Pequeños huespedes</option>
              </select>
            </div>
            <div class="col-md-4">
              <label class="form-label fw-semibold text-muted small">Raza / Especie *</label>
              <input type="text" class="form-control" placeholder="Ej. Golden Retriever" value="${pet.breed}" required oninput="petsData[${index}].breed = this.value; saveToLocalStorage();">
              <div class="invalid-feedback">Por favor ingresa la raza o especie.</div>
            </div>
          </div>

          <div class="mb-3">
            <label class="form-label fw-semibold text-muted small">Servicio Principal *</label>
            <select class="form-select" required onchange="updateMainService(${index}, this.value)">
              ${Object.keys(SERVICES).map(key => `
                <option value="${key}" ${pet.service === key ? 'selected' : ''}>
                ${SERVICES[key].name} ${key === 'hospedaje' ? '' : `(${currencyFormatter.format(SERVICES[key].price)})`}
                </option>                      
              `).join('')}
            </select>
          </div>

          <div class="p-3 bg-light rounded-3 mb-3">
            ${renderServiceDateInputs(pet.service, index)}
          </div>

          <div class="mb-3">
            <label class="form-label fw-semibold text-muted small text-uppercase">Servicios Adicionales (Opcional)</label>
            <div class="row g-3 justify-content-center">
              ${Object.keys(SERVICES).map(key => {
                const isMainService = pet.service === key;
                

                if(key === 'hospedaje' || isMainService){
                  return ""
                } else {
                  const currentQty = pet.extraServices[key] || 0;

                  return `
                  <div class="col-md-6">
                    <div class="card p-3 h-100 border ${isMainService ? 'bg-light opacity-75' : ''}">
                      <div class="d-flex justify-content-between align-items-start mb-2">
                        <div>
                          <span class="fw-semibold text-chocolate d-block">${SERVICES[key].name}</span>
                          <small class="text-muted">${currencyFormatter.format(SERVICES[key].price)} / sesión</small>
                        </div>
                        ${isMainService ? `<span class="badge bg-secondary">Servicio Principal</span>` : ''}
                      </div>
                      
                      <div class="mt-auto pt-2 d-flex align-items-center justify-content-between">
                        <small class="text-muted">Cantidad:</small>
                        <select class="form-select form-select-sm w-auto" 
                          ${isMainService ? 'disabled' : ''} 
                          onchange="updateExtraQuantity(${index}, '${key}', this.value)">
                          <option value="0" ${currentQty === 0 ? 'selected' : ''}>0 (Ninguno)</option>
                          <option value="1" ${currentQty === 1 ? 'selected' : ''}>1 vez</option>
                          <option value="2" ${currentQty === 2 ? 'selected' : ''}>2 veces</option>
                          <option value="3" ${currentQty === 3 ? 'selected' : ''}>3 veces</option>
                          <option value="4" ${currentQty === 4 ? 'selected' : ''}>4 veces</option>
                        </select>
                      </div>
                    </div>
                  </div>
                `;}                
              }).join('')}
            </div>
          </div>

          <div class="mb-3">
            <label class="form-label fw-semibold text-muted small">Descripción adicional / Alergias / Recomendaciones</label>
            <textarea class="form-control" rows="3" placeholder="Cuéntanos si necesita alguna medicina, tiene alergias o miedos especiales..." oninput="petsData[${index}].notes = this.value; saveToLocalStorage();">${pet.notes || ''}</textarea>
          </div>

          <div class="d-flex justify-content-end align-items-center pt-3 border-top">
            <span class="text-muted me-3">Subtotal estimado:</span>
            <span class="h4 text-chocolate m-0" id="subtotal-${index}">${currencyFormatter.format(pet.subtotal)}</span>
          </div>

        </div>
      </section>
    `;
    container.innerHTML += formHtml;
  });

  renderSummary();
}

function renderServiceDateInputs(serviceType, index) {
  const pet = petsData[index];
  if (serviceType === 'hospedaje') {
    return `
      <h6 class="fw-bold text-sage-deep mb-3">Fechas de Estancia y Tipo de Hospedaje</h6>
      <div class="row g-3">
        
        <div class="col-md-12 my-2"> 
          <small class="text-muted">Tipo de habitacion:</small>
          <select class="form-select" required onchange="actualizarHospedaje(${index}, this.value)"> 
             <option value="" ${!pet.room ? 'selected' : ''} disabled >Elige una opción</option>
            ${renderSelectHospedaje(pet)}
          </select>
        </div>   
        <div class="col-md-6">
          <label class="form-label small text-muted">Fecha Check-in *</label>
          <input type="date" class="form-control" value="${pet.checkIn || ''}" required onchange="updateHospedajeDates(${index}, 'checkIn', this.value)">
          <div class="invalid-feedback">Requerido</div>
        </div>
        <div class="col-md-6">
          <label class="form-label small text-muted">Fecha Check-out *</label>
          <input type="date" class="form-control" value="${pet.checkOut || ''}" required onchange="updateHospedajeDates(${index}, 'checkOut', this.value)">
          <div class="invalid-feedback">Requerido</div>
        </div>
      </div>
    `;
  } else if (serviceType === 'recreacion') {
    return `
      <h6 class="fw-bold text-sage-deep mb-3">Reserva de Recreación (Por Horas)</h6>
      <div class="row g-3">
        <div class="col-md-4">
          <label class="form-label small text-muted">Día de Visita *</label>
          <input type="date" class="form-control" value="${pet.visitDate || ''}" required onchange="petsData[${index}].visitDate = this.value; saveToLocalStorage();">
          <div class="invalid-feedback">Requerido</div>
        </div>
        <div class="col-md-4">
          <label class="form-label small text-muted">Hora Inicio *</label>
          <input type="time" class="form-control" value="${pet.startTime || ''}" required onchange="petsData[${index}].startTime = this.value; saveToLocalStorage();">
          <div class="invalid-feedback">Requerido</div>
        </div>
        <div class="col-md-4">
          <label class="form-label small text-muted">Hora Fin *</label>
          <input type="time" class="form-control" value="${pet.endTime || ''}" required onchange="petsData[${index}].endTime = this.value; saveToLocalStorage();">
          <div class="invalid-feedback">Requerido</div>
        </div>
      </div>
    `;
  } else if (serviceType === 'socializacion') {
    return `
      <h6 class="fw-bold text-sage-deep mb-3">Sesión de Socialización</h6>
      <div class="row g-3">
        <div class="col-md-6">
          <label class="form-label small text-muted">Fecha de la Sesión *</label>
          <input type="date" class="form-control" value="${pet.sessionDate || ''}" required onchange="petsData[${index}].sessionDate = this.value; saveToLocalStorage();">
          <div class="invalid-feedback">Requerido</div>
        </div>
        <div class="col-md-6">
          <label class="form-label small text-muted">Jornada Preferida *</label>
          <select class="form-select" required onchange="petsData[${index}].shift = this.value; saveToLocalStorage();">
            <option value="manana" ${pet.shift === 'manana' ? 'selected' : ''}>Mañana (8:00 AM - 12:00 PM)</option>
            <option value="tarde" ${pet.shift === 'tarde' ? 'selected' : ''}>Tarde (2:00 PM - 6:00 PM)</option>
          </select>
        </div>
      </div>
    `;
  } else if (serviceType === 'peluqueria') {
    return `
      <h6 class="fw-bold text-sage-deep mb-3">Cita de Peluquería y Estética</h6>
      <div class="row g-3">
        <div class="col-md-6">
          <label class="form-label small text-muted">Fecha del Turno *</label>
          <input type="date" class="form-control" value="${pet.appointmentDate || ''}" required onchange="petsData[${index}].appointmentDate = this.value; saveToLocalStorage();">
          <div class="invalid-feedback">Requerido</div>
        </div>
        <div class="col-md-6">
          <label class="form-label small text-muted">Horario Disponibilidad *</label>
          <input type="time" class="form-control" value="${pet.appointmentTime || ''}" required onchange="petsData[${index}].appointmentTime = this.value; saveToLocalStorage();">
          <div class="invalid-feedback">Requerido</div>
        </div>
      </div>
    `;
  }
}

function renderSummary() {
  const summaryList = document.getElementById('summary-list');
  summaryList.innerHTML = '';
  let total = 0;

  petsData.forEach((pet, i) => {
    const name = pet.name.trim() !== '' ? pet.name : `Mascota ${i + 1}`;
    const mainService = SERVICES[pet.service] ? SERVICES[pet.service].name : '';
    total += pet.subtotal;

    const extraDetails = [];
    for (const [key, qty] of Object.entries(pet.extraServices)) {
      if (qty > 0 && SERVICES[key]) {
        extraDetails.push(`${SERVICES[key].name} x${qty}`);
      }
    }

    summaryList.innerHTML += `
      <div class="mb-3 pb-2 border-bottom">
        <div class="d-flex justify-content-between fw-bold text-chocolate">
          <span>${name} (${pet.animalType})</span>
          <span>${currencyFormatter.format(pet.subtotal)}</span>
        </div>
        <div class="small text-muted d-flex align-items-center mt-1">
          <span class="material-symbols-outlined fs-6 me-1 text-sage-deep">eco</span>
          ${mainService} ${pet.service === 'hospedaje' ? `(${pet.days} ${pet.days === 1 ? 'día' : 'días'})` : ''}
        </div>
        ${extraDetails.length > 0 ? `
          <div class="small text-muted ms-3 mt-1">
            <strong>Adicionales:</strong> ${extraDetails.join(', ')}
          </div>
        ` : ''}
      </div>
    `;
  });

  document.getElementById('total-price').innerText = currencyFormatter.format(total);
}

document.addEventListener('DOMContentLoaded', () => {
  renderForms();

  const form = document.getElementById('booking-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      
      if (!form.checkValidity()) {
        e.stopPropagation();
      } else {
        saveToLocalStorage();
        alert('¡Reserva confirmada y guardada exitosamente!');
      }
      
      form.classList.add('was-validated');
    });
  }
});


//Funciones para actualizar y renderizar tipo de habitacion por animal

  //Actualizar opciones de hospedaje (Asigna hab, recalcula subtotal, guarda Local)
  function actualizarHospedaje(index, roomKey){ 
    petsData[index].room = roomKey;
    petsData[index].subtotal = calculateSubtotal(petsData[index]);
    saveToLocalStorage();
    document.getElementById(`subtotal-${index}`).innerText = currencyFormatter.format(petsData[index].subtotal);
    renderSummary();
  }

  //Renderizar select con opciones habitaciones
  function renderSelectHospedaje(pet){
    const habitacionesDisponibles = HOSPEDAJE[pet.animalType] || {};
    return Object.keys(habitacionesDisponibles).map(roomKey => {
      const room = habitacionesDisponibles[roomKey];
      const habSeleccionada = pet.room === roomKey ? 'selected' : "";
      return `
        <option value="${roomKey}" ${habSeleccionada}>
          ${room.name} - ${currencyFormatter.format(room.price)}/noche (${room.description})
        </option>
      `;
    }).join('');
  }

  // Actualizar select(tipo mascota) con cambio de animal 
  function updateTipoAnimal(index, newAnimalType) {
    petsData[index].animalType = newAnimalType;
    petsData[index].room = "";
    petsData[index].subtotal = calculateSubtotal(petsData[index]);
    saveToLocalStorage();
    renderForms();
  }


