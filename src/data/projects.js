// Para agregar más proyectos:
// 1. Coloca tu imagen en src/assets/projects/ (ej: p5.png)
// 2. Importa la imagen abajo
// 3. Agrega un nuevo objeto al array con id, title, description e image

import p1 from '../assets/projects/p1.png';
import p2 from '../assets/projects/p2.png';
import p3 from '../assets/projects/p3.png';
import p4 from '../assets/projects/p4.png';
import p5 from '../assets/projects/p5.png';
import p6 from '../assets/projects/p6.png';
import p7 from '../assets/projects/p7.png';
import p8 from '../assets/projects/p8.png';
import p9 from '../assets/projects/p9.png';
import p10 from '../assets/projects/p10.png';
import p11 from '../assets/projects/p11.png';

export const projects = [
  {
    id: 1,
    title: 'Vaciado de Losa Aligerada',
    description: 'Ejecución de losa aligerada con supervisión técnica en cada etapa del proceso: encofrado, armado, vaciado y curado de concreto.',
    image: p1,
  },
  {
    id: 2,
    title: 'Verificación de Recubrimiento de Acero',
    description: 'Supervisión en campo del correcto recubrimiento de acero de refuerzo, garantizando el cumplimiento de la normativa estructural vigente.',
    image: p2,
  },
  {
    id: 3,
    title: 'Prueba de Presión Hidrostática',
    description: 'Control de calidad mediante prueba de presión hidrostática en instalaciones sanitarias de batería de baño, previo al vaciado del techo.',
    image: p3,
  },
  {
    id: 4,
    title: 'Demolición de Cimentación Existente',
    description: 'Demolición controlada de cimentación preexistente con maquinaria especializada, preparando el terreno para la nueva estructura.',
    image: p4,
  },
  {
    id: 5,
    title: 'Proyecto de Remodelación – Punta Hermosa',
    description: 'Ejecución de proyecto de remodelación integral en vivienda ubicada en Punta Hermosa, con intervención en estructura, acabados y distribución de ambientes.',
    image: p5,
  },
  {
    id: 6,
    title: 'Inspección de Armadura en Losa Maciza',
    description: 'Verificación técnica del acero de refuerzo en losa maciza: distribución, espaciamiento, diámetros y recubrimientos conforme a planos estructurales.',
    image: p6,
  },
  {
    id: 7,
    title: 'Vaciado de Concreto en Losa y Vigas',
    description: 'Vaciado de concreto en elementos horizontales (losa y vigas), con control de mezcla, secuencia de colocación y seguimiento del proceso de curado.',
    image: p7,
  },
  {
    id: 8,
    title: 'Vibrado de Concreto en Placa',
    description: 'Aplicación de vibrado mecánico en placa de concreto recién vaciada para eliminar vacíos, garantizando compactación uniforme y resistencia estructural.',
    image: p8,
  },
  {
    id: 9,
    title: 'Ensayo de Asentamiento (Slump Test)',
    description: 'Verificación de la consistencia y trabajabilidad del concreto mediante ensayo de asentamiento (Slump Test), en cumplimiento de la norma NTP 339.035.',
    image: p9,
  },
  {
    id: 10,
    title: 'Ensayo de Densidad de Campo (Cono de Arena)',
    description: 'Control de compactación de suelos mediante ensayo de densidad de campo por el método del cono de arena, para validar el porcentaje de compactación requerido.',
    image: p10,
  },
  {
    id: 11,
    title: 'Control Topográfico y Verificación de Niveles',
    description: 'Verificación de niveles y cotas de proyecto mediante equipos topográficos de precisión (nivel óptico / estación total), asegurando la correcta ejecución geométrica de la obra.',
    image: p11,
  },
];
