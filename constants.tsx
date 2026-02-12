
import React from 'react';
import { Category, AgendaEvent, Resource, BlogPost, Proposal, ProposalStatus, User, Role } from './types';

// Helper to get dynamic dates so calendar always shows data
const today = new Date();
const currentYear = today.getFullYear();
const currentMonth = String(today.getMonth() + 1).padStart(2, '0');
const nextMonthNum = today.getMonth() + 2 > 12 ? 1 : today.getMonth() + 2;
const nextMonthYear = today.getMonth() + 2 > 12 ? currentYear + 1 : currentYear;
const nextMonth = String(nextMonthNum).padStart(2, '0');

const getDate = (day: number, monthStr: string = currentMonth, yearNum: number = currentYear) => {
    return `${yearNum}-${monthStr}-${String(day).padStart(2, '0')}`;
}

export const MOCK_USERS: User[] = [
  {
    id: 'u1',
    name: 'Alejandro Inexsos',
    email: 'alejandro@inexsos.com',
    role: Role.Admin
  },
  {
    id: 'u2',
    name: 'María Editora',
    email: 'maria@badajoz.es',
    role: Role.Editor
  },
  {
    id: 'u3',
    name: 'Juan Gestión',
    email: 'juan@farmamundi.org',
    role: Role.Gestor
  }
];

export const MOCK_EVENTS: AgendaEvent[] = [
  {
    id: '1',
    title: 'Ruta Saludable por el Guadiana',
    date: getDate(today.getDate()), // Today
    startTime: '09:00',
    endTime: '11:00',
    location: 'Puente de Palmas',
    description: 'Caminata guiada para conocer la flora local y mejorar la salud cardiovascular. Apta para todas las edades. Se recomienda llevar agua y calzado cómodo.',
    category: Category.Deporte,
    organizer: 'Farmamundi',
    email: 'info@farmamundi.org',
    image: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?q=80&w=1000&auto=format&fit=crop',
    lat: 38.8836,
    lng: -6.9736
  },
  {
    id: '2',
    title: 'Taller de Yoga al Aire Libre',
    date: getDate(today.getDate() + 2), // 2 days from now
    startTime: '18:30',
    endTime: '19:30',
    location: 'Parque de Castelar',
    description: 'Sesión de relajación y respiración profunda en un entorno natural. Trae tu propia esterilla. En caso de lluvia se trasladará al centro cívico.',
    category: Category.Salud,
    organizer: 'Badajoz Respira',
    image: 'https://images.unsplash.com/photo-1544367563-12123d895951?q=80&w=1000&auto=format&fit=crop',
    lat: 38.8754,
    lng: -6.9739
  },
  {
    id: '3',
    title: 'Mercadillo de Productos Ecológicos',
    date: getDate(25), // Fixed day of current month
    startTime: '10:00',
    endTime: '14:00',
    location: 'Plaza Alta',
    description: 'Encuentra frutas, verduras y productos artesanos de productores locales. Apoya el comercio de proximidad y la alimentación saludable.',
    category: Category.Sostenibilidad,
    organizer: 'Asociación de Productores Locales',
    image: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?q=80&w=1000&auto=format&fit=crop',
    lat: 38.8812,
    lng: -6.9692
  },
  {
    id: '4',
    title: 'Cine de Verano: Documentales Verdes',
    date: getDate(26),
    startTime: '21:30',
    endTime: '23:30',
    location: 'La Alcazaba',
    description: 'Proyección del documental "El Planeta Azul". Entrada libre hasta completar aforo. Se debatirá al finalizar.',
    category: Category.Cultura,
    organizer: 'CineClub Badajoz',
    image: 'https://images.unsplash.com/photo-1517604931442-71053e3e2c3c?q=80&w=1000&auto=format&fit=crop',
    lat: 38.8824,
    lng: -6.9678
  },
  {
    id: '5',
    title: 'Avistamiento de Aves',
    date: getDate(5, nextMonth, nextMonthYear), // Next month
    startTime: '08:00',
    endTime: '10:00',
    location: 'Azud del Guadiana',
    description: 'Ruta ornitológica para observar las especies migratorias que visitan nuestro río. Trae prismáticos si tienes.',
    category: Category.Naturaleza,
    organizer: 'Amigos de las Aves',
    image: 'https://images.unsplash.com/photo-1552728089-57bdde30ebd1?q=80&w=1000&auto=format&fit=crop',
    lat: 38.8885,
    lng: -6.9855
  },
   {
    id: '6',
    title: 'Taller de Cocina Saludable',
    date: getDate(today.getDate() + 5),
    startTime: '17:00',
    endTime: '19:00',
    location: 'Centro Joven (Paseo Fluvial)',
    description: 'Aprende a preparar recetas fáciles, rápidas y nutritivas para toda la familia.',
    category: Category.Salud,
    organizer: 'Nutricionistas Sin Fronteras',
    image: 'https://images.unsplash.com/photo-1556910103-1c02745a30bf?q=80&w=1000&auto=format&fit=crop',
    lat: 38.8765, 
    lng: -6.9750
  }
];

