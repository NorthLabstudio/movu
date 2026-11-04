
const express = require('express');
const router = express.Router();

// Modelos
const Usuario = require('../models/usuario');
const Ruta = require('../models/rutas');
const Historial = require('../models/historial');
const Novedad = require('../models/novedad');
const Actividad = require('../models/actividad');
const mongoose = require('mongoose');

// Middleware de administrador
const verificarAdmin = require('../middleware/verificarAdmin');

// Obtener estadísticas del dashboard
router.get('/estadisticas', verificarAdmin, async (req, res) => {
  try {
    // Contar usuarios registrados, excluyendo administradores
    const usuarios = await Usuario.countDocuments({ rol: 'usuario' });
    const rutas = await Ruta.countDocuments();
    const consultas = await Historial.countDocuments();

    // Contar novedades publicadas y vigentes
    const ahora = new Date();

    const novedadesActivas = await Novedad.countDocuments({
      estado: 'Publicada',
      fechaInicio: { $lte: ahora },
      $or: [
        { fechaFin: null },
        { fechaFin: { $gte: ahora } }
      ]
    });

    res.json({
      usuarios,
      rutas,
      consultas,
      novedadesActivas
    });

  } catch (error) {
    console.error('Error al obtener estadísticas:', error);

    res.status(500).json({
      mensaje: 'Error al consultar las estadísticas'
    });
  }
});
// Consultar usuarios registrados
router.get('/usuarios', verificarAdmin, async (req, res) => {
  try {
    const usuarios = await Usuario.find()
      .select('nombre email universidad ciudad rol activo createdAt')
      .sort({ createdAt: -1 });

    res.json({
      total: usuarios.length,
      usuarios
    });

  } catch (error) {
    console.error('Error al consultar usuarios:', error);

    res.status(500).json({
      mensaje: 'Error al consultar los usuarios'
    });
  }
});
// Obtener las últimas actividades
// Consultar actividades del panel administrativo
router.get('/actividad', verificarAdmin, async (req, res) => {
  try {
    const consulta = Actividad.find().sort({ fecha: -1 });

    // En el dashboard se muestran solo las cinco más recientes
    if (req.query.todas !== 'true') {
      consulta.limit(5);
    }

    const actividades = await consulta;

    res.json(actividades);

  } catch (error) {
    console.error('Error al consultar actividades:', error);

    res.status(500).json({
      mensaje: 'Error al consultar las actividades'
    });
  }
});

// Consultar todas las novedades desde el panel administrativo
router.get('/novedades', verificarAdmin, async (req, res) => {
  try {
    const novedades = await Novedad.find()
      .sort({ createdAt: -1 });

    res.json(novedades);

  } catch (error) {
    console.error('Error al consultar novedades:', error);
    res.status(500).json({
      mensaje: 'Error al consultar las novedades'
    });
  }
});

// Crear una novedad
router.post('/novedades', verificarAdmin, async (req, res) => {
  try {
    const novedad = new Novedad({
      ...req.body,
      creadoPor: req.usuario._id
    });

    await novedad.save();
    await registrarActividad(
      'novedad',
      'creada',
      novedad.titulo,
      'Se creó una nueva novedad.'
    );

    res.status(201).json({
      mensaje: 'Novedad creada correctamente',
      novedad
    });

  } catch (error) {
    console.error('Error al crear novedad:', error);

    res.status(400).json({
      mensaje: 'No se pudo crear la novedad',
      error: error.message
    });
  }
});

// Editar una novedad
router.put('/novedades/:id', verificarAdmin, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        mensaje: 'Identificador de novedad no válido'
      });
    }

    const { creadoPor, ...cambios } = req.body;

    const novedad = await Novedad.findByIdAndUpdate(
      req.params.id,
      cambios,
      { new: true, runValidators: true }
    );

    if (!novedad) {
      return res.status(404).json({
        mensaje: 'Novedad no encontrada'
      });
    }
    await registrarActividad(
      'novedad',
      'actualizada',
      novedad.titulo,
      'Se actualizaron los datos de una novedad.'
    );

    res.json({
      mensaje: 'Novedad actualizada correctamente',
      novedad
    });

  } catch (error) {
    console.error('Error al editar novedad:', error);

    res.status(400).json({
      mensaje: 'No se pudo actualizar la novedad',
      error: error.message
    });
  }
});

// Eliminar una novedad
router.delete('/novedades/:id', verificarAdmin, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        mensaje: 'Identificador de novedad no válido'
      });
    }

    const novedad = await Novedad.findByIdAndDelete(req.params.id);

    if (!novedad) {
      return res.status(404).json({
        mensaje: 'Novedad no encontrada'
      });
    }
    await registrarActividad(
      'novedad',
      'eliminada',
      novedad.titulo,
      'Se eliminó una novedad.'
    );

    res.json({
      mensaje: 'Novedad eliminada correctamente'
    });

  } catch (error) {
    console.error('Error al eliminar novedad:', error);

    res.status(500).json({
      mensaje: 'Error al eliminar la novedad'
    });
  }
});
// Registrar una actividad del panel administrativo
async function registrarActividad(tipo, accion, titulo, descripcion = '') {
  try {
    await Actividad.create({
      tipo,
      accion,
      titulo,
      descripcion
    });
  } catch (error) {
    console.error('Error al registrar actividad:', error);
  }
}
// ==========================================
// GESTIÓN DE RUTAS
// ==========================================

