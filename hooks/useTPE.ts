import { useState } from 'react';
import { Alert } from 'react-native';
import { SupabaseService } from '@/services/supabase';
import type { TabType } from '@/types';

export const useTPE = () => {
  const [nomClient, setNomClient] = useState('');
  const [montant, setMontant] = useState('');
  const [montantLavage, setMontantLavage] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('tpe');

  const handleSaveTPE = async (t: (key: string) => string) => {
    if (!nomClient || !montant) {
      Alert.alert(t('error'), t('fillAllFields'));
      return;
    }

    setLoading(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      
      await SupabaseService.saveTicketTPE({
        nom_client: nomClient,
        montant: parseFloat(montant),
        date: today,
      });

      Alert.alert(t('success'), t('posTicketSavedSuccess'));
      
      // Reset form
      setNomClient('');
      setMontant('');
    } catch (error: any) {
      Alert.alert(t('error'), error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveLavage = async (t: (key: string) => string) => {
    if (!montantLavage) {
      Alert.alert(t('error'), t('enterAmount'));
      return;
    }

    setLoading(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      
      await SupabaseService.saveLavage({
        montant: parseFloat(montantLavage),
        date: today,
      });

      Alert.alert(t('success'), t('washSavedSuccess'));
      
      // Reset form
      setMontantLavage('');
    } catch (error: any) {
      Alert.alert(t('error'), error.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    nomClient,
    setNomClient,
    montant,
    setMontant,
    montantLavage,
    setMontantLavage,
    loading,
    activeTab,
    setActiveTab,
    handleSaveTPE,
    handleSaveLavage,
  };
};