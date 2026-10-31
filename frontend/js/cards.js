
/* =========================================================
   GENERAR TARJETAS DE RUTAS
========================================================= */

function crearTarjetaRuta(ruta) {
  const rutaId = ruta._id;
  const empresa = ruta['company-name'] || 'Empresa no disponible';
  const codigo = ruta.busCode || ruta.routeId || 'Sin código';
  const origen = ruta.origen || 'Origen no disponible';
  const destino = ruta.destino || 'Destino no disponible';
  const precio = ruta.precio || 'Por verificar';
  const tiempo = ruta.tiempo || 'Por verificar';
  const horario = ruta.horario || 'Por verificar';
  const estado = ruta.busstatus || 'Sin información';
  const recorrido = ruta.stop || 'Recorrido por verificar';

  const universidades =
    ruta['Universidades '] ||
    ruta['Universidades'] ||
    'Sin información de universidades';

  const paradas = recorrido
    .split('→')
    .map(parada => parada.trim())
    .filter(Boolean);

  const paradasHTML = paradas.map((parada, indice) => `
    <div class="stop">
      ${indice === 0
      ? `<span class="Origen">${escaparHTML(origen)}</span>`
      : indice === paradas.length - 1
        ? `<span class="Destino">${escaparHTML(destino)}</span>`
        : `<span class="parada">${escaparHTML(parada)}</span>`
    }
    </div>
  `).join('');

  return `
    <article class="route-card">
      <div class="card-inner">

        <div class="card-front">
          <div class="top-card">
            <span class="buscode">${escaparHTML(codigo)}</span>
            <span class="busstatus">${escaparHTML(estado)}</span>
          </div>

          <div class="cardmain">
            <span class="company-name">${escaparHTML(empresa)}</span>
            <span class="origen">${escaparHTML(origen)}</span>
            <span class="icon">→</span>
            <span class="destino">${escaparHTML(destino)}</span>
          </div>

          <div class="cardbottom">
            <span class="precio">${escaparHTML(precio)}</span>
            <span class="tiempo">${escaparHTML(tiempo)}</span>
            <button
              type="button"
              class="favorite-btn"
              data-ruta-id="${escaparHTML(rutaId)}"
              aria-label="Agregar a fav"
              aria-pressed="false"
            >★</button>
          </div>

          <button type="button" class="recorrido-btn">
            Ver Recorrido
          </button>
        </div>

        <div class="card-back">
          <h3>Recorrido</h3>

          <div class="busstops">
            ${paradasHTML || `
              <div class="stop">Recorrido por verificar</div>
            `}
            <div class="stop">
              <span class="parada">${escaparHTML(universidades)}</span>
            </div>
          </div>

          <div class="cardbottom">
            <span class="precio">
              <strong>Horario:</strong> ${escaparHTML(horario)}
            </span>
          </div>

          <button type="button" class="map-btn">
            Ver Ruta completa
          </button>
        </div>

      </div>
    </article>
  `;
}


/* =========================================================
   EVITAR INSERTAR TEXTO COMO HTML
========================================================= */

function escaparHTML(valor) {
  return String(valor).replace(/[&<>"']/g, caracter => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[caracter]);
}


/* =========================================================
   GIRAR TARJETAS Y MANEJAR BOTONES
========================================================= */

document.addEventListener('click', event => {
  const boton = event.target.closest('button');
  const tarjeta = event.target.closest('.route-card');

  if (!tarjeta) return;

  if (boton) {
    event.stopPropagation();

    if (boton.classList.contains('recorrido-btn')) {
      tarjeta.classList.toggle('is-flipped');
    }

    if (boton.classList.contains('favorite-btn')) {
      manejarFav(boton);
    }

    if (boton.classList.contains('map-btn')) {
      console.log('Abrir mapa de la ruta');
    }

    return;
  }

  tarjeta.classList.toggle('is-flipped');

});
async function manejarFav(boton) {
  const token = sessionStorage.getItem('movuToken');
  const rutaId = boton.dataset.rutaId;

  if (!token) {
    alert('Debes iniciar sesión para guardar rutas.');
    return;
  }

  const yaEstaGuardada = boton.classList.contains('active');

  try {
    const respuesta = await fetch(
      `http://localhost:3000/api/fav/${rutaId}`,
      {
        method: yaEstaGuardada ? 'DELETE' : 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    const datos = await respuesta.json();

    if (!respuesta.ok) {
      throw new Error(datos.mensaje || 'No se pudo actualizar fav.');
    }

    boton.classList.toggle('active', !yaEstaGuardada);
    boton.setAttribute('aria-pressed', String(!yaEstaGuardada));

  } catch (error) {
    console.error('Error al actualizar fav:', error);
    alert(error.message);
  }
}