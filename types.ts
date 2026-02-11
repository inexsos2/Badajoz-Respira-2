
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
  startTime: string; 
  endTime?: string;  
  location: string;
  description: string;
  category: Category;
  organizer: string;
  email?: string;    
  phone?: string;    
  image?: File | string; 
  lat?: number;      
  lng?: number;      
}

export interface Resource {
  id: string;
  name: string;
  category: Category; 
  address: string;
  description: string;
  lat: number;
  lng: number;
  tags: string[];
  email?: string;    
  phone?: string;    
  image?: File | string; 
}

export interface Attachment {
  name: string;
  url: string;
  type: 'image' | 'file';
}

export type BlockType = 'paragraph' | 'header' | 'image' | 'quote';

export interface BlockSettings {
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  width?: '25%' | '50%' | '75%' | '100%';
  filter?: 'none' | 'grayscale' | 'sepia' | 'blur'; // Added image filters
  caption?: string;
}

export interface ContentBlock {
  id: string;
  type: BlockType;
  content: string; // Text content or Image URL
  file?: File; // For new uploads
  settings?: BlockSettings;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  imageUrl: string; // Cover image URL
  category: string;
  tags: string[];
  blocks: ContentBlock[]; // Structured content
  attachments?: Attachment[]; // Legacy or sidebar attachments
}

export type ProposalType = 'general' | 'event' | 'resource';

export interface Proposal {
  id: string;
  type: ProposalType;
  author: string;
  title: string;
  description: string;
  votes: number;
  status: ProposalStatus;
  date: string;
  aiSummary?: string;
  details?: any; // Stores the JSON data for the Event or Resource form
}
