
const express = require('express');
const mongoose = require('mongoose');
const Usuario = require('./models/usuario');

const app = express();

app.use(express.json());

require('dotenv').config({ path: './backend/config/.env' });

// Conexion a mongo
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Conectado a mongo'))
  .catch(error => console.log(
    'Error de conexion',
    error.message
  ));

app.get('/', (req, res) => {
  res.render('login');
});
// Rutas
const Ruta = require('./models/rutas');

app.get('/api/rutas', async (req, res) => {
  try {
    const rutas = await Ruta.find();
    res.json(rutas);
  } catch (error) {
    console.error('Error al consultar rutas:', error);
    res.status(500).json({
      mensaje: 'Error al consultar las rutas'
    });
  }
});

app.listen(3000, () => {
  console.log('Corriendo servidor');
});


