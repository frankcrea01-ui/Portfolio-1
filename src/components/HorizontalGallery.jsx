import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { projects } from '../data/projects';
import './HorizontalGallery.css';

gsap.registerPlugin(useGSAP);

const HorizontalGallery = () => {
  const containerRef = useRef();
  const trackRef = useRef();

  useGSAP(() => {
    const track = trackRef.current;
    
    // Animación infinita moviendo el track hacia la izquierda.
    // Como duplicamos el array de proyectos, movemos hasta -50% para que sea un loop perfecto.
    const tween = gsap.to(track, {
      xPercent: -50,
      ease: "none",
      duration: 30, // Velocidad del scroll
      repeat: -1
    });

    // Pausar al hacer hover
    const pauseAnim = () => tween.pause();
    const playAnim = () => tween.play();

    track.addEventListener("mouseenter", pauseAnim);
    track.addEventListener("mouseleave", playAnim);

    return () => {
      track.removeEventListener("mouseenter", pauseAnim);
      track.removeEventListener("mouseleave", playAnim);
    };
  }, { scope: containerRef });

  return (
    <section className="gallery-section" id="portfolio" ref={containerRef}>
      <div className="container">
        <h2 className="section-title">Nuestros Proyectos</h2>
      </div>
      <div className="gallery-viewport">
        <div className="gallery-track" ref={trackRef}>
          {/* Duplicamos los items para el efecto de loop infinito */}
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
    </section>
  );
};

export default HorizontalGallery;
