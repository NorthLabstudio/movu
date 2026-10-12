const mongoose = require('mongoose');

const usuarioEsquema = new mongoose.Schema({

  nombre: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    trim: true,
    minlength: [2, 'El nombre debe tener al menos 2 caracteres']
  },

  email: {
    type: String,
    required: [true, 'El correo es obligatorio'],
    lowercase: true,
    trim: true,
    unique: true
  },

  contrasena: {
    type: String,
    required: [true, 'La contraseña es obligatoria']
  },

  rol: {
    type: String,
    enum: {
      values: ['usuario', 'admin'],
      message: 'El rol {VALUE} no es válido'
    },
    default: 'usuario'
  },

  activo: {
    type: Boolean,
    default: true
  }

}, { timestamps: true });

module.exports = mongoose.model('Usuario', usuarioEsquema);