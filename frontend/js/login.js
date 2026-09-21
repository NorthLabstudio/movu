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
    loginForm.addEventListener("submit", (event) => {

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


      // Temporary login

      console.log("Login:", {
        email: email,
        password: password
      });

      alert("Inicio de sesión correcto.");

      /*
        SUPABASE WILL GO HERE LATER.

        Example:

        const { data, error } = await supabase.auth.signInWithPassword({
          email: email,
          password: password
        });
      */
    });
  }


  // =========================
  // SIGN UP
  // =========================

  if (signupForm) {
    signupForm.addEventListener("submit", (event) => {

      event.preventDefault();

      const email = document.getElementById("signup-email").value.trim();
      const password = document.getElementById("signup-password").value.trim();


      // Basic validation

      if (email === "" || password === "") {
        alert("Por favor, completa todos los campos.");
        return;
      }

      if (!isValidEmail(email)) {
        alert("Por favor, ingresa un correo válido.");
        return;
      }

      if (password.length < 6) {
        alert("La contraseña debe tener al menos 6 caracteres.");
        return;
      }


      // Temporary account creation

      console.log("Sign up:", {
        email: email,
        password: password
      });

      alert("Cuenta creada correctamente.");

      // Return to login

      container.classList.remove("active");

      signupForm.reset();
    });
  }


  // =========================
  // FORGOT PASSWORD
  // =========================

  if (forgotPassword) {
    forgotPassword.addEventListener("click", (event) => {

      event.preventDefault();

      const email = document.getElementById("login-email").value.trim();

      if (email === "") {
        alert("Ingresa tu correo primero.");
        return;
      }

      if (!isValidEmail(email)) {
        alert("Por favor, ingresa un correo válido.");
        return;
      }

      alert(`Te enviaremos un enlace para recuperar tu contraseña a ${email}.`);

      /*
        SUPABASE PASSWORD RESET WILL GO HERE LATER.

        Example:

        await supabase.auth.resetPasswordForEmail(email);
      */
    });
  }


  // =========================
  // EMAIL VALIDATION
  // =========================

  function isValidEmail(email) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  }

});