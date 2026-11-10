import './Cards.css';
import { useEffect, useState } from 'react';
import API_URL from '../../config/api.js';
function Cards({ ruta, esFavorita = false, onFavChange }) {

  // Estado para controlar el giro de la tarjeta.
  const [girada, setGirada] = useState(false);

  // Estado para saber si la ruta está guardada en fav.
  const [favorita, setFavorita] = useState(esFavorita);

  // Estado para evitar varios clics mientras se actualiza fav.
  const [cargandoFav, setCargandoFav] = useState(false);

  // Actualizar el estado si el Dashboard recibe las favoritas del servidor.
  useEffect(() => {
    setFavorita(esFavorita);
  }, [esFavorita]);

  // Obtener los datos de la ruta.
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

  // Separar las paradas del recorrido.
  const paradas = String(recorrido)
    .split('→')
    .map(parada => parada.trim())
    .filter(Boolean);

  // Registrar una consulta en el historial.
  async function registrarConsulta() {
    const token = sessionStorage.getItem('movuToken');

    if (!token) {
      console.error('No hay una sesión iniciada.');
      return;
    }

    try {
      const respuesta = await fetch(
        `${API_URL}/api/historial/${rutaId}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(
          datos.mensaje || 'No se pudo registrar la consulta.'
        );
      }

      console.log('Consulta registrada en el historial.');

    } catch (error) {
      console.error('Error al registrar la consulta:', error);
    }
  }

  // Agregar o quitar una ruta de fav.
  async function manejarFav(event) {
    event.stopPropagation();

    const token = sessionStorage.getItem('movuToken');

    if (!token) {
      alert('Debes iniciar sesión para guardar rutas.');
      return;
    }

    if (cargandoFav) return;

    const yaEstaGuardada = favorita;

    try {
      setCargandoFav(true);

      const respuesta = await fetch(
        `${API_URL}/api/fav/${rutaId}`,
        {
          method: yaEstaGuardada ? 'DELETE' : 'POST',
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(
          datos.mensaje || 'No se pudo actualizar fav.'
        );
      }

      setFavorita(!yaEstaGuardada);

      // Avisar al Dashboard que cambió el estado de la ruta.
      onFavChange?.(rutaId, !yaEstaGuardada);

    } catch (error) {
      console.error('Error al actualizar fav:', error);
      alert(error.message);

    } finally {
      setCargandoFav(false);
    }
  }

  // Girar la tarjeta y registrar la consulta.
  function verRecorrido(event) {
    event.stopPropagation();
    setGirada(!girada);
    registrarConsulta();
  }

  return (
    <article
      className={`route-card ${girada ? 'is-flipped' : ''}`}
      data-ruta-id={rutaId}
      onClick={() => setGirada(!girada)}
    >
      <div className="card-inner">

        {/* Parte frontal */}
        <div className="card-front">

          <div className="top-card">
            <span className="buscode">{codigo}</span>
            <span className="busstatus">{estado}</span>
          </div>

          <div className="cardmain">
            <span className="company-name">{empresa}</span>
            <span className="origen">{origen}</span>
            <span className="icon">→</span>
            <span className="destino">{destino}</span>
          </div>

          <div className="cardbottom">
            <span className="precio">{precio}</span>
            <span className="tiempo">{tiempo}</span>

            <button
              type="button"
              className={`favorite-btn ${favorita ? 'active' : ''}`}
              onClick={manejarFav}
              disabled={cargandoFav}
              aria-label={favorita ? 'Quitar de fav' : 'Agregar a fav'}
              aria-pressed={favorita}
            >
              ★
            </button>
          </div>

          <button
            type="button"
            className="recorrido-btn"
            onClick={verRecorrido}
          >
            Ver Recorrido
          </button>

        </div>

        {/* Parte posterior */}
        <div className="card-back">

          <h3>Recorrido</h3>

          <div className="busstops">

            {paradas.length > 0 ? (
              paradas.map((parada, indice) => (
                <div className="stop" key={indice}>
                  {indice === 0 ? (
                    <span className="Origen">{origen}</span>
                  ) : indice === paradas.length - 1 ? (
                    <span className="Destino">{destino}</span>
                  ) : (
                    <span className="parada">{parada}</span>
                  )}
                </div>
              ))
            ) : (
              <div className="stop">Recorrido por verificar</div>
            )}

            <div className="stop">
              <span className="parada">{universidades}</span>
            </div>

          </div>

          <div className="cardbottom">
            <span className="precio">
              <strong>Horario:</strong> {horario}
            </span>
          </div>

          <button
            type="button"
            className="map-btn"
            onClick={(event) => {
              event.stopPropagation();
              console.log('Abrir mapa de la ruta');
            }}
          >
            Ver Ruta completa
          </button>

        </div>

      </div>
    </article>
  );
}

export default Cards;
