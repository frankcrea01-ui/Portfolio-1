import React from 'react';
import './Hero.css';

const Hero = () => {
  return (
    <section className="hero">
      <div className="container hero-container">
        <h1 className="hero-title">
          CONSTRUYENDO EL FUTURO CON <span className="highlight-text">SÓLIDA INGENIERÍA</span>
        </h1>
        <p className="hero-subtitle">
          Especialistas en construcción de alto nivel, remodelaciones premium y refuerzos estructurales avanzados. Transformamos visiones en realidades tangibles.
        </p>
        <div className="hero-actions">
          <a href="#portfolio" className="btn-primary">Ver Proyectos</a>
          <a href="#servicios" className="btn-secondary">Nuestros Servicios</a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
