
document.addEventListener("DOMContentLoaded", () => {
  const token = sessionStorage.getItem("movuToken");
  const usuarioGuardado = sessionStorage.getItem("movuUsuario");

  // Si no hay una sesión iniciada, volver al inicio de sesión.
  if (!token || !usuarioGuardado) {
    window.location.href = "index.html";
    return;
  }

  try {
    const usuario = JSON.parse(usuarioGuardado);

    const nombre = document.getElementById("profile-username");
    const email = document.getElementById("profile-email");
    const universidad = document.getElementById("nombreUniversidad");
    const ciudad = document.getElementById("ubicacionUniversidad");

    if (universidad) {
      universidad.textContent = usuario.universidad || "Sin universidad";
    }

    if (ciudad) {
      ciudad.textContent = usuario.ciudad || "";
    }

    if (nombre) {
      nombre.textContent = usuario.nombre || "Sin nombre";
    }

    if (email) {
      email.textContent = usuario.email || "Sin correo";
    }
    // Cargar las rutas guardadas en fav
    cargarFav();
    cargarHistorial();
  } catch (error) {
    console.error("Error al cargar el perfil:", error);

    sessionStorage.removeItem("movuToken");
    sessionStorage.removeItem("movuUsuario");

    window.location.href = "index.html";
    return;
  }


  // Cerrar sesión.
  const botonCerrarSesion = document.querySelector(".close-btn");

  if (botonCerrarSesion) {
    botonCerrarSesion.addEventListener("click", () => {
      sessionStorage.removeItem("movuToken");
      sessionStorage.removeItem("movuUsuario");

      window.location.href = "index.html";
    });
  }
});


