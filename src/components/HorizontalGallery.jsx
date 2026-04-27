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
  const [current, setCurrent]       = useState(0);
  const [progressKey, setProgressKey] = useState(0); // cambiar la key reinicia la animación CSS
  const [isPaused, setIsPaused]     = useState(false);
  const touchStartX  = useRef(null);
  const pauseTimerRef = useRef(null);
  const total = projects.length;

  const AUTO_DELAY   = 4000; // ms entre cambios automáticos
  const PAUSE_AFTER  = 6000; // ms de pausa tras interacción del usuario

  // ── Función central de navegación ─────────────────────────────────────────
  const goTo = useCallback((newIdx, isUser = false) => {
    setCurrent(((newIdx % total) + total) % total);
    setProgressKey(k => k + 1); // reinicia la barra de progreso

    if (isUser) {
      setIsPaused(true);
      clearTimeout(pauseTimerRef.current);
      pauseTimerRef.current = setTimeout(() => setIsPaused(false), PAUSE_AFTER);
    }
  }, [total]);

  // ── Auto-avance: se activa cuando current cambia y NO está pausado ─────────
  useEffect(() => {
    if (isPaused) return; // respeta la ventana de pausa
    const timer = setTimeout(() => {
      setCurrent(i => (i + 1) % total);
      setProgressKey(k => k + 1);
    }, AUTO_DELAY);
    return () => clearTimeout(timer);
  }, [current, isPaused, total]);

  // Limpiar timer al desmontar
  useEffect(() => () => clearTimeout(pauseTimerRef.current), []);

  // ── Atajos de navegación ───────────────────────────────────────────────────
  const prev = () => goTo(current - 1, true);
  const next = () => goTo(current + 1, true);

  // ── Swipe táctil ──────────────────────────────────────────────────────────
  const onTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const onTouchEnd   = (e) => {
    if (touchStartX.current === null) return;
    const delta = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 40) goTo(delta > 0 ? current + 1 : current - 1, true);
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

        {/* Barra de progreso — vive en la parte superior de la tarjeta */}
        <div className="progress-track" aria-hidden="true">
          {!isPaused && (
            <div key={progressKey} className="progress-bar" />
          )}
          {isPaused && (
            <div className="progress-bar progress-bar--paused" />
          )}
        </div>

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
              onClick={() => goTo(i, true)}
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

      {/* Contador + estado de pausa */}
      <p className="carousel-counter">
        {current + 1} / {total}
        {isPaused && <span className="pause-badge"> · pausado</span>}
      </p>
    </div>
  );
};


// ── Componente Galería Desktop (GSAP marquee + flechas) ──────────────────────
const DesktopGallery = () => {
  const containerRef = useRef();
  const trackRef     = useRef();
  const tweenRef     = useRef(null);

  // Duración equivalente a un card en el tween (4 cards duplicados = 8 items)
  const CARD_DURATION = 30 / (projects.length * 2);

  // Avanzar o retroceder el tween sin detenerlo
  const skip = (dir) => {
    if (!tweenRef.current) return;
    const t = tweenRef.current;
    let newTime = t.time() + dir * CARD_DURATION;
    // Envolvemos dentro del rango para no salirnos del loop
    if (newTime < 0) newTime += t.duration();
    t.time(newTime);
  };

  useGSAP(() => {
    const track = trackRef.current;
    tweenRef.current = gsap.to(track, {
      xPercent: -50,
      ease: 'none',
      duration: 30,
      repeat: -1,
    });

    const pause = () => tweenRef.current.pause();
    const play  = () => tweenRef.current.play();

    track.addEventListener('mouseenter', pause);
    track.addEventListener('mouseleave', play);

    return () => {
      track.removeEventListener('mouseenter', pause);
      track.removeEventListener('mouseleave', play);
    };
  }, { scope: containerRef });

  return (
    <div className="desktop-gallery-wrapper" ref={containerRef}>

      {/* Flecha izquierda */}
      <button
        className="desktop-arrow desktop-arrow--left"
        onClick={() => skip(-1)}
        id="gallery-prev"
        aria-label="Proyecto anterior"
      >
        <ChevronLeft size={28} />
      </button>

      <div className="gallery-viewport">
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

      {/* Flecha derecha */}
      <button
        className="desktop-arrow desktop-arrow--right"
        onClick={() => skip(1)}
        id="gallery-next"
        aria-label="Proyecto siguiente"
      >
        <ChevronRight size={28} />
      </button>

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
