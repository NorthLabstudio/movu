
const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

const Historial = require('../models/historial');
const Ruta = require('../models/rutas');
const verificarToken = require('../middleware/verificarToken');

// REGISTRAR UNA CONSULTA
router.post('/:rutaId', verificarToken, async (req, res) => {
  try {
    const { rutaId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(rutaId)) {
      return res.status(400).json({
        mensaje: 'El identificador de la ruta no es válido.'
      });
    }

    const ruta = await Ruta.findById(rutaId);

    if (!ruta) {
      return res.status(404).json({
        mensaje: 'No se encontró la ruta.'
      });
    }

    const consulta = await Historial.create({
      usuario: req.usuario._id,
      ruta: ruta._id
    });

    return res.status(201).json({
      mensaje: 'Consulta registrada correctamente.',
      consulta
    });

  } catch (error) {
    console.error('Error al registrar consulta:', error.message);

    return res.status(500).json({
      mensaje: 'Error al registrar la consulta.'
    });
  }
});


// CONSULTAR HISTORIAL DEL USUARIO
router.get('/', verificarToken, async (req, res) => {
  try {
    const historial = await Historial.find({
      usuario: req.usuario._id
    })
      .populate('ruta')
      .sort({ fecha: -1 });

    return res.json(historial);

  } catch (error) {
    console.error('Error al consultar historial:', error.message);

    return res.status(500).json({
      mensaje: 'Error al consultar el historial.'
    });
  }
});


// ELIMINAR UNA CONSULTA DEL HISTORIAL
router.delete('/:id', verificarToken, async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        mensaje: 'El identificador no es válido.'
      });
    }

    const consulta = await Historial.findOneAndDelete({
      _id: id,
      usuario: req.usuario._id
    });

    if (!consulta) {
      return res.status(404).json({
        mensaje: 'No se encontró esta consulta en tu historial.'
      });
    }

    return res.json({
      mensaje: 'Consulta eliminada correctamente.'
    });

  } catch (error) {
    console.error('Error al eliminar consulta:', error.message);

    return res.status(500).json({
      mensaje: 'Error al eliminar la consulta.'
    });
  }
});


// ELIMINAR TODO EL HISTORIAL DEL USUARIO
router.delete('/', verificarToken, async (req, res) => {
  try {
    await Historial.deleteMany({
      usuario: req.usuario._id
    });

    return res.json({
      mensaje: 'Historial eliminado correctamente.'
    });

  } catch (error) {
    console.error('Error al limpiar historial:', error.message);

    return res.status(500).json({
      mensaje: 'Error al limpiar el historial.'
    });
  }
});

module.exports = router;
