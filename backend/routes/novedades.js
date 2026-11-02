
const express = require('express');
const router = express.Router();

const Novedad = require('../models/novedad');

// Consultar novedades publicadas y vigentes
router.get('/', async (req, res) => {
  try {
    const ahora = new Date();

    const novedades = await Novedad.find({
      estado: 'Publicada',
      fechaInicio: { $lte: ahora },
      $or: [
        { fechaFin: null },
        { fechaFin: { $gte: ahora } }
      ]
    }).sort({ fechaInicio: -1 });

    res.json(novedades);

  } catch (error) {
    console.error('Error al consultar novedades:', error);

    res.status(500).json({
      mensaje: 'Error al consultar las novedades'
    });
  }
});

module.exports = router;
