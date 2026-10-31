
const mongoose = require('mongoose');

const historialEsquema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },

  ruta: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ruta',
    required: true
  },

  fecha: {
    type: Date,
    default: Date.now
  }

}, { collection: 'historial' });

module.exports = mongoose.model('Historial', historialEsquema);
