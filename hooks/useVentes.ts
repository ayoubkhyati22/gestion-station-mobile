import { useState } from 'react';
import { Alert } from 'react-native';
import { SupabaseService } from '@/services/supabase';
import type { FuelType } from '@/types';

export const useVentes = () => {
  const [type, setType] = useState<FuelType>('essence');
  const [volume, setVolume] = useState('');
  const [prixParLitre, setPrixParLitre] = useState('');
  const [loading, setLoading] = useState(false);

  const total = (parseFloat(volume) || 0) * (parseFloat(prixParLitre) || 0);

  const handleSaveVente = async (t: (key: string) => string) => {
    if (!volume || !prixParLitre) {
      Alert.alert(t('error'), t('fillAllFields'));
      return;
    }

    setLoading(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      
      await SupabaseService.saveVente({
        type,
        volume: parseFloat(volume),
        prix_par_litre: parseFloat(prixParLitre),
        total,
        date: today,
      });

      Alert.alert(t('success'), t('saleSavedSuccess'));
      
      // Reset form
      setVolume('');
      setPrixParLitre('');
      setType('essence');
    } catch (error: any) {
      Alert.alert(t('error'), error.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    type,
    setType,
    volume,
    setVolume,
    prixParLitre,
    setPrixParLitre,
    loading,
    total,
    handleSaveVente,
  };
};