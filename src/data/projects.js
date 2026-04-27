// Para agregar más proyectos:
// 1. Coloca tu imagen en src/assets/projects/ (ej: p5.png)
// 2. Importa la imagen abajo
// 3. Agrega un nuevo objeto al array con id, title, description e image

import p1 from '../assets/projects/p1.png';
import p2 from '../assets/projects/p2.png';
import p3 from '../assets/projects/p3.png';
import p4 from '../assets/projects/p4.png';

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
];
