
export enum Category {
  Salud = 'Salud',
  Deporte = 'Deporte',
  Naturaleza = 'Naturaleza',
  Cultura = 'Cultura',
  Sostenibilidad = 'Sostenibilidad'
}

export enum ProposalStatus {
  Pending = 'Pendiente',
  Validated = 'Validada',
  Rejected = 'Rechazada',
  InReview = 'En Revisión'
}

export enum Role {
  Admin = 'Admin',
  Editor = 'Editor',
  Gestor = 'Gestor'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface AgendaEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  category: Category;
  organizer: string;
}

export interface Resource {
  id: string;
  name: string;
  type: string;
  address: string;
  description: string;
  lat: number;
  lng: number;
  tags: string[];
}

export interface Attachment {
  name: string;
  url: string;
  type: 'image' | 'file';
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  imageUrl: string;
  category: string;
  attachments?: Attachment[];
}

export interface Proposal {
  id: string;
  author: string;
  title: string;
  description: string;
  votes: number;
  status: ProposalStatus;
  date: string;
  aiSummary?: string;
}
