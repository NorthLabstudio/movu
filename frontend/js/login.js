import API_URL from '../config/api.js';

document.addEventListener("DOMContentLoaded", () => {

  // =========================
  // ELEMENTS
  // =========================

  const container = document.getElementById("container");

  const loginButton = document.getElementById("login");
  const signupButton = document.getElementById("signup");

  const loginForm = document.getElementById("login-form");
  const signupForm = document.getElementById("signup-form");

  const forgotPassword = document.getElementById("forgot-password");


  // =========================
  // TOGGLE LOGIN / SIGN UP
  // =========================

  if (signupButton) {
    signupButton.addEventListener("click", () => {
      container.classList.add("active");
    });
  }

  if (loginButton) {
    loginButton.addEventListener("click", () => {
      container.classList.remove("active");
    });
  }


  // =========================
  // LOGIN
  // =========================


  if (loginForm) {
    loginForm.addEventListener("submit", async (event) => {

      event.preventDefault();

      const email = document.getElementById("login-email").value.trim();
      const password = document.getElementById("login-password").value.trim();

      // Basic validation

      if (email === "" || password === "") {
        alert("Por favor, completa todos los campos.");
        return;
      }

      if (!isValidEmail(email)) {
        alert("Por favor, ingresa un correo válido.");
        return;
      }

      // Conexión con el backend
      try {
        const respuesta = await fetch(`${API_URL}/api/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email: email,
            contraseña: password
          })
        });

        const datos = await respuesta.json();

        if (!respuesta.ok) {
          alert(datos.mensaje || "No se pudo iniciar sesión.");
          return;
        }

        // Guardar la sesión del usuario
        sessionStorage.setItem("movuToken", datos.token);
        sessionStorage.setItem("movuUsuario", JSON.stringify(datos.usuario));

        // Ir al dashboard
        if (datos.usuario.rol === "admin") {
          window.location.href = "admin/admin.html";
        } else {
          window.location.href = "dashboard.html";
        }

      } catch (error) {
        console.error("Error al iniciar sesión:", error);
        alert("No se pudo conectar con el servidor.");
      }

    });
  }




  // =========================
  // SIGN UP
  // =========================


  if (signupForm) {
    signupForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const nombre = document.getElementById("name").value.trim();
      const email = document.getElementById("signup-email").value.trim();
      const contraseña = document.getElementById("signup-password").value;

      if (!nombre || !email || !contraseña) {
        alert("Por favor, completa todos los campos.");
        return;
      }

      if (!isValidEmail(email)) {
        alert("Por favor, ingresa un correo válido.");
        return;
      }

      if (contraseña.length < 8) {
        alert("La contraseña debe tener al menos 8 caracteres.");
        return;
      }

      try {
        const respuesta = await fetch(`${API_URL}/api/auth/registro`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            nombre: nombre,
            email: email,
            contraseña: contraseña
          })
        });

        const datos = await respuesta.json();

        if (!respuesta.ok) {
          alert(datos.mensaje || "No se pudo crear la cuenta.");
          return;
        }

        // Guardar la sesión del usuario
        sessionStorage.setItem("movuToken", datos.token);
        sessionStorage.setItem("movuUsuario", JSON.stringify(datos.usuario));

        // Ir al dashboard
        window.location.href = "dashboard.html";

      } catch (error) {
        console.error("Error al registrar:", error);
        alert("No se pudo conectar con el servidor. Verifica que el backend esté funcionando.");
      }
    });
  }



  // =========================
  // EMAIL VALIDATION
  // =========================

  function isValidEmail(email) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  }

});