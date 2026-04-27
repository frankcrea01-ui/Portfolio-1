import React from 'react';
import { Building2, HardHat, Scale } from 'lucide-react';
import './Services.css';

const servicesData = [
  {
    title: 'Diseño Estructural',
    description: 'Planos y memorias de cálculo diseñados bajo normativa técnica para una seguridad estructural garantizada.',
    details: ['Planos de edificaciones', 'Ingeniería básica de estructuras metálicas', 'Planos de fabricación de estructuras metálicas', 'Planos de montaje de estructuras metálicas', 'Memorias de cálculo', 'Modelado BIM'],
    icon: Building2,
    gradient: 'linear-gradient(135deg, rgba(37, 99, 235, 0.1), rgba(49, 46, 129, 0.1))',
    accentColor: '#60a5fa'
  },
  {
    title: 'Construcción y Remodelación',
    description: 'Supervisión técnica especializada en remodelaciones y obra civil con enfoque en acabados de calidad.',
    details: ['Reforzamientos Estructurales', 'Remodelaciones Arquitectura', 'Ejecución de Obra Civil', 'Supervisión Técnica'],
    icon: HardHat,
    gradient: 'linear-gradient(135deg, rgba(217, 119, 6, 0.1), rgba(120, 53, 15, 0.1))',
    accentColor: '#fbbf24'
  },
  {
    title: 'Saneamiento Físico Legal',
    description: 'Soluciones legales para la regularización de edificaciones, garantizando su libre disposición registral.',
    details: ['Declaratoria de Fábrica/Edificación', 'Subdivisiones', 'Independizaciones', 'Rectificación de Áreas'],
    icon: Scale,
    gradient: 'linear-gradient(135deg, rgba(5, 150, 105, 0.1), rgba(19, 78, 74, 0.1))',
    accentColor: '#34d399'
  }
];

const Services = () => {
  return (
    <section className="services-section" id="servicios">
      <div className="container relative-content">
        <div className="services-header">
          <h2 className="section-title text-center">Nuestros Servicios</h2>
          <p className="services-subtitle text-center">
            Soluciones integrales de ingeniería y construcción adaptadas a las necesidades de tu proyecto.
          </p>
        </div>

        <div className="services-grid">
          {servicesData.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <div 
                className="service-card glassmorphism" 
                key={index}
                style={{ background: service.gradient }}
              >
                <div className="service-content">
                  <div className="service-icon-wrapper" style={{ backgroundColor: `${service.accentColor}20`, border: `1px solid ${service.accentColor}40` }}>
                    <IconComponent size={32} className="service-icon" style={{ color: service.accentColor }} />
                  </div>
                  <h3 className="service-title">{service.title}</h3>
                  <p className="service-description">{service.description}</p>
                  
                  <ul className="service-details-list">
                    {service.details.map((detail, idx) => (
                      <li key={idx} className="service-detail-item">
                        <span className="bullet" style={{ color: service.accentColor }}>•</span> {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;
