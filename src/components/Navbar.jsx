import React from 'react';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <div className="logo">
          CONSTRUCCIÓN & <span className="highlight">REMODELACIONES</span>
        </div>
        <ul className="nav-links">
          <li><a href="#portfolio">Portfolio</a></li>
          <li><a href="#servicios">Servicios</a></li>
          <li><a href="#contacto" className="btn-contact">Contacto</a></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
