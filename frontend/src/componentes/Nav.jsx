import './Nav.css';
import movuLogo from '../assets/img/logomovu.png';


function Nav() {
  return (
    <>
      <header>
        <nav className="navbar">
          <a id="logo-container" href="/" className="link">
            <div id="logo-image">
              <img id="logo" src={movuLogo} alt="Movu" />
            </div>
            <h2>Movu</h2>
          </a>

          <div className="nav-links">
            <a href="/" className="link">
              Dashboard
            </a>
            <a href="/catalogo" className="link">
              Directorio
            </a>
          </div>

          <div className="nav-user">
            <a href="/profile" className="link">
              Perfil
            </a>
            <button className="close-btn">Cerrar sesión</button>
          </div>
        </nav>
      </header>
    </>
  );
}

export default Nav;
