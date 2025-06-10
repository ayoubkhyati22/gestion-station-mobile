import { supabase } from '@/lib/supabase';
import type { Compteur, Vente, TicketTPE, Lavage } from '@/types';

export class SupabaseService {
  // Compteurs operations
  static async getCompteurs(date: string) {
    const { data, error } = await supabase
      .from('compteurs')
      .select('*')
      .eq('date', date)
      .order('pompe_numero');

    if (error) throw error;
    return data || [];
  }

  static async getLastCompteurs() {
    const { data, error } = await supabase
      .from('compteurs')
      .select('*')
      .order('date', { ascending: false })
      .order('pompe_numero')
      .limit(4);

    if (error) throw error;
    return data || [];
  }

  static async saveCompteurs(compteurs: Compteur[], date: string) {
    // Delete existing records for the date
    await supabase
      .from('compteurs')
      .delete()
      .eq('date', date);

    // Insert new records
    const compteursToSave = compteurs.map((compteur) => ({
      pompe_numero: compteur.pompe_numero,
      type: compteur.type,
      numero_precedent: compteur.numero_precedent,
      numero_actuel: compteur.numero_actuel,
      volume_vendu: compteur.volume_vendu,
      date,
    }));

    const { error } = await supabase
      .from('compteurs')
      .insert(compteursToSave);

    if (error) throw error;
  }

  // Ventes operations
  static async getVentes(date: string) {
    const { data, error } = await supabase
      .from('ventes')
      .select('*')
      .eq('date', date);

    if (error) throw error;
    return data || [];
  }

  static async saveVente(vente: Omit<Vente, 'id' | 'created_at' | 'user_id'>) {
    const { error } = await supabase
      .from('ventes')
      .insert(vente);

    if (error) throw error;
  }

  // TPE operations
  static async getTicketsTPE(date: string) {
    const { data, error } = await supabase
      .from('tickets_tpe')
      .select('*')
      .eq('date', date);

    if (error) throw error;
    return data || [];
  }

  static async saveTicketTPE(ticket: Omit<TicketTPE, 'id' | 'created_at' | 'user_id'>) {
    const { error } = await supabase
      .from('tickets_tpe')
      .insert(ticket);

    if (error) throw error;
  }

  // Lavage operations
  static async getLavages(date: string) {
    const { data, error } = await supabase
      .from('lavages')
      .select('*')
      .eq('date', date);

    if (error) throw error;
    return data || [];
  }

  static async saveLavage(lavage: Omit<Lavage, 'id' | 'created_at' | 'user_id'>) {
    const { error } = await supabase
      .from('lavages')
      .insert(lavage);

    if (error) throw error;
  }
}