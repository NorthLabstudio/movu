
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

async function verificarAdmin(req, res, next) {
  try {
    // Comprobar que la petición incluya un token.
    const autorizacion = req.headers.authorization;

    if (!autorizacion || !autorizacion.startsWith('Bearer ')) {
      return res.status(401).json({
        mensaje: 'Debes iniciar sesión para continuar.'
      });
    }

    if (!process.env.JWT_SECRET) {
      console.error('Falta configurar JWT_SECRET.');
      return res.status(500).json({
        mensaje: 'Error de configuración del servidor.'
      });
    }

    // Validar el token.
    const token = autorizacion.split(' ')[1];
    const datosToken = jwt.verify(token, process.env.JWT_SECRET);

    // Consultar el usuario real en MongoDB.
    const usuario = await Usuario.findById(datosToken.id);

    if (!usuario || !usuario.activo) {
      return res.status(401).json({
        mensaje: 'La cuenta no está disponible.'
      });
    }

    // Verificar el rol actual guardado en la base de datos.
    if (usuario.rol !== 'admin') {
      return res.status(403).json({
        mensaje: 'No tienes permisos de administrador.'
      });
    }

    // Dejar disponible el usuario para la siguiente función.
    req.usuario = usuario;

    next();

  } catch (error) {
    if (
      error.name === 'JsonWebTokenError' ||
      error.name === 'TokenExpiredError'
    ) {
      return res.status(401).json({
        mensaje: 'Tu sesión expiró o el token no es válido.'
      });
    }

    console.error('Error al verificar administrador:', error.message);

    return res.status(500).json({
      mensaje: 'Error al verificar los permisos.'
    });
  }
}

module.exports = verificarAdmin;