export const MOCK_RESOURCES: Resource[] = [
  {
    id: 'r1',
    name: 'Parque del Guadiana',
    category: Category.Naturaleza,
    address: 'Ribera del Guadiana (Margen Derecha)',
    description: 'Pulmón verde de la ciudad con amplias zonas para correr, caminar, parques infantiles y zonas de picnic. Ideal para desconectar del ruido urbano.',
    lat: 38.8855,
    lng: -6.9790,
    tags: ['Aire Puro', 'Running', 'Familia', 'Mascotas'],
    image: 'https://images.unsplash.com/photo-1496568589085-985bb049bb9a?q=80&w=1000&auto=format&fit=crop',
    email: 'medioambiente@badajoz.es'
  },
  {
    id: 'r2',
    name: 'Farmacia 24h Centro',
    category: Category.Salud,
    address: 'Calle Menacho, 12',
    description: 'Servicio farmacéutico permanente en el corazón de Badajoz. Atención primaria y venta de productos de parafarmacia.',
    lat: 38.8783,
    lng: -6.9715,
    tags: ['Emergencias', 'Salud', 'Farmacia'],
    image: 'https://images.unsplash.com/photo-1585435557343-3b092031a831?q=80&w=1000&auto=format&fit=crop',
    phone: '924 22 33 44'
  },
  {
    id: 'r3',
    name: 'Huerto Urbano Suerte de Saavedra',
    category: Category.Sostenibilidad,
    address: 'Calle Antonio Hernández Gil',
    description: 'Espacio comunitario de cultivo ecológico y aprendizaje. Los vecinos gestionan sus parcelas fomentando la soberanía alimentaria.',
    lat: 38.8615,
    lng: -6.9585,
    tags: ['Naturaleza', 'Comunidad', 'Huerto'],
    image: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 'r4',
    name: 'Polideportivo La Granadilla',
    category: Category.Deporte,
    address: 'Av. del Perú',
    description: 'Instalaciones completas para natación, tenis, atletismo y fútbol. Cuenta con piscina olímpica y gimnasio municipal.',
    lat: 38.8640,
    lng: -7.0065,
    tags: ['Deporte', 'Salud', 'Piscina'],
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 'r5',
    name: 'Punto Limpio El Nevero',
    category: Category.Sostenibilidad,
    address: 'Polígono Ind. El Nevero',
    description: 'Centro de recogida selectiva de residuos domésticos que no deben tirarse a los contenedores habituales (pilas, aceites, electrodomésticos).',
    lat: 38.9025,
    lng: -6.9920,
    tags: ['Sostenibilidad', 'Reciclaje', 'Residuos'],
    image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 'r6',
    name: 'Biblioteca Pública del Estado',
    category: Category.Cultura,
    address: 'Av. de Europa, 2',
    description: 'Gran espacio de lectura, estudio y actividades culturales. Acceso gratuito a internet y préstamo de libros.',
    lat: 38.8735,
    lng: -6.9778,
    tags: ['Cultura', 'Libros', 'Estudio'],
    image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 'r7',
    name: 'Centro de Salud Valdepasillas',
    category: Category.Salud,
    address: 'Calle Sinforiano Madroñero',
    description: 'Atención primaria, pediatría y enfermería. Cita previa necesaria.',
    lat: 38.8692,
    lng: -6.9868,
    tags: ['Salud', 'Médico', 'Público'],
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=1000&auto=format&fit=crop'
  }
];

