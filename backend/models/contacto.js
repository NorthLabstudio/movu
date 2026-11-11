const mongoose = require('mongoose');

const contactoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },

  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },

  mensaje: {
    type: String,
    required: true,
    trim: true
  },

  fecha: {
    type: Date,
    default: Date.now
  },

  estado: {
    type: String,
    enum: ['Pendiente', 'Revisado', 'Respondido'],
    default: 'Pendiente'
  }
});

module.exports = mongoose.model('Contacto', contactoSchema);