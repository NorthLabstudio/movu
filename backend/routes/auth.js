
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');
const router = express.Router();

// REGISTRO
router.post('/registro', async (req, res) => {
  try {
    console.log('Llegó una petición de registro');
    const { nombre, email, contraseña } = req.body;

    if (!nombre || !email || !contraseña) {
      return res.status(400).json({
        mensaje: 'Todos los campos son obligatorios'
      });
    }


    if (contraseña.length < 8) {
      return res.status(400).json({
        mensaje: 'La contraseña debe tener al menos 8 caracteres'
      });
    }

    const correo = email.trim().toLowerCase();

    const usuarioExistente = await Usuario.findOne({
      email: correo
    });

    if (usuarioExistente) {
      return res.status(409).json({
        mensaje: 'Este correo ya está registrado'
      });
    }

    const hash = await bcrypt.hash(contraseña, 10);

    const nuevoUsuario = await Usuario.create({
      nombre,
      email: correo,
      contraseña: hash
    });

    return res.status(201).json({
      mensaje: 'Usuario registrado correctamente',
      usuario: {
        id: nuevoUsuario._id,
        nombre: nuevoUsuario.nombre,
        email: nuevoUsuario.email
      }
    });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        mensaje: 'Este correo ya está registrado'
      });
    }

    console.error('Error en registro:', error.message);

    return res.status(500).json({
      mensaje: 'Error al registrar el usuario'
    });
  }
});

// INICIO DE SESIÓN
router.post('/login', async (req, res) => {
  try {
    const { email, contraseña } = req.body;

    if (!email || !contraseña) {
      return res.status(400).json({
        mensaje: 'El correo y la contraseña son obligatorios'
      });
    }

    const usuario = await Usuario.findOne({
      email: email.trim().toLowerCase()
    });

    if (!usuario || !usuario.activo) {
      return res.status(401).json({
        mensaje: 'Correo o contraseña incorrectos'
      });
    }

    const coincide = await bcrypt.compare(
      contraseña,
      usuario.contraseña
    );

    if (!coincide) {
      return res.status(401).json({
        mensaje: 'Correo o contraseña incorrectos'
      });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error('Falta configurar JWT_SECRET en .env');
    }

    const token = jwt.sign(
      {
        id: usuario._id.toString(),
        rol: usuario.rol
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    return res.json({
      mensaje: 'Inicio de sesión exitoso',
      token,
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        universidad: usuario.universidad || '',
        ciudad: usuario.ciudad || '',
        rol: usuario.rol
      }
    });

  } catch (error) {
    console.error('Error en login:', error.message);

    return res.status(500).json({
      mensaje: 'Error al iniciar sesión'
    });
  }
});

//profile

/* ACTUALIZAR PERFIL */
router.put('/perfil', async (req, res) => {
  try {
    // Verificar que el usuario haya iniciado sesión
    const autorizacion = req.headers.authorization;

    if (!autorizacion || !autorizacion.startsWith('Bearer ')) {
      return res.status(401).json({
        mensaje: 'Debes iniciar sesión para editar tu perfil'
      });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        mensaje: 'Falta configurar JWT_SECRET'
      });
    }

    const token = autorizacion.split(' ')[1];
    const datosToken = jwt.verify(token, process.env.JWT_SECRET);

    const { nombre, email, universidad, ciudad } = req.body;

    // Validar los datos obligatorios
    if (!nombre || nombre.trim().length < 2) {
      return res.status(400).json({
        mensaje: 'El nombre debe tener al menos 2 caracteres'
      });
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return res.status(400).json({
        mensaje: 'Escribe un correo electrónico válido'
      });
    }

    const correo = email.trim().toLowerCase();

    // Comprobar que otro usuario no tenga ese correo
    const correoExistente = await Usuario.findOne({
      email: correo,
      _id: { $ne: datosToken.id }
    });

    if (correoExistente) {
      return res.status(409).json({
        mensaje: 'Ese correo ya está registrado por otro usuario'
      });
    }

    const usuario = await Usuario.findById(datosToken.id);

    if (!usuario || !usuario.activo) {
      return res.status(404).json({
        mensaje: 'No se encontró el usuario'
      });
    }

    // Actualizar únicamente los campos permitidos
    usuario.nombre = nombre.trim();
    usuario.email = correo;
    usuario.universidad = (universidad || '').trim();
    usuario.ciudad = (ciudad || '').trim();

    await usuario.save();

    return res.json({
      mensaje: 'Perfil actualizado correctamente',
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        universidad: usuario.universidad,
        ciudad: usuario.ciudad,
        rol: usuario.rol
      }
    });

  } catch (error) {
    if (error.name === 'JsonWebTokenError' ||
      error.name === 'TokenExpiredError') {
      return res.status(401).json({
        mensaje: 'Tu sesión expiró o el token no es válido. Inicia sesión nuevamente.'
      });
    }

    console.error('Error al actualizar perfil:', error.message);

    return res.status(500).json({
      mensaje: 'Error al actualizar el perfil'
    });
  }
});


module.exports = router;