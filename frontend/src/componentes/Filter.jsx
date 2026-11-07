
import { useState } from 'react';

function Filter({ rutas, onFiltrar }) {

  // Estados de los campos del filtro
  const [origen, setOrigen] = useState('');
  const [destino, setDestino] = useState('');
  const [empresa, setEmpresa] = useState('all');
  const [universidad, setUniversidad] = useState('all');
  const [texto, setTexto] = useState('');

  // Obtener empresas disponibles
  const empresas = [...new Set(
    rutas
      .map(ruta => ruta['company-name']?.trim())
      .filter(Boolean)
  )].sort((a, b) => a.localeCompare(b, 'es'));

  // Obtener universidades disponibles
  const universidades = new Map();

  rutas.forEach(ruta => {
    const textoUniversidades =
      ruta['Universidades '] ||
      ruta['Universidades'] ||
      '';

    String(textoUniversidades)
      .split(/[,;\n]|\s+—\s+/)
      .map(nombre => nombre.trim())
      .filter(nombre =>
        nombre.toLowerCase().startsWith('universidad')
      )
      .forEach(nombre => {
        const clave = nombre.toLocaleLowerCase('es');

        if (!universidades.has(clave)) {
          universidades.set(clave, nombre);
        }
      });
  });

  // Aplicar todos los filtros
  function filtrarRutas(filtros) {
    const filtradas = rutas.filter(ruta => {
      const nombreEmpresa =
        (ruta['company-name'] || '').toLowerCase();

      const codigo =
        (ruta.busCode || ruta.routeId || '').toLowerCase();

      const origenRuta = (ruta.origen || '').toLowerCase();
      const destinoRuta = (ruta.destino || '').toLowerCase();
      const recorrido = (ruta.stop || '').toLowerCase();

      const universidadesRuta = (
        ruta['Universidades '] ||
        ruta['Universidades'] ||
        ''
      ).toLowerCase();

      const coincideOrigen =
        !filtros.origen ||
        origenRuta.includes(filtros.origen.toLowerCase());

      const coincideDestino =
        !filtros.destino ||
        destinoRuta.includes(filtros.destino.toLowerCase());

      const coincideEmpresa =
        filtros.empresa === 'all' ||
        nombreEmpresa.includes(filtros.empresa.toLowerCase());

      const coincideUniversidad =
        filtros.universidad === 'all' ||
        universidadesRuta.includes(filtros.universidad.toLowerCase());

      const textoCompleto = [
        nombreEmpresa,
        codigo,
        origenRuta,
        destinoRuta,
        recorrido,
        universidadesRuta
      ].join(' ');

      const coincideTexto =
        !filtros.texto ||
        textoCompleto.includes(filtros.texto.toLowerCase());

      return coincideOrigen &&
        coincideDestino &&
        coincideEmpresa &&
        coincideUniversidad &&
        coincideTexto;
    });

    onFiltrar(filtradas);
  }

  // Buscar al enviar el formulario
  function manejarBusqueda(event) {
    event.preventDefault();

    filtrarRutas({
      origen,
      destino,
      empresa,
      universidad,
      texto
    });
  }

  // Actualizar los selectores y filtrar inmediatamente
  function manejarEmpresa(event) {
    const valor = event.target.value;
    setEmpresa(valor);

    filtrarRutas({
      origen,
      destino,
      empresa: valor,
      universidad,
      texto
    });
  }

  function manejarUniversidad(event) {
    const valor = event.target.value;
    setUniversidad(valor);

    filtrarRutas({
      origen,
      destino,
      empresa,
      universidad: valor,
      texto
    });
  }

  return (
    <section id="search">
      <div id="search-container">
        <form className="search-box" onSubmit={manejarBusqueda}>

          <input
            type="text"
            id="origen"
            placeholder="Origen"
            value={origen}
            onChange={event => setOrigen(event.target.value)}
          />

          <input
            type="text"
            id="destino"
            placeholder="Destino"
            value={destino}
            onChange={event => setDestino(event.target.value)}
          />

          <div className="filter">
            <select
              className="empresaSelect"
              id="empresaSelect"
              value={empresa}
              onChange={manejarEmpresa}
            >
              <option value="all">Todas las empresas</option>

              {empresas.map(nombre => (
                <option key={nombre} value={nombre}>
                  {nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="filter">
            <select
              className="UniversidadSelect"
              id="UniversidadSelect"
              value={universidad}
              onChange={manejarUniversidad}
            >
              <option value="all">Todas las universidades</option>

              {[...universidades.values()]
                .sort((a, b) => a.localeCompare(b, 'es'))
                .map(nombre => (
                  <option key={nombre} value={nombre}>
                    {nombre}
                  </option>
                ))}
            </select>
          </div>

          <input
            type="search"
            id="search-input"
            placeholder="Buscar rutas, empresa o destino"
            value={texto}
            onChange={event => setTexto(event.target.value)}
          />

          <button id="search-button" type="submit">
            Buscar
          </button>

        </form>
      </div>
    </section>
  );
}

export default Filter;
