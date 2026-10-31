
document.addEventListener('DOMContentLoaded', iniciarCatalogo);

let rutas = [];

async function iniciarCatalogo() {
  const contenedor = document.getElementById('routes-container');
  const botonBuscar = document.getElementById('search-button');

  try {
    const respuesta = await fetch('http://localhost:3000/api/rutas');

    if (!respuesta.ok) {
      throw new Error('No se pudieron consultar las rutas.');
    }

    rutas = await respuesta.json();

    if (!Array.isArray(rutas)) {
      throw new Error('La API no devolvió una lista de rutas.');
    }

    poblarFiltros(rutas);
    mostrarRutas(rutas);

    botonBuscar.addEventListener('click', filtrarRutas);

    document.getElementById('origen').addEventListener('keydown', buscarConEnter);
    document.getElementById('destino').addEventListener('keydown', buscarConEnter);
    document.getElementById('search-input').addEventListener('keydown', buscarConEnter);

    document.getElementById('empresaSelect').addEventListener('change', filtrarRutas);
    document.getElementById('UniversidadSelect').addEventListener('change', filtrarRutas);

  } catch (error) {
    console.error('Error al cargar el catálogo:', error);

    contenedor.innerHTML = `
      <p>No fue posible cargar las rutas. Comprueba que el servidor esté funcionando.</p>
    `;
  }
}

/* =========================================================
   CARGAR OPCIONES DINÁMICAS DE LOS FILTROS
========================================================= */

function poblarFiltros(listaRutas) {
  const empresaSelect = document.getElementById('empresaSelect');
  const universidadSelect = document.getElementById('UniversidadSelect');

  // Obtener empresas únicas
  const empresas = [...new Set(
    listaRutas
      .map(ruta => ruta['company-name']?.trim())
      .filter(Boolean)
  )].sort((a, b) => a.localeCompare(b, 'es'));

  // Obtener universidades únicas
  const universidades = new Map();

  listaRutas.forEach(ruta => {
    const textoUniversidades =
      ruta['Universidades '] ||
      ruta['Universidades'] ||
      '';

    // Separar nombres si hay varias universidades en un campo
    textoUniversidades
      .split(/[,;\n]|\s+—\s+/)
      .map(nombre => nombre.trim())
      .filter(nombre => nombre.toLowerCase().startsWith('universidad'))
      .forEach(nombre => {
        const clave = nombre.toLocaleLowerCase('es');

        if (!universidades.has(clave)) {
          universidades.set(clave, nombre);
        }
      });
  });

  // Llenar selector de empresas
  empresaSelect.replaceChildren(
    new Option('Todas las empresas', 'all')
  );

  empresas.forEach(empresa => {
    empresaSelect.add(new Option(empresa, empresa));
  });

  // Llenar selector de universidades
  universidadSelect.replaceChildren(
    new Option('Todas las universidades', 'all')
  );

  [...universidades.values()]
    .sort((a, b) => a.localeCompare(b, 'es'))
    .forEach(universidad => {
      universidadSelect.add(new Option(universidad, universidad));
    });
}


/* =========================================================
   MOSTRAR RUTAS AGRUPADAS POR EMPRESA
========================================================= */

function mostrarRutas(listaRutas) {
  const contenedor = document.getElementById('routes-container');
  contenedor.innerHTML = '';

  if (listaRutas.length === 0) {
    contenedor.innerHTML = '<p>No se encontraron rutas.</p>';
    return;
  }

  const empresas = {};

  listaRutas.forEach(ruta => {
    const empresa = ruta['company-name'] || 'Empresa no disponible';

    if (!empresas[empresa]) {
      empresas[empresa] = [];
    }

    empresas[empresa].push(ruta);
  });

  Object.entries(empresas).forEach(([empresa, rutasEmpresa]) => {
    const seccion = document.createElement('div');
    seccion.className = 'company-container';

    seccion.innerHTML = `
      <div class="company-section">
        <span class="company-name">${escaparHTML(empresa)}</span>
      </div>
      <div class="route-grid">
        ${rutasEmpresa.map(crearTarjetaRuta).join('')}
      </div>
    `;

    contenedor.appendChild(seccion);
  });
}


/* =========================================================
   FILTRAR RUTAS
========================================================= */

function filtrarRutas() {
  const origen = document.getElementById('origen').value.trim().toLowerCase();
  const destino = document.getElementById('destino').value.trim().toLowerCase();
  const texto = document.getElementById('search-input').value.trim().toLowerCase();

  const empresa = document.getElementById('empresaSelect').value;
  const universidad = document.getElementById('UniversidadSelect').value;

  const filtradas = rutas.filter(ruta => {
    const nombreEmpresa = (ruta['company-name'] || '').toLowerCase();
    const codigo = (ruta.busCode || ruta.routeId || '').toLowerCase();
    const origenRuta = (ruta.origen || '').toLowerCase();
    const destinoRuta = (ruta.destino || '').toLowerCase();
    const recorrido = (ruta.stop || '').toLowerCase();

    const universidades = (
      ruta['Universidades '] ||
      ruta['Universidades'] ||
      ''
    ).toLowerCase();

    const coincideOrigen = !origen || origenRuta.includes(origen);
    const coincideDestino = !destino || destinoRuta.includes(destino);

    const coincideEmpresa =
      empresa === 'all' || nombreEmpresa.includes(empresa.toLowerCase());

    const coincideUniversidad =
      universidad === 'all' ||
      universidades.includes(universidad.toLowerCase());

    const textoCompleto = [
      nombreEmpresa,
      codigo,
      origenRuta,
      destinoRuta,
      recorrido,
      universidades
    ].join(' ');

    const coincideTexto = !texto || textoCompleto.includes(texto);

    return coincideOrigen &&
      coincideDestino &&
      coincideEmpresa &&
      coincideUniversidad &&
      coincideTexto;
  });

  mostrarRutas(filtradas);
}


function buscarConEnter(event) {
  if (event.key === 'Enter') {
    filtrarRutas();
  }
}
