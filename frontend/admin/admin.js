
document.addEventListener("DOMContentLoaded", async () => {
  const token = sessionStorage.getItem("movuToken");

  // Si no hay sesión, volver al inicio de sesión
  if (!token) {
    window.location.href = "../index.html";
    return;
  }

  try {
    // Verificar en el backend que el usuario sea administrador
    const respuesta = await fetch(
      "http://localhost:3000/api/admin/prueba",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    if (!respuesta.ok) {
      sessionStorage.removeItem("movuToken");
      sessionStorage.removeItem("movuUsuario");
      window.location.href = "../index.html";
      return;
    }

    const datos = await respuesta.json();

    // Mostrar el nombre real del administrador
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
      avatarElemento.textContent = nombre.charAt(0).toUpperCase();
    }

  } catch (error) {
    console.error("Error al verificar el acceso:", error);
    alert("No se pudo verificar tu sesión. Comprueba que el servidor esté funcionando.");
    window.location.href = "../index.html";
  }
});
