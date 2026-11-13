
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Cargar variables de entorno
require('dotenv').config({
  path: require('path').join(__dirname, 'config', '.env')
});

const app = express();

// Configuración de CORS
const origenesPermitidos = [
  'http://127.0.0.1:3001',
  'http://localhost:5173',
  'http://localhost:5175',

  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: origenesPermitidos
}));

app.use(express.json());

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Conectado a MongoDB'))
  .catch(error => console.error(
    'Error de conexión a MongoDB:',
    error.message
  ));

// Ruta principal
app.get('/', (req, res) => {
  res.send('Movu API está funcionando correctamente.');
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

app.use('/api/contacto', require('./routes/contacto'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/fav', require('./routes/fav'));
app.use('/api/historial', require('./routes/historial'));

app.get('/api/fav/prueba', (req, res) => {
  res.json({
    mensaje: 'La ruta de fav está funcionando'
  });
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
app.use('/api/chat', require('./routes/chat'));

app.get('/prueba-servidor', (req, res) => {
  res.send('Este es el servidor correcto');
});

// Puerto para producción y desarrollo
const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});
