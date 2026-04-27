import React, { useRef, useState, useEffect, useCallback } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { projects } from '../data/projects';
import './HorizontalGallery.css';

gsap.registerPlugin(useGSAP);

// ── Hook: detectar si es móvil ────────────────────────────────────────────────
function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < breakpoint);
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [breakpoint]);
  return isMobile;
}

// ── Componente Carousel Móvil ─────────────────────────────────────────────────
const MobileCarousel = () => {
  const [current, setCurrent] = useState(0);
  const touchStartX = useRef(null);
  const total = projects.length;

  const prev = () => setCurrent(i => (i - 1 + total) % total);
  const next = useCallback(() => setCurrent(i => (i + 1) % total), [total]);

  // Swipe táctil
  const onTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const onTouchEnd   = (e) => {
    if (touchStartX.current === null) return;
    const delta = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 40) delta > 0 ? next() : prev();
    touchStartX.current = null;
  };

  return (
    <div
      className="mobile-carousel"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Tarjeta activa */}
      <div className="mobile-card">
        <img
          src={projects[current].image}
          alt={projects[current].title}
          className="mobile-card-image"
        />
        <div className="mobile-card-info">
          <h3 className="mobile-card-title">{projects[current].title}</h3>
          <p className="mobile-card-desc">{projects[current].description}</p>
        </div>
      </div>

      {/* Controles */}
      <div className="carousel-controls">
        <button
          className="carousel-arrow"
          onClick={prev}
          id="carousel-prev"
          aria-label="Proyecto anterior"
        >
          <ChevronLeft size={24} />
        </button>

        {/* Dots indicadores */}
        <div className="carousel-dots">
          {projects.map((_, i) => (
            <button
              key={i}
              className={`dot ${i === current ? 'dot--active' : ''}`}
              onClick={() => setCurrent(i)}
              aria-label={`Ir a proyecto ${i + 1}`}
            />
          ))}
        </div>

        <button
          className="carousel-arrow"
          onClick={next}
          id="carousel-next"
          aria-label="Proyecto siguiente"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Contador */}
      <p className="carousel-counter">{current + 1} / {total}</p>
    </div>
  );
};

// ── Componente Galería Desktop (GSAP marquee) ─────────────────────────────────
const DesktopGallery = () => {
  const containerRef = useRef();
  const trackRef     = useRef();

  useGSAP(() => {
    const track = trackRef.current;
    const tween = gsap.to(track, {
      xPercent: -50,
      ease: 'none',
      duration: 30,
      repeat: -1,
    });

    const pause = () => tween.pause();
    const play  = () => tween.play();

    track.addEventListener('mouseenter', pause);
    track.addEventListener('mouseleave', play);

    return () => {
      track.removeEventListener('mouseenter', pause);
      track.removeEventListener('mouseleave', play);
    };
  }, { scope: containerRef });

  return (
    <div className="gallery-viewport" ref={containerRef}>
      <div className="gallery-track" ref={trackRef}>
        {[...projects, ...projects].map((project, index) => (
          <div className="gallery-item" key={`${project.id}-${index}`}>
            <div className="image-wrapper">
              <img src={project.image} alt={project.title} className="gallery-image" />
              <div className="gallery-overlay">
                <div className="overlay-content">
                  <h3 className="project-title">{project.title}</h3>
                  <p className="project-desc">{project.description}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Componente principal ──────────────────────────────────────────────────────
const HorizontalGallery = () => {
  const isMobile = useIsMobile();

  return (
    <section className="gallery-section" id="portfolio">
      <div className="container">
        <h2 className="section-title">Nuestros Proyectos</h2>
      </div>
      {isMobile ? <MobileCarousel /> : <DesktopGallery />}
    </section>
  );
};

export default HorizontalGallery;
