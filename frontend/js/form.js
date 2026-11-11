
import API_URL from '../config/api.js';

// Obtener el formulario y el botón
const formulario = document.getElementById('contact-form');
const submit = document.getElementById('submit');

// Escuchar el envío del formulario
formulario.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Obtener los datos
  const nombre = formulario.elements.nombre.value.trim();
  const email = formulario.elements.email.value.trim();
  const mensaje = formulario.elements.mensaje.value.trim();

  // Evitar envíos vacíos
  if (!nombre || !email || !mensaje) {
    alert('Por favor, completa todos los campos.');
    return;
  }

  // Evitar múltiples envíos
  submit.disabled = true;
  submit.textContent = 'Enviando...';

  try {
    // Enviar los datos al backend
    const respuesta = await fetch(`${API_URL}/api/contacto`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        nombre,
        email,
        mensaje
      })
    });

    const resultado = await respuesta.json();

    if (!respuesta.ok) {
      throw new Error(resultado.mensaje || 'No se pudo enviar el mensaje.');
    }

    // Mostrar confirmación
    alert('¡Mensaje enviado correctamente! Gracias por contactarnos.');

    // Limpiar el formulario
    formulario.reset();

  } catch (error) {
    console.error('Error al enviar el formulario:', error);
    alert(error.message || 'Ocurrió un error. Inténtalo nuevamente.');

  } finally {
    submit.disabled = false;
    submit.textContent = 'Enviar mensaje';
  }
});
