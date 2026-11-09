
const Ruta = require('../models/rutas');

// Normalizar texto para comparar lugares
function normalizar(texto) {
  return String(texto || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

// Comprobar coincidencias entre lugares
function coincide(lugar, buscado) {
  return normalizar(lugar).includes(normalizar(buscado));
}

// Separar zonas registradas en el origen o destino
function separarZonas(texto) {
  return String(texto || '')
    .split('/')
    .map(zona => zona.trim())
    .filter(Boolean);
}

// Buscar rutas según origen y destino
async function buscarRutas(origen, destino) {

  if (!origen || !destino) {
    return [];
  }

  const origenBuscado = normalizar(origen);
  const destinoBuscado = normalizar(destino);

  // Consultar rutas activas
  const rutas = await Ruta.find({
    busstatus: 'Activa'
  }).lean();

  const resultados = rutas.filter(ruta => {

    // Obtener las paradas del recorrido
    const paradas = String(ruta.stop || '')
      .split('→')
      .map(parada => parada.trim())
      .filter(Boolean);

    const paradasNormalizadas = paradas.map(normalizar);

    // Separar las zonas de origen y destino registradas
    const zonasOrigen = separarZonas(ruta.origen);
    const zonasDestino = separarZonas(ruta.destino);

    // Buscar el origen dentro de las paradas
    const indiceOrigen = paradasNormalizadas.findIndex(parada =>
      parada.includes(origenBuscado)
    );

    // Comprobar si el origen coincide con alguna zona registrada
    const origenEnZonas = zonasOrigen.some(zona =>
      coincide(zona, origenBuscado) ||
      coincide(origenBuscado, zona)
    );

    // Buscar el destino dentro de las paradas
    const indiceDestino = paradasNormalizadas.findIndex(parada =>
      parada.includes(destinoBuscado)
    );

    // Comprobar si el destino coincide con alguna zona registrada
    const destinoEnZonas = zonasDestino.some(zona =>
      coincide(zona, destinoBuscado) ||
      coincide(destinoBuscado, zona)
    );

    // El origen debe estar respaldado por el registro
    const origenEncontrado =
      indiceOrigen !== -1 || origenEnZonas;

    // El destino debe estar respaldado por el registro
    const destinoEncontrado =
      indiceDestino !== -1 || destinoEnZonas;

    if (!origenEncontrado || !destinoEncontrado) {
      return false;
    }

    // Si ambos lugares aparecen en las paradas,
    // respetar el orden del recorrido
    if (indiceOrigen !== -1 && indiceDestino !== -1) {
      return indiceOrigen < indiceDestino;
    }

    // Si el origen está registrado como zona de cobertura
    // y el destino aparece en las paradas, aceptar la ruta
    if (origenEnZonas && indiceDestino !== -1) {
      return true;
    }

    // Si el destino está registrado como zona final
    // y el origen aparece en las paradas
    if (indiceOrigen !== -1 && destinoEnZonas) {
      return true;
    }

    // Si ambos coinciden únicamente con zonas registradas,
    // no tenemos suficiente información del recorrido
    return false;
  });

  return resultados;
}

module.exports = { buscarRutas };
