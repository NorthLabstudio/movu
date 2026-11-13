
import { useEffect, useState } from 'react';
import Nav from '../componentes/Nav.jsx';
import Cards from '../componentes/Cards.jsx';
import API_URL from '../../config/api.js';
import '../../css/profile.css';

function Profile() {
  const [usuario, setUsuario] = useState(null);
  const [favoritos, setFavoritos] = useState([]);
  const [historial, setHistorial] = useState([]);

  const [cargando, setCargando] = useState(true);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState('');

  const [formulario, setFormulario] = useState({
    nombre: '',
    email: '',
    universidad: '',
    ciudad: ''
  });

  // Cargar información del usuario y sus rutas.
  useEffect(() => {
    const token = sessionStorage.getItem('movuToken');
    const usuarioGuardado = sessionStorage.getItem('movuUsuario');

    if (!token || !usuarioGuardado) {
      window.location.href = '/';
      return;
    }

    try {
      const usuarioActual = JSON.parse(usuarioGuardado);

      setUsuario(usuarioActual);

      setFormulario({
        nombre: usuarioActual.nombre || '',
        email: usuarioActual.email || '',
        universidad: usuarioActual.universidad || '',
        ciudad: usuarioActual.ciudad || ''
      });

      cargarFavoritos();
      cargarHistorial();

    } catch (error) {
      console.error('Error al cargar el perfil:', error);

      sessionStorage.removeItem('movuToken');
      sessionStorage.removeItem('movuUsuario');

      window.location.href = '/';

    } finally {
      setCargando(false);
    }
  }, []);

  // Cargar rutas favoritas.
  async function cargarFavoritos() {
    const token = sessionStorage.getItem('movuToken');

    try {
      const respuesta = await fetch(`${API_URL}/api/fav`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(datos.mensaje || 'No se pudieron cargar los favoritos.');
      }

      setFavoritos(Array.isArray(datos) ? datos : []);

    } catch (error) {
      console.error('Error al cargar favoritos:', error);
    }
  }

  // Cargar historial de consultas.
  async function cargarHistorial() {
    const token = sessionStorage.getItem('movuToken');

    try {
      const respuesta = await fetch(`${API_URL}/api/historial`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(datos.mensaje || 'No se pudo cargar el historial.');
      }

      const lista = Array.isArray(datos)
        ? datos
        : datos.historial;

      setHistorial(Array.isArray(lista) ? lista : []);

    } catch (error) {
      console.error('Error al cargar el historial:', error);
    }
  }

  // Actualizar los campos del formulario.
  function manejarCambio(event) {
    const { name, value } = event.target;

    setFormulario(previo => ({
      ...previo,
      [name]: value
    }));
  }

  // Abrir el modal de edición.
  function abrirModal() {
    setFormulario({
      nombre: usuario.nombre || '',
      email: usuario.email || '',
      universidad: usuario.universidad || '',
      ciudad: usuario.ciudad || ''
    });

    setMensaje('');
    setModalAbierto(true);
  }

  // Cerrar el modal.
  function cerrarModal() {
    setModalAbierto(false);
    setMensaje('');
  }

  // Guardar cambios del perfil.
  async function guardarPerfil(event) {
    event.preventDefault();

    const nombre = formulario.nombre.trim();
    const email = formulario.email.trim();

    if (nombre.length < 2) {
      setMensaje('El nombre debe tener al menos 2 caracteres.');
      return;
    }

    const token = sessionStorage.getItem('movuToken');

    if (!token) {
      setMensaje('Tu sesión expiró. Inicia sesión nuevamente.');
      return;
    }

    try {
      setGuardando(true);
      setMensaje('');

      const respuesta = await fetch(`${API_URL}/api/auth/perfil`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          nombre,
          email,
          universidad: formulario.universidad.trim(),
          ciudad: formulario.ciudad.trim()
        })
      });

      const datos = await respuesta.json().catch(() => ({}));

      if (!respuesta.ok) {
        if (respuesta.status === 409) {
          setMensaje('Este correo ya está registrado. Prueba con otro.');
        } else {
          setMensaje(
            datos.mensaje ||
            `No se pudieron guardar los cambios (${respuesta.status}).`
          );
        }

        return;
      }

      const usuarioActualizado = datos.usuario;

      setUsuario(usuarioActualizado);
      setFormulario({
        nombre: usuarioActualizado.nombre || '',
        email: usuarioActualizado.email || '',
        universidad: usuarioActualizado.universidad || '',
        ciudad: usuarioActualizado.ciudad || ''
      });

      sessionStorage.setItem(
        'movuUsuario',
        JSON.stringify(usuarioActualizado)
      );

      setModalAbierto(false);

    } catch (error) {
      console.error('Error al guardar el perfil:', error);
      setMensaje('No se pudo conectar con el servidor. Inténtalo nuevamente.');

    } finally {
      setGuardando(false);
    }
  }

  // Actualizar favoritos cuando cambia una tarjeta.
  function manejarCambioFavorito(rutaId, esFavorita) {
    if (!esFavorita) {
      setFavoritos(previo =>
        previo.filter(ruta => ruta._id !== rutaId)
      );
    }
  }

  // Eliminar una consulta individual.
  async function eliminarConsulta(id) {
    if (!window.confirm('¿Quieres eliminar esta consulta del historial?')) {
      return;
    }

    const token = sessionStorage.getItem('movuToken');

    try {
      const respuesta = await fetch(
        `${API_URL}/api/historial/${id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const datos = await respuesta.json().catch(() => ({}));

      if (!respuesta.ok) {
        throw new Error(datos.mensaje || 'No se pudo eliminar la consulta.');
      }

      setHistorial(previo =>
        previo.filter(consulta => consulta._id !== id)
      );

    } catch (error) {
      console.error('Error al eliminar la consulta:', error);
      alert('No fue posible eliminar la consulta.');
    }
  }

  // Limpiar todo el historial.
  async function limpiarHistorial() {
    if (!window.confirm('¿Estás seguro de que quieres eliminar todo tu historial?')) {
      return;
    }

    const token = sessionStorage.getItem('movuToken');

    try {
      const respuesta = await fetch(`${API_URL}/api/historial`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const datos = await respuesta.json().catch(() => ({}));

      if (!respuesta.ok) {
        throw new Error(datos.mensaje || 'No se pudo limpiar el historial.');
      }

      setHistorial([]);

    } catch (error) {
      console.error('Error al limpiar el historial:', error);
      alert('No fue posible limpiar el historial.');
    }
  }

  if (cargando) {
    return <p>Cargando perfil...</p>;
  }

  if (!usuario) {
    return null;
  }

  return (
    <>
      <Nav />

      <main id="profile-main">

        {/* INFORMACIÓN DE LA CUENTA */}
        <section id="profile-header">

          <div id="profile-header-right">
            <h1>Mi cuenta</h1>

            <p>
              Nombre de usuario: {' '}
              <span id="profile-username">
                {usuario.nombre || 'Sin nombre'}
              </span>
            </p>

            <p>
              Email: {' '}
              <span id="profile-email">
                {usuario.email || 'Sin correo'}
              </span>
            </p>
          </div>

          <div id="profileedit">
            <button type="button" onClick={abrirModal}>
              Editar perfil
            </button>
          </div>

          {/* MODAL DE EDICIÓN */}
          {modalAbierto && (
            <div
              id="modal-editar-perfil"
              className="modal abierto"
              aria-hidden="false"
              onClick={event => {
                if (event.target === event.currentTarget) {
                  cerrarModal();
                }
              }}
            >
              <div
                className="modal-contenido"
                role="dialog"
                aria-modal="true"
                aria-labelledby="titulo-modal"
              >
                <button
                  type="button"
                  id="btn-cerrar-modal"
                  className="modal-cerrar"
                  aria-label="Cerrar"
                  onClick={cerrarModal}
                >
                  &times;
                </button>

                <h2 id="titulo-modal">Editar perfil</h2>
                <p>Actualiza tu información personal y académica.</p>


                <form onSubmit={guardarPerfil}>

                  {/* INFORMACIÓN PERSONAL */}
                  <div className="grupo-perfil">

                    <div className="campo-perfil">
                      <label htmlFor="editar-nombre">Nombre completo</label>
                      <input
                        type="text"
                        id="editar-nombre"
                        name="nombre"
                        minLength="2"
                        required
                        value={formulario.nombre}
                        onChange={manejarCambio}
                      />
                    </div>

                    <div className="campo-perfil">
                      <label htmlFor="editar-email">Correo electrónico</label>
                      <input
                        type="email"
                        id="editar-email"
                        name="email"
                        required
                        value={formulario.email}
                        onChange={manejarCambio}
                      />
                    </div>

                  </div>

                  <hr />

                  {/* INFORMACIÓN ACADÉMICA */}
                  <h3>Información académica</h3>

                  <div className="grupo-perfil">

                    <div className="campo-perfil">
                      <label htmlFor="editar-universidad">
                        Universidad o institución
                      </label>
                      <input
                        type="text"
                        id="editar-universidad"
                        name="universidad"
                        placeholder="Ej. Universidad del Norte"
                        value={formulario.universidad}
                        onChange={manejarCambio}
                      />
                    </div>

                    <div className="campo-perfil">
                      <label htmlFor="editar-ciudad">Ciudad</label>
                      <input
                        type="text"
                        id="editar-ciudad"
                        name="ciudad"
                        placeholder="Ej. Barranquilla"
                        value={formulario.ciudad}
                        onChange={manejarCambio}
                      />
                    </div>

                  </div>

                  {/* MENSAJES */}
                  {mensaje && (
                    <p id="mensaje-perfil" role="status" aria-live="polite">
                      {mensaje}
                    </p>
                  )}

                  {/* BOTONES */}
                  <div className="modal-acciones">

                    <button
                      type="button"
                      id="btn-cancelar-modal"
                      onClick={cerrarModal}
                    >
                      Cancelar
                    </button>

                    <button
                      type="submit"
                      id="btn-guardar-perfil"
                      disabled={guardando}
                    >
                      {guardando ? 'Guardando...' : 'Guardar cambios'}
                    </button>

                  </div>

                </form>

              </div>
            </div>
          )}

        </section>

        {/* INFORMACIÓN ACADÉMICA */}
        <section id="universidad">
          <h2>Mi información académica</h2>

          <p id="nombreUniversidad">
            {usuario.universidad || 'Sin universidad'}
          </p>

          <p id="ubicacionUniversidad">
            {usuario.ciudad || ''}
          </p>
        </section>

        {/* RUTAS FAVORITAS */}
        <section id="rutasFavoritas">

          <div className="section-header">
            <div>
              <span className="section-title">Tus rutas guardadas</span>
              <h2>Rutas favoritas</h2>
            </div>

            <a href="/catalogo">Explorar rutas →</a>
          </div>

          <div id="fav-container" className="route-grid">

            {favoritos.length > 0 ? (
              favoritos.map(ruta => (
                <Cards
                  key={ruta._id}
                  ruta={ruta}
                  esFavorita={true}
                  onFavChange={manejarCambioFavorito}
                />
              ))
            ) : (
              <p>Aún no tienes rutas guardadas.</p>
            )}

          </div>
        </section>

        {/* HISTORIAL */}
        <section id="historial-rutas">

          <div className="section-header">
            <div>
              <span className="section-title">Tu actividad</span>
              <h2>Historial de rutas</h2>
              <p>Consulta y administra las rutas que has explorado.</p>
            </div>

            <button
              type="button"
              id="limpiar-historial"
              className="clear-history-btn"
              onClick={limpiarHistorial}
              disabled={historial.length === 0}
            >
              Limpiar historial
            </button>
          </div>

          <div id="historial-container" className="route-grid">

            {historial.length > 0 ? (
              historial.map(consulta => (
                <div className="history-entry" key={consulta._id}>

                  <p className="history-date">
                    Consultada: {' '}
                    {consulta.fecha
                      ? new Date(consulta.fecha).toLocaleString('es-CO', {
                        dateStyle: 'medium',
                        timeStyle: 'short'
                      })
                      : 'Fecha no disponible'}
                  </p>

                  {consulta.ruta ? (
                    <Cards
                      ruta={consulta.ruta}
                      esFavorita={favoritos.some(
                        ruta => ruta._id === consulta.ruta._id
                      )}
                      onFavChange={manejarCambioFavorito}
                    />
                  ) : (
                    <p>Esta ruta ya no está disponible.</p>
                  )}

                  <button
                    type="button"
                    className="delete-history-btn"
                    onClick={() => eliminarConsulta(consulta._id)}
                  >
                    Eliminar consulta
                  </button>

                </div>
              ))
            ) : (
              <p>Aún no has consultado ninguna ruta.</p>
            )}

          </div>
        </section>

        {/* CONFIGURACIÓN */}
        <section id="configuracion">

          <div className="section-header">
            <div>
              <span className="section-title">Preferencias</span>
              <h2>Configuración</h2>
            </div>
          </div>

          <div className="settingitem">
            <div>
              <h3>Notificaciones</h3>
              <p>Administra los avisos y novedades de Movu.</p>
            </div>
          </div>

          <div className="settingitem">
            <div>
              <h3>Seguridad</h3>
              <p>Gestiona la seguridad y el acceso a tu cuenta.</p>
            </div>
          </div>

          <div className="settingitem">
            <div>
              <h3>Privacidad</h3>
              <p>Consulta y administra el uso de tu información.</p>
            </div>
          </div>

        </section>

      </main>

      <footer></footer>
    </>
  );
}

export default Profile;
