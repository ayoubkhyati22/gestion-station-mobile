import { useState, useEffect } from 'react';
import { SupabaseService } from '@/services/supabase';
import type { DashboardStats, LoadingStates } from '@/types';

export const useDashboardData = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalEssence: 0,
    totalGasoil: 0,
    totalTPE: 0,
    totalLavage: 0,
  });

  const [loading, setLoading] = useState<LoadingStates>({
    essence: true,
    gasoil: true,
    tpe: true,
    lavage: true,
  });

  const [refreshing, setRefreshing] = useState(false);

  const loadDashboardData = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];

      // Reset loading states when refreshing
      if (refreshing) {
        setLoading({
          essence: true,
          gasoil: true,
          tpe: true,
          lavage: true,
        });
      }

      // Load sales data
      const ventesPromise = SupabaseService.getVentes(today).then((ventes) => {
        let totalEssence = 0;
        let totalGasoil = 0;

        ventes.forEach((vente) => {
          if (vente.type === 'essence') {
            totalEssence += vente.total;
          } else {
            totalGasoil += vente.total;
          }
        });

        setStats(prev => ({
          ...prev,
          totalEssence,
          totalGasoil,
        }));

        setLoading(prev => ({
          ...prev,
          essence: false,
          gasoil: false,
        }));
      });

      // Load TPE data
      const tpePromise = SupabaseService.getTicketsTPE(today).then((tpe) => {
        const totalTPE = tpe.reduce((sum, ticket) => sum + ticket.montant, 0);
        
        setStats(prev => ({
          ...prev,
          totalTPE,
        }));

        setLoading(prev => ({
          ...prev,
          tpe: false,
        }));
      });

      // Load wash data
      const lavagePromise = SupabaseService.getLavages(today).then((lavages) => {
        const totalLavage = lavages.reduce((sum, lavage) => sum + lavage.montant, 0);
        
        setStats(prev => ({
          ...prev,
          totalLavage,
        }));

        setLoading(prev => ({
          ...prev,
          lavage: false,
        }));
      });

      // Execute all promises
      await Promise.all([ventesPromise, tpePromise, lavagePromise]);

    } catch (error) {
      console.error('Error loading dashboard data:', error);
      // Stop all loaders on error
      setLoading({
        essence: false,
        gasoil: false,
        tpe: false,
        lavage: false,
      });
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadDashboardData();
  };

  const allDataLoaded = !Object.values(loading).some(isLoading => isLoading);
  const totalJour = allDataLoaded ? stats.totalEssence + stats.totalGasoil + stats.totalTPE + stats.totalLavage : 0;

  return {
    stats,
    loading,
    refreshing,
    onRefresh,
    allDataLoaded,
    totalJour,
  };
};