
document.addEventListener("DOMContentLoaded", () => {
  const username = document.getElementById("username");
  const usuarioGuardado = sessionStorage.getItem("movuUsuario");
  const token = sessionStorage.getItem("movuToken");

  // Si no hay sesión, regresar al login
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

  // Cargar las rutas guardadas en fav
  cargarFav();
});


// CARGAR RUTAS FAVORITAS
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

    contenedor.innerHTML = `
      <p>No fue posible cargar tus rutas guardadas.</p>
    `;
  }
}


// CERRAR SESIÓN
document.addEventListener("DOMContentLoaded", () => {
  const botonCerrarSesion = document.querySelector(".close-btn");

  if (botonCerrarSesion) {
    botonCerrarSesion.addEventListener("click", () => {
      sessionStorage.removeItem("movuToken");
      sessionStorage.removeItem("movuUsuario");

      window.location.href = "index.html";
    });
  }
});
