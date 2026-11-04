const mongoose = require('mongoose');

const actividadEsquema = new mongoose.Schema({
  tipo: {
    type: String,
    enum: ['ruta', 'novedad'],
    required: true
  },
  accion: {
    type: String,
    enum: ['creada', 'actualizada', 'eliminada'],
    required: true
  },
  titulo: {
    type: String,
    required: true
  },
  descripcion: {
    type: String,
    default: ''
  },
  fecha: {
    type: Date,
    default: Date.now
  }
}, {
  collection: 'actividades'
});

module.exports = mongoose.model('Actividad', actividadEsquema);