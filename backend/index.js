
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(cors({
  origin: 'http://127.0.0.1:3001'
}));

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
app.use('/api/auth', require('./routes/auth'));

app.use('/api/fav', require('./routes/fav'));
app.use('/api/historial', require('./routes/historial'));

app.get('/api/fav/prueba', (req, res) => {
  res.json({ mensaje: 'La ruta de fav está funcionando' });
});

const verificarAdmin = require('./middleware/verificarAdmin');

app.get('/api/admin/prueba', verificarAdmin, (req, res) => {
  res.json({
    mensaje: 'Acceso de administrador autorizado',
    usuario: req.usuario.nombre
  });

});
app.use('/api/admin', require('./routes/admin'));
app.use('/api/novedades', require('./routes/novedades'));

app.get('/prueba-servidor', (req, res) => {
  res.send('Este es el servidor correcto');
});

app.listen(3000, () => {
  console.log('Corriendo servidor');
});


