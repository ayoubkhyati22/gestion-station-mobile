import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { SupabaseService } from '@/services/supabase';
import { PDFService } from '@/services/pdfService';
import type { RapportData, LoadingStates } from '@/types';

export const useRapport = (selectedDate: string) => {
  const [rapport, setRapport] = useState<RapportData>({
    totalEssence: 0,
    totalGasoil: 0,
    totalTPE: 0,
    totalLavage: 0,
    ventesEssence: [],
    ventesGasoil: [],
    ticketsTPE: [],
    lavages: [],
    compteurs: [],
  });

  const [loading, setLoading] = useState<LoadingStates>({
    essence: true,
    gasoil: true,
    tpe: true,
    lavage: true,
    compteurs: true,
  });

  const [refreshing, setRefreshing] = useState(false);
  const [downloadingPDF, setDownloadingPDF] = useState(false);

  const loadRapportData = async () => {
    try {
      // Reset loading states when refreshing
      if (refreshing) {
        setLoading({
          essence: true,
          gasoil: true,
          tpe: true,
          lavage: true,
          compteurs: true,
        });
      }

      // Load sales data
      const ventesPromise = SupabaseService.getVentes(selectedDate).then((ventes) => {
        const ventesEssence = ventes.filter(v => v.type === 'essence');
        const ventesGasoil = ventes.filter(v => v.type === 'gasoil');
        
        const totalEssence = ventesEssence.reduce((sum, v) => sum + v.total, 0);
        const totalGasoil = ventesGasoil.reduce((sum, v) => sum + v.total, 0);

        setRapport(prev => ({
          ...prev,
          totalEssence,
          totalGasoil,
          ventesEssence,
          ventesGasoil,
        }));

        setLoading(prev => ({
          ...prev,
          essence: false,
          gasoil: false,
        }));
      });

      // Load TPE data
      const tpePromise = SupabaseService.getTicketsTPE(selectedDate).then((tpe) => {
        const totalTPE = tpe.reduce((sum, t) => sum + t.montant, 0);
        
        setRapport(prev => ({
          ...prev,
          totalTPE,
          ticketsTPE: tpe,
        }));

        setLoading(prev => ({
          ...prev,
          tpe: false,
        }));
      });

      // Load wash data
      const lavagePromise = SupabaseService.getLavages(selectedDate).then((lavages) => {
        const totalLavage = lavages.reduce((sum, l) => sum + l.montant, 0);
        
        setRapport(prev => ({
          ...prev,
          totalLavage,
          lavages,
        }));

        setLoading(prev => ({
          ...prev,
          lavage: false,
        }));
      });

      // Load compteurs data
      const compteursPromise = SupabaseService.getCompteurs(selectedDate).then((compteurs) => {
        setRapport(prev => ({
          ...prev,
          compteurs,
        }));

        setLoading(prev => ({
          ...prev,
          compteurs: false,
        }));
      });

      // Execute all promises
      await Promise.all([ventesPromise, tpePromise, lavagePromise, compteursPromise]);

    } catch (error) {
      console.error('Error loading report data:', error);
      // Stop all loaders on error
      setLoading({
        essence: false,
        gasoil: false,
        tpe: false,
        lavage: false,
        compteurs: false,
      });
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadRapportData();
  }, [selectedDate]);

  const onRefresh = () => {
    setRefreshing(true);
    loadRapportData();
  };

  const downloadPDF = async (t: (key: string) => string) => {
    try {
      setDownloadingPDF(true);
      await PDFService.generateAndSharePDF(rapport, selectedDate, t);
    } catch (error) {
      console.error('PDF generation error:', error);
      Alert.alert(
        t('error'),
        t('pdfGenerationError') || 'Erreur lors de la génération du PDF'
      );
    } finally {
      setDownloadingPDF(false);
    }
  };

  const mainDataLoaded = !loading.essence && !loading.gasoil && !loading.tpe && !loading.lavage;
  const totalGeneral = mainDataLoaded ? rapport.totalEssence + rapport.totalGasoil + rapport.totalTPE + rapport.totalLavage : 0;

  return {
    rapport,
    loading,
    refreshing,
    downloadingPDF,
    onRefresh,
    downloadPDF,
    mainDataLoaded,
    totalGeneral,
  };
};