
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
  }
});



// button cerrar sesion
document.addEventListener("DOMContentLoaded", () => {
  const botonCerrarSesion = document.querySelector(".close-btn");

  if (botonCerrarSesion) {
    botonCerrarSesion.addEventListener("click", () => {
      // Eliminar los datos de la sesión
      sessionStorage.removeItem("movuToken");
      sessionStorage.removeItem("movuUsuario");

      // Volver al inicio de sesión
      window.location.href = "index.html";
    });
  }
});