document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("modal-editar-perfil");
  const botonEditar = document.getElementById("btn-editar-perfil");
  const botonCerrar = document.getElementById("btn-cerrar-modal");
  const botonCancelar = document.getElementById("btn-cancelar-modal");
  const formulario = document.getElementById("form-editar-perfil");

  const campoNombre = document.getElementById("editar-nombre");
  const campoEmail = document.getElementById("editar-email");
  const campoUniversidad = document.getElementById("editar-universidad");
  const campoCiudad = document.getElementById("editar-ciudad");
  const mensaje = document.getElementById("mensaje-perfil");

  const usuarioGuardado = sessionStorage.getItem("movuUsuario");

  if (!modal || !botonEditar || !formulario || !usuarioGuardado) {
    return;
  }

  let usuario;

  try {
    usuario = JSON.parse(usuarioGuardado);
  } catch (error) {
    console.error("No se pudieron leer los datos del usuario.");
    return;
  }


  function abrirModal() {
    campoNombre.value = usuario.nombre || "";
    campoEmail.value = usuario.email || "";
    campoUniversidad.value = usuario.universidad || "";
    campoCiudad.value = usuario.ciudad || "";
    mensaje.textContent = "";

    modal.classList.add("abierto");
    modal.setAttribute("aria-hidden", "false");
    campoNombre.focus();
  }

  function cerrarModal() {
    // Quitar el foco del elemento que está dentro del modal.
    if (modal.contains(document.activeElement)) {
      document.activeElement.blur();
    }

    modal.classList.remove("abierto");
    modal.setAttribute("aria-hidden", "true");

    // Devolver el foco al botón que abrió el modal.
    botonEditar.focus();
  }

  botonEditar.addEventListener("click", abrirModal);
  botonCerrar.addEventListener("click", cerrarModal);
  botonCancelar.addEventListener("click", cerrarModal);

  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      cerrarModal();
    }
  });


  formulario.addEventListener("submit", async (event) => {
    event.preventDefault();

    const nombreNuevo = campoNombre.value.trim();
    const emailNuevo = campoEmail.value.trim();

    if (nombreNuevo.length < 2) {
      mensaje.textContent = "El nombre debe tener al menos 2 caracteres.";
      return;
    }

    if (!campoEmail.checkValidity()) {
      mensaje.textContent = "Escribe un correo electrónico válido.";
      return;
    }

    usuario.nombre = nombreNuevo;
    usuario.email = emailNuevo;
    usuario.universidad = campoUniversidad.value.trim();
    usuario.ciudad = campoCiudad.value.trim();


    // Obtener el token de la sesión actual.
    const tokenActual = sessionStorage.getItem("movuToken");

    if (!tokenActual) {
      mensaje.textContent = "Tu sesión expiró. Inicia sesión nuevamente.";
      return;
    }

    try {
      // Enviar los cambios al backend.
      const respuesta = await fetch("http://localhost:3000/api/auth/perfil", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${tokenActual}`
        },
        body: JSON.stringify({
          nombre: nombreNuevo,
          email: emailNuevo,
          universidad: campoUniversidad.value.trim(),
          ciudad: campoCiudad.value.trim()
        })
      });

      const datos = await respuesta.json().catch(() => ({}));

      // Si el backend rechaza los cambios, mostrarlos sin cerrar el modal.

      if (!respuesta.ok) {
        if (respuesta.status === 409) {
          mensaje.textContent = "⚠️ Este correo ya está registrado. Prueba con otro.";
        } else {
          mensaje.textContent =
            datos.mensaje || `No se pudieron guardar los cambios (${respuesta.status}).`;
        }

        return;
      }



      // Actualizar la sesión solamente después de confirmar el guardado.
      usuario = datos.usuario;
      sessionStorage.setItem("movuUsuario", JSON.stringify(usuario));

      // Actualizar los datos visibles del perfil.
      const elementoNombre = document.getElementById("profile-username");
      const elementoEmail = document.getElementById("profile-email");
      const elementoUniversidad = document.getElementById("nombreUniversidad");
      const elementoCiudad = document.getElementById("ubicacionUniversidad");

      if (elementoNombre) {
        elementoNombre.textContent = usuario.nombre || "Sin nombre";
      }

      if (elementoEmail) {
        elementoEmail.textContent = usuario.email || "Sin correo";
      }

      if (elementoUniversidad) {
        elementoUniversidad.textContent = usuario.universidad || "";
      }

      if (elementoCiudad) {
        elementoCiudad.textContent = usuario.ciudad || "";
      }

      mensaje.textContent = "Perfil actualizado correctamente.";
      cerrarModal();

    } catch (error) {
      console.error("Error al guardar el perfil:", error);
      mensaje.textContent =
        "No se pudo conectar con el servidor. Revisa la conexión e inténtalo nuevamente.";
    }

  });
});
/* =========================================================
   CARGAR RUTAS FAVORITAS DEL USUARIO
========================================================= */

async function cargarFav() {
  const contenedor = document.getElementById("fav-container");
  const token = sessionStorage.getItem("movuToken");

  if (!contenedor) return;

  try {
    const respuesta = await fetch("http://localhost:3000/api/fav", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    const datos = await respuesta.json();

    if (!respuesta.ok) {
      throw new Error(datos.mensaje || "No se pudieron cargar las rutas.");
    }

    if (!Array.isArray(datos)) {
      throw new Error("La API no devolvió una lista de rutas.");
    }

    if (datos.length === 0) {
      contenedor.innerHTML = `
        <p>Aún no tienes rutas guardadas en fav.</p>
        <a href="catalogo.html">Explorar rutas</a>
      `;
      return;
    }

    // Generar las tarjetas
    contenedor.innerHTML = datos
      .map(ruta => crearTarjetaRuta(ruta))
      .join("");

    // Activar las estrellas de las rutas guardadas
    contenedor.querySelectorAll(".favorite-btn").forEach(boton => {
      boton.classList.add("active");
      boton.setAttribute("aria-pressed", "true");
      boton.setAttribute("aria-label", "Quitar de fav");
    });

  } catch (error) {
    console.error("Error al cargar fav:", error);

    contenedor.innerHTML = `
      <p>No fue posible cargar tus rutas guardadas.</p>
    `;
  }
}

/* =========================================================
   CARGAR HISTORIAL DE CONSULTAS
========================================================= */

async function cargarHistorial() {
  const contenedor = document.getElementById("historial-container");
  const token = sessionStorage.getItem("movuToken");

  if (!contenedor) return;

  try {
    const respuesta = await fetch("http://localhost:3000/api/historial", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    const datos = await respuesta.json();

    if (!respuesta.ok) {
      throw new Error(datos.mensaje || "No se pudo cargar el historial.");
    }

    const historial = Array.isArray(datos)
      ? datos
      : datos.historial;

    if (!Array.isArray(historial)) {
      throw new Error("La API no devolvió una lista de consultas.");
    }

    if (historial.length === 0) {
      contenedor.innerHTML = `
        <p>Aún no has consultado ninguna ruta.</p>
        <a href="catalogo.html">Explorar rutas</a>
      `;
      return;
    }

    // Mostrar cada consulta individualmente
    contenedor.innerHTML = historial.map(consulta => {
      const fecha = consulta.fecha
        ? new Date(consulta.fecha).toLocaleString("es-CO", {
          dateStyle: "medium",
          timeStyle: "short"
        })
        : "Fecha no disponible";

      if (!consulta.ruta) {
        return `
          <div class="history-entry">
            <p>Esta ruta ya no está disponible.</p>
            <button
              type="button"
              class="delete-history-btn"
              data-history-id="${consulta._id}">
              Eliminar consulta
            </button>
          </div>
        `;
      }

      return `
        <div class="history-entry">
          <p class="history-date">
            Consultada: ${fecha}
          </p>

          ${crearTarjetaRuta(consulta.ruta)}

          <button
            type="button"
            class="delete-history-btn"
            data-history-id="${consulta._id}">
            Eliminar consulta
          </button>
        </div>
      `;
    }).join("");

  } catch (error) {
    console.error("Error al cargar el historial:", error);

    contenedor.innerHTML = `
      <p>No fue posible cargar tu historial.</p>
    `;
  }
}


/* =========================================================
   ELIMINAR UNA CONSULTA
========================================================= */

async function eliminarConsulta(id) {
  const token = sessionStorage.getItem("movuToken");

  if (!confirm("¿Quieres eliminar esta consulta del historial?")) {
    return;
  }

  try {
    const respuesta = await fetch(
      `http://localhost:3000/api/historial/${id}`,
      {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      }
    );

    const datos = await respuesta.json().catch(() => ({}));

    if (!respuesta.ok) {
      throw new Error(datos.mensaje || "No se pudo eliminar la consulta.");
    }

    await cargarHistorial();

  } catch (error) {
    console.error("Error al eliminar la consulta:", error);
    alert("No fue posible eliminar la consulta.");
  }
}


/* =========================================================
   LIMPIAR TODO EL HISTORIAL
========================================================= */

async function limpiarHistorial() {
  const token = sessionStorage.getItem("movuToken");

  if (!confirm("¿Estás seguro de que quieres eliminar todo tu historial?")) {
    return;
  }

  try {
    const respuesta = await fetch(
      "http://localhost:3000/api/historial",
      {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      }
    );

    const datos = await respuesta.json().catch(() => ({}));

    if (!respuesta.ok) {
      throw new Error(datos.mensaje || "No se pudo limpiar el historial.");
    }

    await cargarHistorial();

  } catch (error) {
    console.error("Error al limpiar el historial:", error);
    alert("No fue posible limpiar el historial.");
  }
}


/* =========================================================
   EVENTOS DE LOS BOTONES DEL HISTORIAL
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const contenedor = document.getElementById("historial-container");
  const botonLimpiar = document.getElementById("limpiar-historial");

  // Eliminar una consulta individual
  if (contenedor) {
    contenedor.addEventListener("click", event => {
      const boton = event.target.closest(".delete-history-btn");

      if (boton) {
        eliminarConsulta(boton.dataset.historyId);
      }
    });
  }

  // Eliminar todas las consultas
  if (botonLimpiar) {
    botonLimpiar.addEventListener("click", limpiarHistorial);
  }
});
