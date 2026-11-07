
import { useState } from 'react';
import './SearchBar.css';

function SearchBar({ onBuscar }) {
  const [busqueda, setBusqueda] = useState('');

  function manejarBusqueda(event) {
    event.preventDefault();

    // Enviar el texto al Dashboard
    onBuscar(busqueda.trim());
  }

  function limpiarBusqueda() {
    setBusqueda('');
    onBuscar('');
  }

  return (
    <section className="bussearch">
      <form onSubmit={manejarBusqueda}>
        <label htmlFor="bus-input">
          Buscar una ruta o destino
        </label>

        <div className="searchbox">
          <input
            type="search"
            id="bus-input"
            name="bus-input"
            value={busqueda}
            onChange={(event) => setBusqueda(event.target.value)}
            placeholder="Busca una universidad, ruta, parada o destino..."
          />

          <button type="submit" className="search-btn">
            Buscar
          </button>

          {busqueda && (
            <button
              type="button"
              className="clear-search"
              onClick={limpiarBusqueda}
              aria-label="Limpiar búsqueda"
            >
              ×
            </button>
          )}
        </div>
      </form>
    </section>
  );
}

export default SearchBar;
