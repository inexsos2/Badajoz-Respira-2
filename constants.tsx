
import React from 'react';
import { Category, AgendaEvent, Resource, BlogPost, Proposal, ProposalStatus, User, Role } from './types';

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
    date: '2024-05-20',
    time: '09:00',
    location: 'Puente de Palmas',
    description: 'Caminata guiada para conocer la flora local y mejorar la salud cardiovascular.',
    category: Category.Deporte,
    organizer: 'Farmamundi'
  },
  {
    id: '2',
    title: 'Taller de Yoga al Aire Libre',
    date: '2024-05-22',
    time: '18:30',
    location: 'Parque de Castelar',
    description: 'Sesión de relajación y respiración profunda en un entorno natural.',
    category: Category.Salud,
    organizer: 'Badajoz Respira'
  }
];

export const MOCK_RESOURCES: Resource[] = [
  {
    id: 'r1',
    name: 'Parque del Guadiana',
    type: 'Espacio Natural',
    address: 'Ribera del Guadiana',
    description: 'Pulmón verde de la ciudad con amplias zonas para correr y caminar.',
    lat: 38.882,
    lng: -6.979,
    tags: ['Aire Puro', 'Running', 'Familia']
  },
  {
    id: 'r2',
    name: 'Farmacia 24h Centro',
    type: 'Servicio Salud',
    address: 'Calle Menacho, 12',
    description: 'Servicio farmacéutico permanente en el corazón de Badajoz.',
    lat: 38.878,
    lng: -6.970,
    tags: ['Emergencias', 'Salud']
  },
  {
    id: 'r3',
    name: 'Huerto Urbano Suerte de Saavedra',
    type: 'Sostenibilidad',
    address: 'Calle Antonio Hernández Gil',
    description: 'Espacio comunitario de cultivo ecológico y aprendizaje.',
    lat: 38.865,
    lng: -6.955,
    tags: ['Naturaleza', 'Comunidad']
  },
  {
    id: 'r4',
    name: 'Polideportivo La Granadilla',
    type: 'Deporte',
    address: 'Av. del Perú',
    description: 'Instalaciones completas para natación, tenis y atletismo.',
    lat: 38.868,
    lng: -6.995,
    tags: ['Deporte', 'Salud']
  },
  {
    id: 'r5',
    name: 'Punto Limpio El Nevero',
    type: 'Reciclaje',
    address: 'Polígono Ind. El Nevero',
    description: 'Centro de recogida selectiva de residuos domésticos.',
    lat: 38.895,
    lng: -6.990,
    tags: ['Sostenibilidad', 'Reciclaje']
  }
];

export const MOCK_BLOG: BlogPost[] = [
  {
    id: 'b1',
    title: 'La calidad del aire en Badajoz mejora un 15%',
    excerpt: 'Los últimos datos muestran una tendencia positiva gracias a la peatonalización...',
    author: 'Redacción Badajoz Respira',
    date: '2024-05-15',
    imageUrl: 'https://picsum.photos/seed/badajoz1/800/400',
    category: 'Medio Ambiente',
    tags: ['Aire', 'Salud', 'Urbanismo'],
    blocks: [
        { id: '1', type: 'header', content: 'Resultados del estudio anual' },
        { id: '2', type: 'paragraph', content: 'Gracias a las nuevas medidas de peatonalización en el centro histórico, los niveles de NO2 han descendido significativamente.' }
    ]
  },
  {
    id: 'b2',
    title: 'Farmamundi lanza nueva campaña de sensibilización',
    excerpt: 'Enfocada en el derecho a la salud en entornos urbanos.',
    author: 'Comunicación Farmamundi',
    date: '2024-05-10',
    imageUrl: 'https://picsum.photos/seed/badajoz2/800/400',
    category: 'Comunidad',
    tags: ['ONG', 'Campaña', 'Derechos'],
    blocks: [
        { id: '1', type: 'paragraph', content: 'Farmamundi inicia hoy su campaña para promover hábitos saludables en entornos urbanos.' }
    ]
  }
];

export const MOCK_PROPOSALS: Proposal[] = [
  {
    id: 'p1',
    author: 'Ana Martínez',
    title: 'Más fuentes de agua potable en el Casco Antiguo',
    description: 'Es necesario instalar más puntos de hidratación para los meses de verano, especialmente para personas mayores.',
    votes: 145,
    status: ProposalStatus.Validated,
    date: '2024-04-12'
  },
  {
    id: 'p2',
    author: 'Luis G.',
    title: 'Huertos Urbanos Comunitarios',
    description: 'Propongo usar solares abandonados para crear huertos que fomenten la alimentación saludable.',
    votes: 89,
    status: ProposalStatus.InReview,
    date: '2024-04-28'
  }
];

export const COLORS = {
  primary: '#10b981', // Emerald 500
  secondary: '#3b82f6', // Blue 500
  accent: '#f59e0b', // Amber 500
  background: '#f9fafb'
};
