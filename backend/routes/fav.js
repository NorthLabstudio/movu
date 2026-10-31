
const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

const Usuario = require('../models/usuario');
const Ruta = require('../models/rutas');
const verificarToken = require('../middleware/verificarToken');

// CONSULTAR fav
router.get('/', verificarToken, async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.usuario._id)
      .populate('fav');

    return res.json(usuario.fav);

  } catch (error) {
    console.error('Error al consultar fav:', error.message);

    return res.status(500).json({
      mensaje: 'Error al consultar los fav.'
    });
  }
});

// GUARDAR FAVORITO
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

    const usuario = await Usuario.findById(req.usuario._id);

    const yaExiste = usuario.fav.some(
      favorito => favorito.toString() === rutaId
    );

    if (yaExiste) {
      return res.status(409).json({
        mensaje: 'Esta ruta ya está en tus fav.'
      });
    }

    usuario.fav.push(ruta._id);
    await usuario.save();

    return res.status(201).json({
      mensaje: 'Ruta agregada a fav.',
      rutaId: ruta._id
    });

  } catch (error) {
    console.error('Error al guardar favorito:', error.message);

    return res.status(500).json({
      mensaje: 'Error al guardar el favorito.'
    });
  }
});

// ELIMINAR FAVORITO
router.delete('/:rutaId', verificarToken, async (req, res) => {
  try {
    const { rutaId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(rutaId)) {
      return res.status(400).json({
        mensaje: 'El identificador de la ruta no es válido.'
      });
    }

    const usuario = await Usuario.findById(req.usuario._id);

    const cantidadInicial = usuario.fav.length;

    usuario.fav = usuario.fav.filter(
      favorito => favorito.toString() !== rutaId
    );

    if (usuario.fav.length === cantidadInicial) {
      return res.status(404).json({
        mensaje: 'Esta ruta no estaba en tus fav.'
      });
    }

    await usuario.save();

    return res.json({
      mensaje: 'Ruta eliminada de fav.'
    });

  } catch (error) {
    console.error('Error al eliminar favorito:', error.message);

    return res.status(500).json({
      mensaje: 'Error al eliminar el favorito.'
    });
  }
});

module.exports = router;
