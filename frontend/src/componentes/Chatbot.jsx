
import { useState } from 'react';
import './Chatbot.css';

function Chatbot() {

  const [abierto, setAbierto] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(false);

  const [mensajes, setMensajes] = useState([
    {
      tipo: 'bot',
      texto: '¡Hola! Soy Movu AI. Estoy aquí para ayudarte a encontrar rutas y resolver tus dudas sobre el transporte público de Barranquilla. ¿En qué puedo ayudarte?'
    }
  ]);

  // Enviar mensaje al backend
  async function enviarMensaje(e) {
    e.preventDefault();

    const texto = mensaje.trim();

    if (!texto || cargando) return;

    // Mostrar el mensaje del usuario
    setMensajes(prev => [
      ...prev,
      {
        tipo: 'usuario',
        texto
      }
    ]);

    setMensaje('');
    setCargando(true);

    try {
      // Consultar el endpoint del chatbot
      const respuesta = await fetch('http://localhost:3000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          mensaje: texto
        })
      });

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(
          datos.mensaje || 'No fue posible obtener una respuesta.'
        );
      }

      // Mostrar la respuesta de Movu AI
      setMensajes(prev => [
        ...prev,
        {
          tipo: 'bot',
          texto: datos.respuesta
        }
      ]);

    } catch (error) {
      console.error('Error al consultar Movu AI:', error);

      setMensajes(prev => [
        ...prev,
        {
          tipo: 'bot',
          texto: error.message || 'No pude procesar tu pregunta. Inténtalo nuevamente.'
        }
      ]);

    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="chatbot-container">

      {/* Botón para abrir el chatbot */}
      <button
        className="chatbot-toggle"
        onClick={() => setAbierto(!abierto)}
      >
        {abierto ? '×' : '💬'}
      </button>

      {/* Ventana de conversación */}
      {abierto && (
        <div className="chatbot-ventana">

          <div className="chatbot-header">
            <div>
              <h3>Movu AI</h3>
              <span>Tu asistente de movilidad</span>
            </div>
          </div>

          <div className="chatbot-mensajes">

            {mensajes.map((item, index) => (
              <div
                key={index}
                className={`chatbot-mensaje ${item.tipo}`}
              >
                {item.texto}
              </div>
            ))}

            {cargando && (
              <div className="chatbot-mensaje bot">
                Movu AI está pensando...
              </div>
            )}

          </div>

          <form
            className="chatbot-form"
            onSubmit={enviarMensaje}
          >
            <input
              type="text"
              placeholder="Escribe tu pregunta..."
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              disabled={cargando}
            />

            <button
              type="submit"
              disabled={cargando || !mensaje.trim()}
            >
              ➤
            </button>
          </form>

        </div>
      )}

    </div>
  );
}

export default Chatbot;
