
const mongoose = require('mongoose');

const novedadEsquema = new mongoose.Schema({

  titulo: {
    type: String,
    required: true,
    trim: true
  },

  tipo: {
    type: String,
    enum: [
      'Via cerrada',
      'Desvio',
      'Parada suspendida',
      'Cambio de horario',
      'Restablecimiento',
      'Informacion general'
    ],
    required: true
  },

  descripcion: {
    type: String,
    required: true,
    trim: true
  },

  ubicacion: {
    type: String,
    trim: true,
    default: ''
  },

  empresa: {
    type: String,
    trim: true,
    default: ''
  },

  ruta: {
    type: String,
    trim: true,
    default: ''
  },

  fechaInicio: {
    type: Date,
    required: true
  },

  fechaFin: {
    type: Date,
    default: null
  },

  estado: {
    type: String,
    enum: ['Borrador', 'Publicada', 'Finalizada'],
    default: 'Borrador'
  },

  creadoPor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  }

}, { timestamps: true });

module.exports = mongoose.model('Novedad', novedadEsquema);
