
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

async function verificarToken(req, res, next) {
  try {
    const autorizacion = req.headers.authorization;

    if (!autorizacion || !autorizacion.startsWith('Bearer ')) {
      return res.status(401).json({
        mensaje: 'Debes iniciar sesión para continuar.'
      });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        mensaje: 'Error de configuración del servidor.'
      });
    }

    const token = autorizacion.split(' ')[1];
    const datosToken = jwt.verify(token, process.env.JWT_SECRET);

    const usuario = await Usuario.findById(datosToken.id);

    if (!usuario || !usuario.activo) {
      return res.status(401).json({
        mensaje: 'La cuenta no está disponible.'
      });
    }

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

    console.error('Error al verificar sesión:', error.message);

    return res.status(500).json({
      mensaje: 'Error al verificar la sesión.'
    });
  }
}

module.exports = verificarToken;
