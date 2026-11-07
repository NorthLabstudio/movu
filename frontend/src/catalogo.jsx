
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import Nav from './componentes/Nav.jsx';
import Catalogo from './pages/Catalogo.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <>
      <Nav />
      <Catalogo />
    </>
  </StrictMode>
);
