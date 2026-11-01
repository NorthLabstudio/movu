
document.addEventListener("DOMContentLoaded", () => {
  const username = document.getElementById("username");
  const usuarioGuardado = sessionStorage.getItem("movuUsuario");
  const token = sessionStorage.getItem("movuToken");

  // Verificar que exista una sesión activa
  if (!token || !usuarioGuardado) {
    window.location.href = "index.html";
    return;
  }

  // Mostrar el nombre del usuario
  try {
    const usuario = JSON.parse(usuarioGuardado);

    if (username && usuario.nombre) {
      username.textContent = usuario.nombre;
    }

  } catch (error) {
    console.error("Error al leer los datos del usuario:", error);
    sessionStorage.removeItem("movuUsuario");
    sessionStorage.removeItem("movuToken");
    window.location.href = "index.html";
    return;
  }

  // Cargar la información del dashboard
  cargarFav();
  cargarHistorial();

  // Configurar el cierre de sesión
  const botonCerrarSesion = document.querySelector(".close-btn");

  if (botonCerrarSesion) {
    botonCerrarSesion.addEventListener("click", () => {
      sessionStorage.removeItem("movuToken");
      sessionStorage.removeItem("movuUsuario");
      window.location.href = "index.html";
    });
  }
});


// CARGAR RUTAS FAVORITAS
async function cargarFav() {
  const contenedor = document.getElementById("fav-container");
  const contador = document.getElementById("fav-count");
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

    // Actualizar el contador de favoritos
    if (contador) {
      contador.textContent = datos.length;
    }

    if (datos.length === 0) {
      contenedor.innerHTML = `
        <p>Aún no tienes rutas guardadas.
        Explora el directorio y agrega tus favoritas.</p>
      `;
      return;
    }

    // Crear las tarjetas con las rutas recibidas
    contenedor.innerHTML = datos
      .map(ruta => crearTarjetaRuta(ruta))
      .join("");

    // Marcar las estrellas como activas
    contenedor.querySelectorAll(".favorite-btn").forEach(boton => {
      boton.classList.add("active");
      boton.setAttribute("aria-pressed", "true");
      boton.setAttribute("aria-label", "Quitar de fav");
    });

  } catch (error) {
    console.error("Error al cargar fav:", error);

    if (contador) {
      contador.textContent = "--";
    }

    contenedor.innerHTML = `
      <p>No fue posible cargar tus rutas guardadas.</p>
    `;
  }
}


// CARGAR HISTORIAL DE CONSULTAS
async function cargarHistorial() {
  const contenedor = document.getElementById("historial-container");
  const contador = document.getElementById("history-count");
  const destinoFrecuente = document.getElementById("frequent-destination");
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

    // Aceptar una lista directa o una lista dentro de la propiedad historial
    const historial = Array.isArray(datos)
      ? datos
      : datos.historial;

    if (!Array.isArray(historial)) {
      throw new Error("La API no devolvió una lista de consultas.");
    }

    // Actualizar el contador de consultas
    if (contador) {
      contador.textContent = historial.length;
    }

    if (historial.length === 0) {
      contenedor.innerHTML = `
        <p>Aún no has consultado ninguna ruta.
        Explora el directorio para comenzar.</p>
      `;

      if (destinoFrecuente) {
        destinoFrecuente.textContent = "--";
      }

      return;
    }

    // Calcular el destino más consultado
    const destinos = {};

    historial.forEach(consulta => {
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

    if (destinoFrecuente) {
      destinoFrecuente.textContent =
        destinoMasFrecuente?.nombre || "--";
    }

    // Mostrar las consultas más recientes
    contenedor.innerHTML = historial
      .filter(consulta => consulta.ruta)
      .map(consulta => {
        const fecha = consulta.fecha
          ? new Date(consulta.fecha).toLocaleString("es-CO", {
            dateStyle: "short",
            timeStyle: "short"
          })
          : "Fecha no disponible";

        return `
  <div class="history-entry">
    <p class="history-date">Consultada: ${fecha}</p>
    ${crearTarjetaRuta(consulta.ruta)}
  </div>
`;
      })
      .join("");

    if (!contenedor.innerHTML.trim()) {
      contenedor.innerHTML = `
        <p>No hay rutas disponibles para mostrar en el historial.</p>
      `;
    }

  } catch (error) {
    console.error("Error al cargar el historial:", error);

    if (contador) {
      contador.textContent = "--";
    }

    if (destinoFrecuente) {
      destinoFrecuente.textContent = "--";
    }

    contenedor.innerHTML = `
      <p>No fue posible cargar tus consultas recientes.</p>
    `;
  }
}
