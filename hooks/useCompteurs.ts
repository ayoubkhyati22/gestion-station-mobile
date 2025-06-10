import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { SupabaseService } from '@/services/supabase';
import type { Compteur } from '@/types';

const initialCompteurs: Compteur[] = [
  { pompe_numero: 1, type: 'essence', numero_precedent: 0, numero_actuel: 0, volume_vendu: 0 },
  { pompe_numero: 2, type: 'essence', numero_precedent: 0, numero_actuel: 0, volume_vendu: 0 },
  { pompe_numero: 3, type: 'gasoil', numero_precedent: 0, numero_actuel: 0, volume_vendu: 0 },
  { pompe_numero: 4, type: 'gasoil', numero_precedent: 0, numero_actuel: 0, volume_vendu: 0 },
];

export const useCompteurs = () => {
  const [compteurs, setCompteurs] = useState<Compteur[]>(initialCompteurs);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCompteurs();
  }, []);

  const loadCompteurs = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const data = await SupabaseService.getCompteurs(today);

      if (data && data.length > 0) {
        setCompteurs(data);
      } else {
        // Load last available compteurs to initialize
        const lastCompteurs = await SupabaseService.getLastCompteurs();

        if (lastCompteurs && lastCompteurs.length > 0) {
          const updatedCompteurs = initialCompteurs.map((compteur) => {
            const lastCompteur = lastCompteurs.find(
              (c) => c.pompe_numero === compteur.pompe_numero && c.type === compteur.type
            );
            return lastCompteur
              ? {
                  ...compteur,
                  numero_precedent: lastCompteur.numero_actuel,
                }
              : compteur;
          });
          setCompteurs(updatedCompteurs);
        }
      }
    } catch (error) {
      console.error('Error loading compteurs:', error);
    }
  };

  const updateCompteur = (index: number, field: keyof Compteur, value: string) => {
    const newCompteurs = [...compteurs];
    const numValue = parseFloat(value) || 0;
    
    newCompteurs[index] = {
      ...newCompteurs[index],
      [field]: numValue,
    };

    // Automatically calculate volume sold
    if (field === 'numero_precedent' || field === 'numero_actuel') {
      const compteur = newCompteurs[index];
      compteur.volume_vendu = Math.max(0, compteur.numero_actuel - compteur.numero_precedent);
    }

    setCompteurs(newCompteurs);
  };

  const saveCompteurs = async (t: (key: string) => string) => {
    setLoading(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      await SupabaseService.saveCompteurs(compteurs, today);
      Alert.alert(t('success'), t('metersSavedSuccess'));
    } catch (error: any) {
      Alert.alert(t('error'), error.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    compteurs,
    loading,
    updateCompteur,
    saveCompteurs,
  };
};