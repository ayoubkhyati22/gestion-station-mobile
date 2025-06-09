import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cvzigduqgvciwgznfkoz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN2emlnZHVxZ3ZjaXdnem5ma296Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk0NTM1ODgsImV4cCI6MjA2NTAyOTU4OH0.sKE3XJS-8kVG5UVfz-GRVc-IoPsBL0uwp9vGs1Fnvr4';

export const supabase = createClient(supabaseUrl, supabaseKey);

export type Database = {
  public: {
    Tables: {
      compteurs: {
        Row: {
          id: number;
          pompe_numero: number;
          type: 'essence' | 'gasoil';
          numero_precedent: number;
          numero_actuel: number;
          volume_vendu: number;
          date: string;
          created_at: string;
          user_id: string;
        };
        Insert: {
          pompe_numero: number;
          type: 'essence' | 'gasoil';
          numero_precedent: number;
          numero_actuel: number;
          volume_vendu: number;
          date?: string;
          user_id?: string;
        };
        Update: {
          pompe_numero?: number;
          type?: 'essence' | 'gasoil';
          numero_precedent?: number;
          numero_actuel?: number;
          volume_vendu?: number;
          date?: string;
        };
      };
      ventes: {
        Row: {
          id: number;
          type: 'essence' | 'gasoil';
          volume: number;
          prix_par_litre: number;
          total: number;
          date: string;
          created_at: string;
          user_id: string;
        };
        Insert: {
          type: 'essence' | 'gasoil';
          volume: number;
          prix_par_litre: number;
          total: number;
          date?: string;
          user_id?: string;
        };
        Update: {
          type?: 'essence' | 'gasoil';
          volume?: number;
          prix_par_litre?: number;
          total?: number;
          date?: string;
        };
      };
      tickets_tpe: {
        Row: {
          id: number;
          nom_client: string;
          montant: number;
          date: string;
          created_at: string;
          user_id: string;
        };
        Insert: {
          nom_client: string;
          montant: number;
          date?: string;
          user_id?: string;
        };
        Update: {
          nom_client?: string;
          montant?: number;
          date?: string;
        };
      };
      lavages: {
        Row: {
          id: number;
          montant: number;
          date: string;
          created_at: string;
          user_id: string;
        };
        Insert: {
          montant: number;
          date?: string;
          user_id?: string;
        };
        Update: {
          montant?: number;
          date?: string;
        };
      };
    };
  };
};