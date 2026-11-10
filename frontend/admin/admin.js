import API_URL from '../src/config/api.js';
let todosLosUsuarios = [];

document.addEventListener("DOMContentLoaded", async () => {
  const token = sessionStorage.getItem("movuToken");

  // Verificar que exista una sesión
  if (!token) {
    window.location.href = "../index.html";
    return;
  }

  try {
    // Verificar permisos de administrador
    const respuesta = await fetch(`${API_URL}/api/admin/prueba`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    // Cerrar sesión si no tiene permisos
    if (respuesta.status === 401 || respuesta.status === 403) {
      sessionStorage.removeItem("movuToken");
      sessionStorage.removeItem("movuUsuario");
      window.location.href = "../index.html";
      return;
    }

    if (!respuesta.ok) {
      throw new Error("No se pudo verificar el acceso administrativo.");
    }

    const datos = await respuesta.json();

    // Mostrar información del administrador
    const usuario = JSON.parse(
      sessionStorage.getItem("movuUsuario") || "{}"
    );

    const nombre = usuario.nombre || datos.usuario || "Administrador";

    const nombreElemento = document.querySelector(".admin-info strong");
    const avatarElemento = document.querySelector(".admin-avatar");

    if (nombreElemento) {
      nombreElemento.textContent = nombre;
    }

    if (avatarElemento) {
      avatarElemento.textContent = nombre.trim().charAt(0).toUpperCase();
    }

    // Cargar estadísticas
    await cargarEstadisticas();
    cargarActualizaciones();

    // Configurar navegación
    configurarNavegacion();



  } catch (error) {
    console.error("Error al verificar el acceso:", error);
    alert("No se pudo verificar tu sesión. Comprueba que el servidor esté funcionando.");
  }
});
let todasLasActividades = [];

// Cargar estadísticas del dashboard
async function cargarEstadisticas() {
  const token = sessionStorage.getItem("movuToken");

  try {
    const respuesta = await fetch(
      `${API_URL}/api/admin/estadisticas`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    if (!respuesta.ok) {
      throw new Error("No se pudieron cargar las estadísticas.");
    }

    const datos = await respuesta.json();

    document.getElementById("total-usuarios").textContent = datos.usuarios;
    document.getElementById("total-rutas").textContent = datos.rutas;
    document.getElementById("total-consultas").textContent = datos.consultas;
    document.getElementById("total-novedades").textContent = datos.novedadesActivas;

  } catch (error) {
    console.error("Error al cargar estadísticas:", error);
  }
}
// Cargar las últimas cinco actividades
async function cargarActualizaciones() {
  const contenedor = document.getElementById('lista-actualizaciones');

  if (!contenedor) return;

  const token = sessionStorage.getItem('movuToken');

  try {
    const respuesta = await fetch(`${API_URL}/api/admin/actividad`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!respuesta.ok) {
      throw new Error('No se pudieron cargar las actividades.');
    }

    const actividades = await respuesta.json();

    if (actividades.length === 0) {
      contenedor.innerHTML = '<p>No hay actualizaciones registradas todavía.</p>';
      return;
    }

    contenedor.innerHTML = actividades.map(actividad => {
      const esRuta = actividad.tipo === 'ruta';

      const acciones = {
        creada: 'creada',
        actualizada: 'actualizada',
        eliminada: 'eliminada'
      };

      const fecha = new Date(actividad.fecha).toLocaleString('es-CO', {
        dateStyle: 'short',
        timeStyle: 'short'
      });

      return `
        <div class="update-item">
          <div class="update-icon ${esRuta ? 'route' : 'news'}">
            ${esRuta ? '↔' : '!'}
          </div>

          <div class="update-content">
            <strong>${esRuta ? 'Ruta' : 'Novedad'} ${acciones[actividad.accion] || actividad.accion}</strong>
            <p>${actividad.titulo}</p>
            <small>${actividad.descripcion || ''}</small>
          </div>

          <span class="update-date">${fecha}</span>
        </div>
      `;
    }).join('');

  } catch (error) {
    console.error('Error al cargar actualizaciones:', error);
    contenedor.innerHTML = '<p>No fue posible cargar las actualizaciones.</p>';
  }
}

// Cambiar entre las vistas del panel
function configurarNavegacion() {
  const enlaceDashboard = document.getElementById("enlace-dashboard");
  const enlaceRutas = document.getElementById("enlace-rutas");
  const enlaceNovedades = document.getElementById("enlace-novedades");
  const enlaceActualizaciones = document.getElementById('enlace-actualizaciones');
  const vistaDashboard = document.getElementById("vista-dashboard");
  const vistaRutas = document.getElementById("vista-rutas");
  const vistaNovedades = document.getElementById("vista-novedades");
  const vistaActualizaciones = document.getElementById("vista-actualizaciones");
  const enlaceUsuarios = document.getElementById('enlace-usuarios');
  const vistaUsuarios = document.getElementById('vista-usuarios');

  if (
    !enlaceDashboard ||
    !enlaceRutas ||
    !enlaceNovedades ||
    !vistaDashboard ||
    !vistaRutas ||
    !vistaNovedades
  ) {
    console.error("No se encontraron los elementos de navegación.");
    return;
  }
  if (enlaceActualizaciones) {
    enlaceActualizaciones.addEventListener('click', (evento) => {
      evento.preventDefault();
      mostrarVista('actualizaciones');
      cargarHistorialActualizaciones();
    });
  }

  enlaceDashboard.addEventListener("click", (evento) => {
    evento.preventDefault();
    mostrarVista("dashboard");
  });
  enlaceRutas.addEventListener("click", (evento) => {
    evento.preventDefault();
    mostrarVista("rutas");
    cargarRutas();
  });
  if (enlaceUsuarios) {
    enlaceUsuarios.addEventListener('click', evento => {
      evento.preventDefault();
      mostrarVista('usuarios');
    });
  }
  if (enlaceUsuarios) {
    enlaceUsuarios.addEventListener('click', evento => {
      evento.preventDefault();
      mostrarVista('usuarios');
      cargarUsuarios();
    });
  }
  enlaceNovedades.addEventListener("click", (evento) => {
    evento.preventDefault();
    mostrarVista("novedades");
    cargarNovedades();
  });
  // Cargar el historial completo de actividades

  // Abrir el formulario para agregar una ruta
  const botonAgregarRuta = document.getElementById("btn-agregar-ruta");
  const modalRuta = document.getElementById("formulario-ruta");
  const formularioRuta = document.getElementById("form-ruta");

  const botonCancelarRuta = document.getElementById("cancelar-ruta");
  const botonCerrarRuta = document.getElementById("cerrar-modal-ruta");

  function cerrarModalRuta() {
    modalRuta.hidden = true;
    formularioRuta.reset();

    rutaEditando = null;

    document.querySelector("#formulario-ruta h2").textContent = "Crear ruta";
    document.getElementById("guardar-ruta").textContent = "Guardar ruta";
  }

  if (botonAgregarRuta) {
    botonAgregarRuta.addEventListener("click", () => {
      mostrarVista("rutas");
      cargarRutas();
      formularioRuta.reset();
      modalRuta.hidden = false;
    });
  }

  if (botonCancelarRuta) {
    botonCancelarRuta.addEventListener("click", cerrarModalRuta);
  }

  if (botonCerrarRuta) {
    botonCerrarRuta.addEventListener("click", cerrarModalRuta);
  }

  if (modalRuta) {
    modalRuta.addEventListener("click", (evento) => {
      if (evento.target === modalRuta) {
        cerrarModalRuta();
      }
    });
  }

  // Abrir el modal para crear una novedad
  const botonNuevaNovedad = document.getElementById("btn-nueva-novedad");
  const modalNovedad = document.getElementById("formulario-novedad");
  const listaNovedades = document.getElementById("lista-novedades");

  const botonCancelar = document.getElementById("cancelar-novedad");
  const botonCerrar = document.getElementById("cerrar-modal");

  function cerrarModalNovedad() {
    modalNovedad.hidden = true;
    formularioNovedad.reset();

    novedadEditando = null;

    document.querySelector("#formulario-novedad h2").textContent =
      "Crear novedad";

    document.getElementById("guardar-novedad").textContent =
      "Guardar novedad";
  }

  if (botonNuevaNovedad) {
    botonNuevaNovedad.addEventListener("click", () => {
      mostrarVista("novedades");
      listaNovedades.hidden = false;
      modalNovedad.hidden = false;
    });
  }

  if (botonCancelar) {
    botonCancelar.addEventListener("click", cerrarModalNovedad);
  }

  if (botonCerrar) {
    botonCerrar.addEventListener("click", cerrarModalNovedad);
  }

  // Cerrar al hacer clic fuera del contenido
  if (modalNovedad) {
    modalNovedad.addEventListener("click", (evento) => {
      if (evento.target === modalNovedad) {
        cerrarModalNovedad();
      }
    });
  }

  // Editar una novedad existente
  listaNovedades.addEventListener("click", async (evento) => {

    const botonEditar = evento.target.closest(".btn-editar-novedad");

    if (!botonEditar) return;

    const id = botonEditar.dataset.id;
    const token = sessionStorage.getItem("movuToken");

    try {
      // Consultar las novedades registradas
      const respuesta = await fetch(
        `${API_URL}/api/admin/novedades`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (!respuesta.ok) {
        throw new Error("No se pudieron consultar las novedades.");
      }

      const novedades = await respuesta.json();

      // Buscar la novedad seleccionada
      const novedad = novedades.find(item => item._id === id);

      if (!novedad) {
        throw new Error("No se encontró la novedad seleccionada.");
      }

      // Cargar los datos en el formulario
      document.getElementById("titulo-novedad").value = novedad.titulo;
      document.getElementById("tipo-novedad").value = novedad.tipo;
      document.getElementById("descripcion-novedad").value = novedad.descripcion;
      document.getElementById("ubicacion-novedad").value = novedad.ubicacion || "";
      document.getElementById("empresa-novedad").value = novedad.empresa || "";
      document.getElementById("ruta-novedad").value = novedad.ruta || "";
      document.getElementById("estado-novedad").value = novedad.estado;

      // Adaptar las fechas al formato del campo datetime-local
      function convertirFecha(fecha) {
        if (!fecha) return "";

        const fechaLocal = new Date(fecha);
        fechaLocal.setMinutes(
          fechaLocal.getMinutes() - fechaLocal.getTimezoneOffset()
        );

        return fechaLocal.toISOString().slice(0, 16);
      }

      document.getElementById("inicio-novedad").value =
        convertirFecha(novedad.fechaInicio);

      document.getElementById("fin-novedad").value =
        convertirFecha(novedad.fechaFin);

      // Identificar el registro que se va a actualizar
      novedadEditando = id;

      document.querySelector("#formulario-novedad h2").textContent =
        "Editar novedad";

      document.getElementById("guardar-novedad").textContent =
        "Guardar cambios";

      // Abrir el modal
      mostrarVista("novedades");
      listaNovedades.hidden = false;
      modalNovedad.hidden = false;

    } catch (error) {
      console.error("Error al cargar la novedad:", error);
      alert(error.message);
    }
  });


  function mostrarVista(vista) {
    vistaDashboard.hidden = vista !== "dashboard";
    vistaRutas.hidden = vista !== "rutas";
    vistaNovedades.hidden = vista !== "novedades";
    vistaActualizaciones.hidden = vista !== "actualizaciones";
    vistaUsuarios.hidden = vista !== 'usuarios';
    enlaceUsuarios.classList.toggle('active', vista === 'usuarios');
    enlaceDashboard.classList.toggle("active", vista === "dashboard");
    enlaceRutas.classList.toggle("active", vista === "rutas");
    enlaceNovedades.classList.toggle("active", vista === "novedades");
    enlaceActualizaciones.classList.toggle("active", vista === "actualizaciones");

    const titulo = document.querySelector(".topbar h1");
    const breadcrumb = document.querySelector(".breadcrumb");

    const nombres = {
      dashboard: "Dashboard",
      rutas: "Rutas",
      novedades: "Novedades",
      actualizaciones: "Actualizaciones",
      usuarios: 'Usuarios'
    };

    if (titulo) {
      titulo.textContent = nombres[vista];
    }

    if (breadcrumb) {
      breadcrumb.textContent = `ADMIN / ${nombres[vista].toUpperCase()}`;
    }
  }
  // Eventos de los filtros de usuarios
  const buscadorUsuarios = document.getElementById('buscar-usuario');
  const filtroRolUsuarios = document.getElementById('filtro-rol-usuario');

  if (buscadorUsuarios) {
    buscadorUsuarios.addEventListener('input', filtrarUsuarios);
  }

  if (filtroRolUsuarios) {
    filtroRolUsuarios.addEventListener('change', filtrarUsuarios);
  }
}
async function cargarHistorialActualizaciones() {
  const contenedor = document.getElementById('historial-actualizaciones');

  try {
    const token = sessionStorage.getItem('movuToken');

    const respuesta = await fetch(
      `${API_URL}/api/admin/actividad?todas=true`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    if (!respuesta.ok) {
      throw new Error('No se pudo cargar el historial');
    }

    todasLasActividades = await respuesta.json();

    filtrarActualizaciones();

  } catch (error) {
    console.error('Error al cargar el historial:', error);
    contenedor.innerHTML = '<p>Error al cargar el historial de actualizaciones.</p>';
  }

  // Eventos de los filtros del historial
  const buscadorActualizaciones = document.getElementById('buscar-actualizacion');
  const fechaActualizaciones = document.getElementById('fecha-actualizacion');
  const btnLimpiarFiltros = document.getElementById('limpiar-filtros');

  if (buscadorActualizaciones) {
    buscadorActualizaciones.addEventListener('input', filtrarActualizaciones);
  }

  if (fechaActualizaciones) {
    fechaActualizaciones.addEventListener('change', filtrarActualizaciones);
  }

  if (btnLimpiarFiltros) {
    btnLimpiarFiltros.addEventListener('click', () => {
      buscadorActualizaciones.value = '';
      fechaActualizaciones.value = '';

      filtrarActualizaciones();
    });
  }
}
function filtrarActualizaciones() {
  const contenedor = document.getElementById('historial-actualizaciones');
  const buscador = document.getElementById('buscar-actualizacion');
  const filtroFecha = document.getElementById('fecha-actualizacion');

  const busqueda = buscador.value.trim().toLowerCase();
  const fechaSeleccionada = filtroFecha.value;

  const actividadesFiltradas = todasLasActividades.filter(actividad => {
    // Buscar por título, descripción, tipo o acción
    const textoActividad = `
      ${actividad.titulo}
      ${actividad.descripcion}
      ${actividad.tipo}
      ${actividad.accion}
    `.toLowerCase();

    const coincideBusqueda = textoActividad.includes(busqueda);

    // Comparar la fecha de la actividad con la fecha seleccionada
    const fechaActividad = new Date(actividad.fecha);

    const fechaLocal = [
      fechaActividad.getFullYear(),
      String(fechaActividad.getMonth() + 1).padStart(2, '0'),
      String(fechaActividad.getDate()).padStart(2, '0')
    ].join('-');

    const coincideFecha = !fechaSeleccionada ||
      fechaLocal === fechaSeleccionada;

    return coincideBusqueda && coincideFecha;
  });

  if (actividadesFiltradas.length === 0) {
    contenedor.innerHTML = `
      <p>No se encontraron actividades con esos filtros.</p>
    `;
    return;
  }

  contenedor.innerHTML = actividadesFiltradas.map(actividad => {
    const fecha = new Date(actividad.fecha).toLocaleString('es-CO', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const icono = actividad.tipo === 'ruta' ? '🚌' : '📢';

    return `
      <div class="update-item">
        <div class="update-icon ${actividad.tipo}">
          ${icono}
        </div>

        <div class="update-content">
          <strong>${escaparHTML(actividad.titulo)}</strong>
          <p>${escaparHTML(actividad.descripcion)}</p>
          <span class="update-date">${fecha}</span>
        </div>
      </div>
    `;
  }).join('');
}
function escaparHTML(texto) {
  return String(texto ?? '').replace(/[&<>"']/g, caracter => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[caracter]));
}
// Cargar las rutas registradas
// Cargar las rutas registradas
async function cargarRutas() {
  const token = sessionStorage.getItem("movuToken");
  const contenedor = document.getElementById("lista-rutas");

  if (!contenedor) return;

  contenedor.innerHTML = "<p>Cargando rutas...</p>";

  try {
    const respuesta = await fetch(
      `${API_URL}/api/admin/rutas`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    if (!respuesta.ok) {
      throw new Error("No se pudieron cargar las rutas.");
    }

    const rutas = await respuesta.json();

    if (rutas.length === 0) {
      contenedor.innerHTML = "<p>No hay rutas registradas.</p>";
      return;
    }

    contenedor.innerHTML = rutas.map(ruta => `
      <article class="novelty-card">

        <div class="novelty-header">
          <span class="novelty-status">
            ${ruta.busstatus || "Sin estado"}
          </span>

          <span class="novelty-date">
            ${ruta.busCode || "Sin código"}
          </span>
        </div>

        <h3>${ruta["company-name"] || "Sin empresa"}</h3>

        <p>
          <strong>Recorrido:</strong>
          ${ruta.origen || "Sin origen"} → ${ruta.destino || "Sin destino"}
        </p>

        <span class="novelty-route">
          Identificador: ${ruta.routeId || "Sin identificador"}
        </span>

        <div class="route-details">

          <p>
            <strong>Paradas:</strong>
            ${ruta.stop || "Sin información"}
          </p>

          <p>
            <strong>Precio:</strong>
            ${ruta.precio || "Por verificar"}
          </p>

          <p>
            <strong>Tiempo estimado:</strong>
            ${ruta.tiempo || "Por verificar"}
          </p>

          <p>
            <strong>Horario:</strong>
            ${ruta.horario || "Por verificar"}
          </p>

          <p>
            <strong>Tipo de transporte:</strong>
            ${ruta.Tipo || "Sin especificar"}
          </p>

          <p>
            <strong>Universidades:</strong>
            ${ruta["Universidades "] || ruta.Universidades || "Sin información"}
          </p>

          <p>
            <strong>Fuente:</strong>
            ${ruta.Fuente || "Sin información"}
          </p>

        </div>
        
        <div class="novelty-actions">
  <button
    type="button"
    class="btn-editar-ruta"
    data-id="${ruta._id}">
    Editar
  </button>

  <button
    type="button"
    class="btn-eliminar-ruta"
    data-id="${ruta._id}">
    Eliminar
  </button>
</div>
        
      </article>
    `).join("");

  } catch (error) {
    console.error("Error al cargar las rutas:", error);
    contenedor.innerHTML = "<p>No se pudieron cargar las rutas.</p>";
  }
}

// Identificador de la ruta que se está editando
let rutaEditando = null;

// Editar una ruta existente
document.getElementById("lista-rutas").addEventListener("click", async (evento) => {
  const botonEditar = evento.target.closest(".btn-editar-ruta");

  if (!botonEditar) return;

  const id = botonEditar.dataset.id;
  const token = sessionStorage.getItem("movuToken");

  try {
    // Consultar las rutas registradas
    const respuesta = await fetch(
      `${API_URL}/api/admin/rutas`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    if (!respuesta.ok) {
      throw new Error("No se pudieron consultar las rutas.");
    }

    const rutas = await respuesta.json();

    // Buscar la ruta seleccionada
    const ruta = rutas.find(item => item._id === id);

    if (!ruta) {
      throw new Error("No se encontró la ruta seleccionada.");
    }

    // Cargar los datos en el formulario
    document.getElementById("routeId").value = ruta.routeId || "";
    document.getElementById("empresa-ruta").value = ruta["company-name"] || "";
    document.getElementById("codigo-ruta").value = ruta.busCode || "";
    document.getElementById("origen-ruta").value = ruta.origen || "";
    document.getElementById("destino-ruta").value = ruta.destino || "";
    document.getElementById("paradas-ruta").value = ruta.stop || "";
    document.getElementById("precio-ruta").value = ruta.precio || "";
    document.getElementById("tiempo-ruta").value = ruta.tiempo || "";
    document.getElementById("horario-ruta").value = ruta.horario || "";
    document.getElementById("tipo-ruta").value = ruta.Tipo || "";
    document.getElementById("estado-ruta").value = ruta.busstatus || "Activa";
    document.getElementById("fuente-ruta").value = ruta.Fuente || "";
    document.getElementById("universidades-ruta").value =
      ruta["Universidades "] || ruta.Universidades || "";

    // Identificar la ruta que se va a actualizar
    rutaEditando = id;

    // Cambiar el título y el botón del formulario
    document.querySelector("#formulario-ruta h2").textContent = "Editar ruta";
    document.getElementById("guardar-ruta").textContent = "Guardar cambios";

    // Abrir el formulario
    document.getElementById("formulario-ruta").hidden = false;

  } catch (error) {
    console.error("Error al cargar la ruta:", error);
    alert(error.message);
  }
});
async function cargarUsuarios() {
  const contenedor = document.getElementById('lista-usuarios');
  const totalUsuarios = document.getElementById('total-usuarios-listado');

  try {
    const token = sessionStorage.getItem('movuToken');

    const respuesta = await fetch(
      `${API_URL}/api/admin/usuarios`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    if (!respuesta.ok) {
      throw new Error('No se pudieron cargar los usuarios');
    }

    const datos = await respuesta.json();

    // Guardar todos los usuarios recibidos
    todosLosUsuarios = datos.usuarios;

    // Actualizar el contador
    totalUsuarios.textContent = datos.total;

    // Mostrar los usuarios aplicando los filtros
    filtrarUsuarios();

  } catch (error) {
    console.error('Error al cargar usuarios:', error);
    contenedor.innerHTML = '<p>Error al cargar los usuarios.</p>';
  }
}
function filtrarUsuarios() {
  const buscador = document.getElementById('buscar-usuario');
  const filtroRol = document.getElementById('filtro-rol-usuario');
  const contenedor = document.getElementById('lista-usuarios');

  const busqueda = buscador.value.trim().toLowerCase();
  const rolSeleccionado = filtroRol.value;

  const usuariosFiltrados = todosLosUsuarios.filter(usuario => {
    const coincideBusqueda =
      usuario.nombre.toLowerCase().includes(busqueda) ||
      usuario.email.toLowerCase().includes(busqueda);

    const coincideRol =
      !rolSeleccionado || usuario.rol === rolSeleccionado;

    return coincideBusqueda && coincideRol;
  });

  if (usuariosFiltrados.length === 0) {
    contenedor.innerHTML = '<p>No se encontraron usuarios.</p>';
    return;
  }

  mostrarUsuarios(usuariosFiltrados);
}
function mostrarUsuarios(usuarios) {
  const contenedor = document.getElementById('lista-usuarios');

  contenedor.innerHTML = usuarios.map(usuario => {
    const fecha = new Date(usuario.createdAt).toLocaleDateString('es-CO', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });

    return `
      <article class="usuario-item">
        <div class="usuario-avatar">
          ${escaparHTML(usuario.nombre.charAt(0).toUpperCase())}
        </div>

        <div class="usuario-info">
          <strong>${escaparHTML(usuario.nombre)}</strong>
          <span>${escaparHTML(usuario.email)}</span>
          <span>${escaparHTML(usuario.universidad || 'Universidad no registrada')}</span>
        </div>

        <div class="usuario-detalles">
          <span class="usuario-rol ${usuario.rol}">
            ${usuario.rol === 'admin' ? 'Administrador' : 'Usuario'}
          </span>
          <span class="usuario-fecha">Registro: ${fecha}</span>
          <span class="usuario-estado ${usuario.activo ? 'activo' : 'inactivo'}">
            ${usuario.activo ? 'Activo' : 'Inactivo'}
          </span>
        </div>
      </article>
    `;
  }).join('');
}

async function cargarNovedades() {
  const token = sessionStorage.getItem("movuToken");
  const contenedor = document.getElementById("lista-novedades");

  if (!contenedor) return;

  contenedor.innerHTML = "<p>Cargando novedades...</p>";

  try {
    const respuesta = await fetch(
      `${API_URL}/api/admin/novedades`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    if (!respuesta.ok) {
      throw new Error("No se pudieron cargar las novedades.");
    }

    const novedades = await respuesta.json();

    if (novedades.length === 0) {
      contenedor.innerHTML = "<p>No hay novedades registradas.</p>";
      return;
    }

    contenedor.innerHTML = novedades.map(novedad => `
  <article class="novelty-card">

    <div class="novelty-header">
      <span class="novelty-status">
        ${novedad.estado}
      </span>

      <span class="novelty-date">
        ${new Date(novedad.fechaInicio).toLocaleDateString("es-CO")}
      </span>
    </div>

    <h3>${novedad.titulo}</h3>

    <p>${novedad.descripcion}</p>

    <span class="novelty-route">
      ${novedad.ruta || "Sin ruta asociada"}
      ${novedad.empresa ? " · " + novedad.empresa : ""}
    </span>

    <div class="novelty-actions">
      <button
        type="button"
        class="btn-editar-novedad"
        data-id="${novedad._id}">
        Editar
      </button>

      <button
        type="button"
        class="btn-eliminar-novedad"
        data-id="${novedad._id}">
        Eliminar
      </button>
    </div>

  </article>
`).join("");


  } catch (error) {
    console.error("Error al cargar novedades:", error);
    contenedor.innerHTML = "<p>No se pudieron cargar las novedades.</p>";
  }
}
// Guardar una nueva novedad
const formularioNovedad = document.getElementById("form-novedad");
// Identificador de la novedad que se está editando
let novedadEditando = null;

formularioNovedad.addEventListener("submit", async (evento) => {
  evento.preventDefault();

  const token = sessionStorage.getItem("movuToken");

  const nuevaNovedad = {
    titulo: document.getElementById("titulo-novedad").value.trim(),
    tipo: document.getElementById("tipo-novedad").value,
    descripcion: document.getElementById("descripcion-novedad").value.trim(),
    ubicacion: document.getElementById("ubicacion-novedad").value.trim(),
    empresa: document.getElementById("empresa-novedad").value.trim(),
    ruta: document.getElementById("ruta-novedad").value.trim(),
    fechaInicio: document.getElementById("inicio-novedad").value,
    fechaFin: document.getElementById("fin-novedad").value || null,
    estado: document.getElementById("estado-novedad").value
  };

  try {
    const url = novedadEditando
      ? `${API_URL}/api/admin/novedades/${novedadEditando}`
      : `${API_URL}/api/admin/novedades`;

    const metodo = novedadEditando ? "PUT" : "POST";

    const respuesta = await fetch(url, {
      method: metodo,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(nuevaNovedad)
    });

    const datos = await respuesta.json();

    if (!respuesta.ok) {
      throw new Error(datos.mensaje || "No se pudo guardar la novedad.");
    }

    alert(
      novedadEditando
        ? "¡Novedad actualizada correctamente!"
        : "¡Novedad creada correctamente!"
    );

    formularioNovedad.reset();
    document.getElementById("formulario-novedad").hidden = true;

    novedadEditando = null;

    document.querySelector("#formulario-novedad h2").textContent = "Crear novedad";
    document.getElementById("guardar-novedad").textContent = "Guardar novedad";
    await cargarNovedades();
    await cargarEstadisticas();

  } catch (error) {
    console.error("Error al guardar la novedad:", error);
    alert(error.message);
  }
});

// Eliminar una novedad
document.addEventListener("click", async (evento) => {

  const boton = evento.target.closest(".btn-eliminar-novedad");

  if (!boton) return;

  const id = boton.dataset.id;

  const confirmar = confirm(
    "¿Estás segura de que deseas eliminar esta novedad? Esta acción no se puede deshacer."
  );

  if (!confirmar) return;

  const token = sessionStorage.getItem("movuToken");

  try {
    const respuesta = await fetch(
      `${API_URL}/api/admin/novedades/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const datos = await respuesta.json();

    if (!respuesta.ok) {
      throw new Error(datos.mensaje || "No se pudo eliminar la novedad.");
    }

    alert("Novedad eliminada correctamente.");

    await cargarNovedades();
    await cargarEstadisticas();

  } catch (error) {
    console.error("Error al eliminar la novedad:", error);
    alert(error.message);
  }

});
// Eliminar una ruta
document.addEventListener("click", async (evento) => {
  const boton = evento.target.closest(".btn-eliminar-ruta");

  if (!boton) return;

  const id = boton.dataset.id;

  const confirmar = confirm(
    "¿Deseas eliminar esta ruta? También se eliminará de los favoritos y del historial de consultas de los usuarios."
  );

  if (!confirmar) return;

  const token = sessionStorage.getItem("movuToken");

  try {
    const respuesta = await fetch(
      `${API_URL}/api/admin/rutas/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const datos = await respuesta.json();

    if (!respuesta.ok) {
      throw new Error(datos.mensaje || "No se pudo eliminar la ruta.");
    }

    alert("Ruta eliminada correctamente.");

    await cargarRutas();
    await cargarEstadisticas();

  } catch (error) {
    console.error("Error al eliminar la ruta:", error);
    alert(error.message);
  }
});
// Cerrar sesión del administrador
const botonCerrarSesion = document.querySelector(".logout");

if (botonCerrarSesion) {
  botonCerrarSesion.addEventListener("click", (evento) => {
    evento.preventDefault();

    const confirmar = confirm("¿Deseas cerrar tu sesión?");

    if (!confirmar) return;

    sessionStorage.removeItem("movuToken");
    sessionStorage.removeItem("movuUsuario");

    window.location.href = "../index.html";
  });
}
// Crear una nueva ruta
const formularioRuta = document.getElementById("form-ruta");

if (formularioRuta) {
  formularioRuta.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    const token = sessionStorage.getItem("movuToken");

    const nuevaRuta = {
      routeId: document.getElementById("routeId").value.trim(),
      "company-name": document.getElementById("empresa-ruta").value.trim(),
      busCode: document.getElementById("codigo-ruta").value.trim(),
      origen: document.getElementById("origen-ruta").value.trim(),
      destino: document.getElementById("destino-ruta").value.trim(),
      stop: document.getElementById("paradas-ruta").value.trim(),
      precio: document.getElementById("precio-ruta").value.trim(),
      tiempo: document.getElementById("tiempo-ruta").value.trim(),
      horario: document.getElementById("horario-ruta").value.trim(),
      Tipo: document.getElementById("tipo-ruta").value.trim(),
      busstatus: document.getElementById("estado-ruta").value,
      Fuente: document.getElementById("fuente-ruta").value.trim(),
      "Universidades ": document.getElementById("universidades-ruta").value.trim()
    };

    try {
      const url = rutaEditando
        ? `${API_URL}/api/admin/rutas/${rutaEditando}`
        : `${API_URL}/api/admin/rutas`;
      const metodo = rutaEditando ? "PUT" : "POST";

      const respuesta = await fetch(url, {
        method: metodo,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(nuevaRuta)
      }
      );

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(datos.mensaje || "No se pudo crear la ruta.");
      }

      alert(
        rutaEditando
          ? "¡Ruta actualizada correctamente!"
          : "¡Ruta creada correctamente!"
      );

      formularioRuta.reset();
      document.getElementById("formulario-ruta").hidden = true;

      // Reiniciar el modo de edición
      rutaEditando = null;

      document.querySelector("#formulario-ruta h2").textContent = "Crear ruta";
      document.getElementById("guardar-ruta").textContent = "Guardar ruta";

      await cargarRutas();
      await cargarEstadisticas();

    } catch (error) {
      console.error("Error al crear la ruta:", error);
      alert(error.message);
    }
  });
}