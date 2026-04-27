import React from 'react';
import { MessageCircle, Phone } from 'lucide-react';
import QuantumNetwork from './Simulation';
import './Contact.css';

const Contact = () => {
  const phoneNumber = "51950278644";
  const displayNumber = "+51 950 278 644";
  const whatsappUrl = `https://wa.me/${phoneNumber}`;
  const callUrl = `tel:+${phoneNumber}`;

  return (
    <section className="contact-section" id="contacto">
      {/* Red Cuántica Neural como fondo */}
      <QuantumNetwork />

      {/* Contenido encima de la galaxia */}
      <div className="container contact-container">
        <div className="contact-content">
          <p className="contact-eyebrow">¿Tienes un proyecto en mente?</p>
          <h2 className="contact-title">Hablemos y lo hacemos realidad</h2>
          <p className="contact-subtitle">
            Construimos confianza desde el primer contacto. Un mensaje es el primer ladrillo de tu próximo proyecto.
          </p>

          <div className="contact-actions">
            {/* Botón WhatsApp — abre WhatsApp App en móvil, WhatsApp Web en PC */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp"
              id="whatsapp-cta"
            >
              <MessageCircle size={22} />
              <span>Escríbenos por WhatsApp</span>
            </a>

            {/* Botón Llamada — en PC muestra el número, en móvil llama directo */}
            <a
              href={callUrl}
              className="btn-call"
              id="call-cta"
            >
              <Phone size={20} />
              <span>{displayNumber}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