// Consultar todas las rutas
router.get('/rutas', verificarAdmin, async (req, res) => {
  try {
    const rutas = await Ruta.find().sort({
      'company-name': 1,
      busCode: 1
    });

    res.json(rutas);

  } catch (error) {
    console.error('Error al consultar rutas:', error);

    res.status(500).json({
      mensaje: 'Error al consultar las rutas'
    });
  }
});


// Crear una ruta
router.post('/rutas', verificarAdmin, async (req, res) => {
  try {
    const {
      routeId,
      'company-name': empresa,
      busCode,
      origen,
      destino,
      stop,
      precio,
      tiempo,
      horario,
      Tipo,
      busstatus,
      Fuente,
      'Universidades ': universidades
    } = req.body;

    // Verificar que el identificador no esté registrado
    const rutaExistente = await Ruta.findOne({
      routeId: { $regex: `^${routeId.trim()}$`, $options: 'i' }
    });

    if (rutaExistente) {
      return res.status(409).json({
        mensaje: 'Ya existe una ruta con ese identificador.'
      });
    }

    const ruta = new Ruta({
      routeId,
      'company-name': empresa,
      busCode,
      origen,
      destino,
      stop,
      precio,
      tiempo,
      horario,
      Tipo,
      busstatus,
      Fuente,
      'Universidades ': universidades
    });

    await ruta.save();
    await registrarActividad(
      'ruta',
      'creada',
      `Ruta ${ruta.busCode}`,
      `${ruta['company-name']}: ${ruta.origen} → ${ruta.destino}`
    );

    res.status(201).json({
      mensaje: 'Ruta creada correctamente',
      ruta
    });

  } catch (error) {
    console.error('Error al crear ruta:', error);

    res.status(400).json({
      mensaje: 'No se pudo crear la ruta',
      error: error.message
    });
  }
});


// Editar una ruta
router.put('/rutas/:id', verificarAdmin, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        mensaje: 'Identificador de ruta no válido'
      });
    }

    const {
      routeId,
      'company-name': empresa,
      busCode,
      origen,
      destino,
      stop,
      precio,
      tiempo,
      horario,
      Tipo,
      busstatus,
      Fuente,
      'Universidades ': universidades
    } = req.body;

    const cambios = {
      routeId,
      'company-name': empresa,
      busCode,
      origen,
      destino,
      stop,
      precio,
      tiempo,
      horario,
      Tipo,
      busstatus,
      Fuente,
      'Universidades ': universidades
    };

    const ruta = await Ruta.findByIdAndUpdate(
      req.params.id,
      cambios,
      { new: true, runValidators: true }
    );

    if (!ruta) {
      return res.status(404).json({
        mensaje: 'Ruta no encontrada'
      });
    }
    await registrarActividad(
      'ruta',
      'actualizada',
      `Ruta ${ruta.busCode}`,
      `${ruta['company-name']}: ${ruta.origen} → ${ruta.destino}`
    );

    res.json({
      mensaje: 'Ruta actualizada correctamente',
      ruta
    });

  } catch (error) {
    console.error('Error al editar ruta:', error);

    res.status(400).json({
      mensaje: 'No se pudo actualizar la ruta',
      error: error.message
    });
  }
});

// Eliminar una ruta
router.delete('/rutas/:id', verificarAdmin, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        mensaje: 'Identificador de ruta no válido'
      });
    }

    // Buscar la ruta antes de eliminarla
    const ruta = await Ruta.findById(req.params.id);

    if (!ruta) {
      return res.status(404).json({
        mensaje: 'Ruta no encontrada'
      });
    }

    // Quitar la ruta de los favoritos de los usuarios
    await Usuario.updateMany(
      { fav: ruta._id },
      { $pull: { fav: ruta._id } }
    );

    // Eliminar las consultas del historial relacionadas con la ruta
    await Historial.deleteMany({
      ruta: ruta._id
    });

    // Eliminar la ruta
    await Ruta.findByIdAndDelete(ruta._id);
    await registrarActividad(
      'ruta',
      'eliminada',
      `Ruta ${ruta.busCode}`,
      `${ruta['company-name']}: ${ruta.origen} → ${ruta.destino}`
    );

    res.json({
      mensaje: 'Ruta eliminada correctamente'
    });

  } catch (error) {
    console.error('Error al eliminar ruta:', error);

    res.status(500).json({
      mensaje: 'Error al eliminar la ruta'
    });
  }
});

module.exports = router;