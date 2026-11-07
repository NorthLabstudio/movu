import Filter from '../componentes/Filter.jsx';
import Cards from '../componentes/Cards.jsx';
import Nav from '../componentes/Nav.jsx';


import { useEffect, useState } from 'react';

function Catalogo() {

  // Estado para guardar todas las rutas del backend.
  const [rutas, setRutas] = useState([]);

  // Estado para guardar las rutas que coinciden con los filtros.
  const [rutasFiltradas, setRutasFiltradas] = useState([]);

  // Estados para controlar la carga y los errores.
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  // Cargar las rutas desde el backend.
  useEffect(() => {
    async function cargarRutas() {
      try {
        const respuesta = await fetch('http://localhost:3000/api/rutas');

        if (!respuesta.ok) {
          throw new Error('No se pudieron consultar las rutas.');
        }

        const datos = await respuesta.json();

        if (!Array.isArray(datos)) {
          throw new Error('La API no devolvió una lista de rutas.');
        }

        setRutas(datos);
        setRutasFiltradas(datos);

      } catch (error) {
        console.error('Error al cargar el catálogo:', error);
        setError('No fue posible cargar las rutas. Comprueba que el servidor esté funcionando.');

      } finally {
        setCargando(false);
      }
    }

    cargarRutas();
  }, []);

  // Agrupar las rutas filtradas por empresa.
  const rutasPorEmpresa = rutasFiltradas.reduce((grupos, ruta) => {
    const empresa = ruta['company-name'] || 'Empresa no disponible';

    if (!grupos[empresa]) {
      grupos[empresa] = [];
    }

    grupos[empresa].push(ruta);

    return grupos;
  }, {});

  return (
    <main>

      {/* Introducción del catálogo */}
      <section className="intro">
        <div className="intro-content">
          <h1>Directorio de Rutas</h1>
          <p>
            Explora las rutas de transporte público de Barranquilla,
            conoce sus recorridos y encuentra información útil para
            planificar mejor tu viaje.
          </p>
        </div>
      </section>

      {/* Filtros del catálogo */}
      <Filter
        rutas={rutas}
        onFiltrar={setRutasFiltradas}
      />

      {/* Resultados */}
      <section id="rutas-directory">
        <h2>Rutas</h2>

        <div id="routes-container">

          {cargando ? (
            <p>Cargando rutas...</p>
          ) : error ? (
            <p>{error}</p>
          ) : rutasFiltradas.length === 0 ? (
            <p>No se encontraron rutas.</p>
          ) : (
            Object.entries(rutasPorEmpresa).map(([empresa, rutasEmpresa]) => (
              <div className="company-container" key={empresa}>

                <div className="company-section">
                  <span className="company-name">{empresa}</span>
                </div>

                <div className="route-grid">
                  {rutasEmpresa.map(ruta => (
                    <Cards
                      key={ruta._id}
                      ruta={ruta}
                    />
                  ))}
                </div>

              </div>
            ))
          )}

        </div>
      </section>

    </main>
  );
}

export default Catalogo;
