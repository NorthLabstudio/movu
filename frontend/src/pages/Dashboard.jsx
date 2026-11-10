
import { useEffect, useState } from 'react';
import Cards from '../componentes/Cards.jsx';
import SearchBar from '../componentes/SearchBar.jsx';
import NewsCards from '../componentes/NewsCards.jsx';
import Chatbot from '../componentes/Chatbot.jsx';
import API_URL from '../../config/api.js';

function Dashboard() {
  // Información del usuario
  const [nombreUsuario, setNombreUsuario] = useState('');

  // Estados de rutas favoritas
  const [favRutas, setFavRutas] = useState([]);
  const [cargandoFav, setCargandoFav] = useState(true);
  const [errorFav, setErrorFav] = useState('');

  // Estados del historial
  const [historial, setHistorial] = useState([]);
  const [cargandoHistorial, setCargandoHistorial] = useState(true);
  const [errorHistorial, setErrorHistorial] = useState('');
  const [destinoFrecuente, setDestinoFrecuente] = useState('--');

  // Estados de novedades
  const [novedades, setNovedades] = useState([]);
  const [cargandoNovedades, setCargandoNovedades] = useState(true);
  const [errorNovedades, setErrorNovedades] = useState('');

  // Estados del buscador
  const [todasLasRutas, setTodasLasRutas] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [cargandoRutas, setCargandoRutas] = useState(false);
  const [errorBusqueda, setErrorBusqueda] = useState('');
  const [buscarRealizado, setBuscarRealizado] = useState(false);

  // CARGAR TODAS LAS RUTAS PARA EL BUSCADOR
  async function cargarTodasLasRutas() {
    try {
      setCargandoRutas(true);
      setErrorBusqueda('');

      const respuesta = await fetch(`${API_URL}/api/rutas`);
      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(datos.mensaje || 'No se pudieron consultar las rutas.');
      }

      if (!Array.isArray(datos)) {
        throw new Error('La API no devolvió una lista de rutas.');
      }

      setTodasLasRutas(datos);

    } catch (error) {
      console.error('Error al cargar las rutas:', error);
      setErrorBusqueda('No fue posible consultar las rutas.');
    } finally {
      setCargandoRutas(false);
    }
  }

  // BUSCAR RUTAS POR SUS DATOS
  function manejarBusqueda(texto) {
    setBusqueda(texto);
    setBuscarRealizado(true);
    setErrorBusqueda('');

    if (!texto.trim()) {
      setBuscarRealizado(false);
    }

    // Consultar las rutas si todavía no se han cargado
    if (todasLasRutas.length === 0 && !cargandoRutas) {
      cargarTodasLasRutas();
    }
  }

  // FILTRAR RUTAS SEGÚN EL TEXTO ESCRITO
  const rutasFiltradas = todasLasRutas.filter(ruta => {
    const texto = busqueda.toLowerCase().trim();

    if (!texto) return false;

    const campos = [
      ruta['company-name'],
      ruta.busCode,
      ruta.routeId,
      ruta.origen,
      ruta.destino,
      ruta.stop,
      ruta['Universidades '],
      ruta['Universidades']
    ];

    return campos.some(campo =>
      String(campo || '').toLowerCase().includes(texto)
    );
  });

  useEffect(() => {
    // Verificar que exista una sesión activa
    const token = sessionStorage.getItem('movuToken');
    const usuarioGuardado = sessionStorage.getItem('movuUsuario');

    if (!token || !usuarioGuardado) {
      window.location.replace('/index.html');
      return;
    }

    // Leer los datos del usuario
    try {
      const usuario = JSON.parse(usuarioGuardado);

      if (!usuario.nombre) {
        throw new Error('No se encontró el nombre del usuario.');
      }

      setNombreUsuario(usuario.nombre);

    } catch (error) {
      console.error('Error al leer los datos del usuario:', error);

      sessionStorage.removeItem('movuUsuario');
      sessionStorage.removeItem('movuToken');

      window.location.replace('/index.html');
      return;
    }

    // Cargar la información del dashboard
    cargarFav(token);
    cargarHistorial(token);
    cargarNovedades();

  }, []);

  // CARGAR RUTAS FAVORITAS
  async function cargarFav(token) {
    try {
      const respuesta = await fetch(`${API_URL}/api/fav`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(datos.mensaje || 'No se pudieron cargar las rutas.');
      }

      if (!Array.isArray(datos)) {
        throw new Error('La API no devolvió una lista de rutas.');
      }

      setFavRutas(datos);

    } catch (error) {
      console.error('Error al cargar fav:', error);
      setErrorFav('No fue posible cargar tus rutas guardadas.');
    } finally {
      setCargandoFav(false);
    }
  }

  // CARGAR HISTORIAL DE CONSULTAS
  async function cargarHistorial(token) {
    try {
      const respuesta = await fetch(`${API_URL}/api/historial`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(datos.mensaje || 'No se pudo cargar el historial.');
      }

      // Aceptar una lista directa o una lista dentro de historial
      const listaHistorial = Array.isArray(datos)
        ? datos
        : datos.historial;

      if (!Array.isArray(listaHistorial)) {
        throw new Error('La API no devolvió una lista de consultas.');
      }

      setHistorial(listaHistorial);

      // Calcular el destino más consultado
      const destinos = {};

      listaHistorial.forEach(consulta => {
        const destino = consulta.ruta?.destino;

        if (destino) {
          const nombreDestino = destino.trim();
          const clave = nombreDestino.toLowerCase();

          if (nombreDestino) {
            destinos[clave] = {
              nombre: nombreDestino,
              cantidad: (destinos[clave]?.cantidad || 0) + 1
            };
          }
        }
      });

      const destinoMasFrecuente = Object.values(destinos)
        .sort((a, b) => b.cantidad - a.cantidad)[0];

      setDestinoFrecuente(destinoMasFrecuente?.nombre || '--');

    } catch (error) {
      console.error('Error al cargar el historial:', error);
      setErrorHistorial('No fue posible cargar tus consultas recientes.');
      setDestinoFrecuente('--');
    } finally {
      setCargandoHistorial(false);
    }
  }

  // CARGAR NOVEDADES PUBLICADAS
  async function cargarNovedades() {
    try {
      const respuesta = await fetch(`${API_URL}/api/novedades`);
      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(datos.mensaje || 'No se pudieron cargar las novedades.');
      }

      if (!Array.isArray(datos)) {
        throw new Error('La API no devolvió una lista de novedades.');
      }

      setNovedades(datos);

    } catch (error) {
      console.error('Error al cargar las novedades:', error);
      setErrorNovedades('No fue posible cargar las novedades.');
    } finally {
      setCargandoNovedades(false);
    }
  }

  // FORMATEAR FECHA DEL HISTORIAL
  function formatearFechaHistorial(fecha) {
    if (!fecha) return 'Fecha no disponible';

    const fechaConsulta = new Date(fecha);

    if (Number.isNaN(fechaConsulta.getTime())) {
      return 'Fecha no disponible';
    }

    return fechaConsulta.toLocaleString('es-CO', {
      dateStyle: 'short',
      timeStyle: 'short'
    });
  }

  // FORMATEAR FECHA DE NOVEDADES
  function formatearFechaNovedad(fecha) {
    if (!fecha) return 'Fecha no disponible';

    const fechaNovedad = new Date(fecha);

    if (Number.isNaN(fechaNovedad.getTime())) {
      return 'Fecha no disponible';
    }

    return fechaNovedad.toLocaleDateString('es-CO', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }

  return (
    <main className="dashboard">

      <section className="dashboard-header">
        <p>
          Buenos días, <span id="username">{nombreUsuario}</span>
        </p>

        <h1>¿A dónde vas hoy?</h1>
      </section>

      <SearchBar onBuscar={manejarBusqueda} />
      {/* RESULTADOS DEL BUSCADOR */}
      {buscarRealizado && (
        <section className="search-results">

          <div className="section-header">
            <div>
              <span className="section-title">Resultados de búsqueda</span>
              <h2>Rutas encontradas</h2>
            </div>

            <span>{rutasFiltradas.length} resultados</span>
          </div>

          <div className="route-grid">

            {cargandoRutas ? (
              <p>Buscando rutas...</p>
            ) : errorBusqueda ? (
              <p>{errorBusqueda}</p>
            ) : rutasFiltradas.length === 0 ? (
              <p>No encontramos rutas que coincidan con tu búsqueda.</p>
            ) : (
              rutasFiltradas.map(ruta => (
                <Cards
                  key={ruta._id}
                  ruta={ruta}
                  esFavorita={favRutas.some(
                    favorita => favorita._id === ruta._id
                  )}
                />
              ))
            )}

          </div>

        </section>
      )}

      <section className="dashboard-stats">

        <article className="stat-item">
          <span className="stat-label">Rutas favoritas</span>
          <span className="stat-value">
            {cargandoFav ? '...' : errorFav ? '--' : favRutas.length}
          </span>
          <span className="stat-description">Rutas guardadas</span>
        </article>

        <article className="stat-item">
          <span className="stat-label">Consultas recientes</span>
          <span className="stat-value">
            {cargandoHistorial ? '...' : errorHistorial ? '--' : historial.length}
          </span>
          <span className="stat-description">Rutas consultadas</span>
        </article>

        <article className="stat-item">
          <span className="stat-label">Destino frecuente</span>
          <span className="stat-value">{destinoFrecuente}</span>
          <span className="stat-description">Destino más consultado</span>
        </article>

      </section>

      {/* RUTAS FAVORITAS */}
      <section id="rutas-favoritas">

        <div className="section-header">
          <div>
            <span className="stat-label">Rutas favoritas</span>
            <h2>Rutas favoritas</h2>
          </div>

          <a href="catalogo.html">Ver todas →</a>
        </div>

        <div id="fav-container" className="route-grid">

          {cargandoFav ? (
            <p>Cargando rutas favoritas...</p>
          ) : errorFav ? (
            <p>{errorFav}</p>
          ) : favRutas.length === 0 ? (
            <p>
              Aún no tienes rutas guardadas.
              Explora el directorio y agrega tus favoritas.
            </p>
          ) : (
            favRutas.map(ruta => (
              <Cards
                key={ruta._id}
                ruta={ruta}
                esFavorita={true}
              />
            ))
          )}

        </div>
      </section>

      {/* HISTORIAL DE CONSULTAS */}
      <section className="recientes" id="historial">

        <div className="section-header">
          <div>
            <span className="section-title">Tu actividad</span>
            <h2>Consultas recientes</h2>
          </div>

          <a href="profile.html#historial">Ver historial →</a>
        </div>

        <div id="historial-container" className="route-grid">

          {cargandoHistorial ? (
            <p>Cargando historial...</p>
          ) : errorHistorial ? (
            <p>{errorHistorial}</p>
          ) : historial.length === 0 ? (
            <p>
              Aún no has consultado ninguna ruta.
              Explora el directorio para comenzar.
            </p>
          ) : historial.filter(consulta => consulta.ruta).length === 0 ? (
            <p>No hay rutas disponibles para mostrar en el historial.</p>
          ) : (
            historial
              .filter(consulta => consulta.ruta)
              .map((consulta, indice) => (
                <div
                  className="history-entry"
                  key={consulta._id || `${consulta.ruta._id}-${indice}`}
                >
                  <p className="history-date">
                    Consultada: {formatearFechaHistorial(consulta.fecha)}
                  </p>

                  <Cards
                    ruta={consulta.ruta}
                    esFavorita={false}
                  />
                </div>
              ))
          )}

        </div>
      </section>

      {/* NOVEDADES */}
      <section id="novedades">

        <div className="section-header">
          <div>
            <span className="section-title">Información del transporte</span>
            <h2>Novedades</h2>
          </div>
        </div>

        <div id="novedades-container" className="newslist">

          {cargandoNovedades ? (
            <p>Cargando novedades...</p>
          ) : errorNovedades ? (
            <p>{errorNovedades}</p>
          ) : novedades.length === 0 ? (
            <p>No hay novedades de transporte vigentes por el momento.</p>
          ) : (
            novedades.map(novedad => (
              <NewsCards
                key={novedad._id}
                novedad={novedad}
              />
            ))
          )}

        </div>
      </section>
      {/* ASISTENTE MOVU AI */}
      <Chatbot />
    </main>
  );
}

export default Dashboard;
