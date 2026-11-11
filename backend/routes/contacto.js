const express = require('express');
const router = express.Router();

const Contacto = require('../models/contacto');

// Recibir y guardar mensajes del formulario
router.post('/', async (req, res) => {
  try {
    const { nombre, email, mensaje } = req.body;

    // Validar que todos los campos estén completos
    if (!nombre || !email || !mensaje) {
      return res.status(400).json({
        mensaje: 'Todos los campos son obligatorios.'
      });
    }

    // Validar formato básico del correo
    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!emailValido) {
      return res.status(400).json({
        mensaje: 'Ingresa un correo electrónico válido.'
      });
    }

    // Crear el nuevo mensaje
    const nuevoContacto = new Contacto({
      nombre,
      email,
      mensaje
    });

    // Guardarlo en MongoDB
    await nuevoContacto.save();

    res.status(201).json({
      mensaje: 'Tu mensaje fue enviado correctamente.'
    });

  } catch (error) {
    console.error('Error al guardar el mensaje:', error);

    res.status(500).json({
      mensaje: 'No se pudo enviar el mensaje. Inténtalo nuevamente.'
    });
  }
});

module.exports = router;