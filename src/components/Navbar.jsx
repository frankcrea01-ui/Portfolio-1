import React, { useState } from 'react';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <div className="logo">
          CONSTRUCCIÓN & <span className="highlight">REMODELACIONES</span>
        </div>

        {/* Desktop nav */}
        <ul className="nav-links desktop-nav">
          <li><a href="#portfolio" onClick={closeMenu}>Portfolio</a></li>
          <li><a href="#servicios" onClick={closeMenu}>Servicios</a></li>
          <li><a href="#contacto" className="btn-contact" onClick={closeMenu}>Contacto</a></li>
        </ul>

        {/* Hamburger button — solo visible en móvil */}
        <button
          className={`hamburger ${isOpen ? 'open' : ''}`}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Menú"
          id="hamburger-btn"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* Mobile dropdown menu */}
      <div className={`mobile-menu ${isOpen ? 'mobile-menu--open' : ''}`}>
        <ul className="mobile-nav-links">
          <li><a href="#portfolio" onClick={closeMenu}>Portfolio</a></li>
          <li><a href="#servicios" onClick={closeMenu}>Servicios</a></li>
          <li><a href="#contacto" onClick={closeMenu} className="btn-contact-mobile">Contacto</a></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
