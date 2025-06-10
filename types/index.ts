// Core data types for the gas station management system
export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface Session {
  user: User;
  access_token: string;
  refresh_token: string;
}

export interface Compteur {
  id?: number;
  pompe_numero: number;
  type: 'essence' | 'gasoil';
  numero_precedent: number;
  numero_actuel: number;
  volume_vendu: number;
  date?: string;
  created_at?: string;
  user_id?: string;
}

export interface Vente {
  id?: number;
  type: 'essence' | 'gasoil';
  volume: number;
  prix_par_litre: number;
  total: number;
  date?: string;
  created_at?: string;
  user_id?: string;
}

export interface TicketTPE {
  id?: number;
  nom_client: string;
  montant: number;
  date?: string;
  created_at?: string;
  user_id?: string;
}

export interface Lavage {
  id?: number;
  montant: number;
  date?: string;
  created_at?: string;
  user_id?: string;
}

export interface DashboardStats {
  totalEssence: number;
  totalGasoil: number;
  totalTPE: number;
  totalLavage: number;
}

export interface RapportData {
  totalEssence: number;
  totalGasoil: number;
  totalTPE: number;
  totalLavage: number;
  ventesEssence: Vente[];
  ventesGasoil: Vente[];
  ticketsTPE: TicketTPE[];
  lavages: Lavage[];
  compteurs: Compteur[];
}

export interface LoadingStates {
  [key: string]: boolean;
}

export interface Language {
  code: string;
  name: string;
  flag: string;
}

export type FuelType = 'essence' | 'gasoil';
export type TabType = 'tpe' | 'lavage';