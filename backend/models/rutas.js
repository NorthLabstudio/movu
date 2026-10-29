
const mongoose = require('mongoose');

const rutaSchema = new mongoose.Schema({
  routeId: {
    type: String,
    required: true
  },
  'company-name': {
    type: String,
    required: true
  },
  busCode: {
    type: String,
    required: true
  },
  origen: {
    type: String,
    required: true
  },
  destino: {
    type: String,
    required: true
  },
  stop: {
    type: String,
    default: ''
  },
  precio: {
    type: String,
    default: 'Por verificar'
  },
  tiempo: {
    type: String,
    default: 'Por verificar'
  },
  horario: {
    type: String,
    default: 'Por verificar'
  },
  Tipo: {
    type: String,
    default: ''
  },
  busstatus: {
    type: String,
    default: 'Activa'
  },
  Fuente: {
    type: String,
    default: ''
  },
  'Universidades ': {
    type: String,
    default: ''
  }
}, {
  collection: 'rutas'
});

module.exports = mongoose.model('Ruta', rutaSchema);
