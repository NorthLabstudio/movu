
const mongoose = require('mongoose');

const rutaEsquema = new mongoose.Schema(
  {},
  {
    strict: false,
    collection: 'rutas'
  }
);

module.exports = mongoose.model(
  'Ruta',
  rutaEsquema,
  'rutas'
);
