import './Nav.css';
import movuLogo from '../assets/img/logomovu.png';

function Nav() {

  // Cerrar sesión
  function cerrarSesion() {
    sessionStorage.removeItem('movuToken');
    sessionStorage.removeItem('movuUsuario');

    window.location.href = '/';
  }

  return (
    <>
      <header>
        <nav className="navbar">

          {/* Logo */}
          <a id="logo-container" href="/" className="link">
            <div id="logo-image">
              <img id="logo" src={movuLogo} alt="Movu" />
            </div>
            <h2>Movu</h2>
          </a>

          {/* Navegación principal */}
          <div className="nav-links">
            <a href="/dashboard" className="link">
              Dashboard
            </a>

            <a href="/catalogo" className="link">
              Directorio
            </a>
          </div>

          {/* Usuario */}
          <div className="nav-user">
            <a href="/profile" className="link">
              Perfil
            </a>

            <button
              className="close-btn"
              onClick={cerrarSesion}
            >
              Cerrar sesión
            </button>
          </div>

        </nav>
      </header>
    </>
  );
}

export default Nav;