export const MOCK_BLOG: BlogPost[] = [
  {
    id: 'b1',
    title: 'La calidad del aire en Badajoz mejora un 15% tras la peatonalización',
    excerpt: 'Los últimos datos del estudio anual muestran una tendencia positiva en el centro histórico, reduciendo enfermedades respiratorias.',
    author: 'Redacción Badajoz Respira',
    date: getDate(15),
    imageUrl: 'https://images.unsplash.com/photo-1449824913929-2b633d741194?q=80&w=1000&auto=format&fit=crop',
    category: 'Medio Ambiente',
    tags: ['Aire', 'Salud', 'Urbanismo'],
    blocks: [
        { id: '1', type: 'header', content: 'Un respiro para el Casco Antiguo', settings: { textAlign: 'left' } },
        { id: '2', type: 'paragraph', content: 'Gracias a las nuevas medidas de peatonalización en el centro histórico, los niveles de NO2 han descendido significativamente en comparación con el año anterior. Este cambio no solo beneficia a la preservación del patrimonio, sino directamente a la salud de nuestros vecinos.', settings: { textAlign: 'justify' } },
        { id: '3', type: 'quote', content: 'Reducir el tráfico rodado es la medida más eficaz para mejorar la salud pulmonar de la infancia en entornos urbanos.', settings: { textAlign: 'center' } },
        { id: '4', type: 'image', content: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=1000&auto=format&fit=crop', settings: { width: '100%', caption: 'Plaza Alta libre de coches', filter: 'sepia' } },
        { id: '5', type: 'header', content: 'Próximos pasos', settings: { textAlign: 'left' } },
        { id: '6', type: 'paragraph', content: 'El ayuntamiento planea extender estas zonas de bajas emisiones a los barrios periféricos, fomentando el uso de la bicicleta y el transporte público eléctrico.', settings: { textAlign: 'justify' } }
    ]
  },
  {
    id: 'b2',
    title: 'Farmamundi lanza "Salud Global en tu Barrio"',
    excerpt: 'Una campaña enfocada en el derecho a la salud en entornos urbanos y la participación comunitaria.',
    author: 'Comunicación Farmamundi',
    date: getDate(10),
    imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=1000&auto=format&fit=crop',
    category: 'Comunidad',
    tags: ['ONG', 'Campaña', 'Derechos'],
    blocks: [
        { id: '1', type: 'paragraph', content: 'Farmamundi inicia hoy su campaña para promover hábitos saludables en entornos urbanos. El objetivo es concienciar sobre cómo el diseño de nuestras ciudades impacta directamente en nuestro bienestar físico y mental.', settings: { textAlign: 'left' } },
        { id: '2', type: 'image', content: 'https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?q=80&w=1000&auto=format&fit=crop', settings: { width: '75%', caption: 'Voluntarios en acción', filter: 'none', textAlign: 'center' } },
        { id: '3', type: 'paragraph', content: 'Se realizarán talleres en centros cívicos y colegios durante todo el mes.', settings: { textAlign: 'left' } }
    ]
  },
  {
    id: 'b3',
    title: 'Beneficios del ejercicio al aire libre en la vejez',
    excerpt: 'Estudios confirman que caminar 30 minutos al día en entornos verdes reduce el riesgo de depresión.',
    author: 'Dra. Elena S.',
    date: getDate(5),
    imageUrl: 'https://images.unsplash.com/photo-1555819206-8b30df05581e?q=80&w=1000&auto=format&fit=crop',
    category: 'Salud',
    tags: ['Mayores', 'Deporte', 'Salud Mental'],
    blocks: [
        { id: '1', type: 'paragraph', content: 'El envejecimiento activo es clave. Mantenerse en movimiento no solo ayuda a las articulaciones, sino que socializar en parques y jardines combate la soledad no deseada.', settings: { textAlign: 'justify' } },
        { id: '2', type: 'quote', content: 'La naturaleza es el mejor gimnasio y la mejor terapia.', settings: { textAlign: 'center' } }
    ]
  }
];

export const MOCK_PROPOSALS: Proposal[] = [
  {
    id: 'p1',
    type: 'general',
    author: 'Ana Martínez',
    title: 'Más fuentes de agua potable en el Casco Antiguo',
    description: 'Es necesario instalar más puntos de hidratación para los meses de verano, especialmente para personas mayores y mascotas. Las olas de calor son cada vez más frecuentes.',
    votes: 145,
    status: ProposalStatus.Validated,
    date: getDate(12)
  },
  {
    id: 'p2',
    type: 'resource',
    author: 'Luis G.',
    title: 'Huertos Urbanos Comunitarios',
    description: 'Propongo usar solares abandonados en San Roque para crear huertos que fomenten la alimentación saludable y la vecindad.',
    votes: 89,
    status: ProposalStatus.InReview,
    date: getDate(28)
  },
  {
    id: 'p3',
    type: 'event',
    author: 'Club Senderista',
    title: 'Limpieza del Río Gévora',
    description: 'Jornada de voluntariado para limpiar la ribera del río y concienciar sobre los plásticos.',
    votes: 56,
    status: ProposalStatus.Pending,
    date: getDate(1),
    details: {
        location: 'Puente de Cantillana',
        date: getDate(5, nextMonth, nextMonthYear),
        startTime: '10:00'
    }
  }
];

export const COLORS = {
  primary: '#10b981', // Emerald 500
  secondary: '#3b82f6', // Blue 500
  accent: '#f59e0b', // Amber 500
  background: '#f9fafb'
};
