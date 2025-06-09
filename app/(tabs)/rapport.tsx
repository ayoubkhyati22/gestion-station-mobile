import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { supabase } from '@/lib/supabase';
import { useTranslation } from 'react-i18next';
import { 
  FileText, 
  TrendingUp, 
  Fuel, 
  Droplets, 
  CreditCard, 
  Car, 
  Calendar,
  RefreshCw
} from 'lucide-react-native';

interface RapportData {
  totalEssence: number;
  totalGasoil: number;
  totalTPE: number;
  totalLavage: number;
  ventesEssence: Array<{ volume: number; total: number; prix_par_litre: number }>;
  ventesGasoil: Array<{ volume: number; total: number; prix_par_litre: number }>;
  ticketsTPE: Array<{ nom_client: string; montant: number }>;
  lavages: Array<{ montant: number }>;
  compteurs: Array<{ pompe_numero: number; type: string; volume_vendu: number }>;
}

interface LoadingStates {
  essence: boolean;
  gasoil: boolean;
  tpe: boolean;
  lavage: boolean;
  compteurs: boolean;
}

// Composant de loader animé rapide
const FastLoaderDots = ({ color = '#2563EB' }: { color?: string }) => {
  const dot1Anim = new Animated.Value(0);
  const dot2Anim = new Animated.Value(0);
  const dot3Anim = new Animated.Value(0);

  useEffect(() => {
    const createFastAnimation = (animValue: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.timing(animValue, {
            toValue: 1,
            duration: 400, // Plus rapide: 400ms au lieu de 600ms
            delay,
            useNativeDriver: true,
          }),
          Animated.timing(animValue, {
            toValue: 0,
            duration: 400, // Plus rapide: 400ms au lieu de 600ms
            useNativeDriver: true,
          }),
        ])
      );
    };

    const animations = [
      createFastAnimation(dot1Anim, 0),
      createFastAnimation(dot2Anim, 130), // Délai réduit: 130ms au lieu de 200ms
      createFastAnimation(dot3Anim, 260), // Délai réduit: 260ms au lieu de 400ms
    ];

    animations.forEach(anim => anim.start());

    return () => {
      animations.forEach(anim => anim.stop());
    };
  }, []);

  const getDotStyle = (animValue: Animated.Value) => ({
    opacity: animValue,
    transform: [
      {
        scale: animValue.interpolate({
          inputRange: [0, 1],
          outputRange: [0.7, 1.3], // Plus de variation dans le scale
        }),
      },
    ],
  });

  return (
    <View style={styles.loaderContainer}>
      <Animated.View style={[styles.loaderDot, { backgroundColor: color }, getDotStyle(dot1Anim)]} />
      <Animated.View style={[styles.loaderDot, { backgroundColor: color }, getDotStyle(dot2Anim)]} />
      <Animated.View style={[styles.loaderDot, { backgroundColor: color }, getDotStyle(dot3Anim)]} />
    </View>
  );
};

// Composant de shimmer rapide pour le texte
const FastShimmerText = ({ width = 80, height = 20 }: { width?: number; height?: number }) => {
  const shimmerAnim = new Animated.Value(0);

  useEffect(() => {
    const fastShimmerAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 700, // Plus rapide: 700ms au lieu de 1000ms
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 700, // Plus rapide: 700ms au lieu de 1000ms
          useNativeDriver: true,
        }),
      ])
    );

    fastShimmerAnimation.start();
    return () => fastShimmerAnimation.stop();
  }, []);

  const opacity = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.2, 0.8], // Plus de contraste
  });

  return (
    <Animated.View 
      style={[
        styles.shimmerPlaceholder,
        { width, height, opacity }
      ]} 
    />
  );
};

// Loader pour les sections de détails
const DetailSectionLoader = () => {
  return (
    <View style={styles.detailSection}>
      <FastShimmerText width={150} height={16} />
      <View style={styles.detailLoaderContainer}>
        {[1, 2, 3].map((item) => (
          <View key={item} style={styles.detailItem}>
            <FastShimmerText width={120} height={14} />
            <FastShimmerText width={60} height={14} />
          </View>
        ))}
      </View>
    </View>
  );
};

export default function RapportScreen() {
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
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const { t } = useTranslation();

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

      // Charger les ventes avec gestion individuelle du loading
      const ventesPromise = supabase
        .from('ventes')
        .select('type, volume, total, prix_par_litre')
        .eq('date', selectedDate)
        .then(({ data: ventes }) => {
          const ventesEssence = ventes?.filter(v => v.type === 'essence') || [];
          const ventesGasoil = ventes?.filter(v => v.type === 'gasoil') || [];
          
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

      // Charger les tickets TPE
      const tpePromise = supabase
        .from('tickets_tpe')
        .select('nom_client, montant')
        .eq('date', selectedDate)
        .then(({ data: tpe }) => {
          const totalTPE = tpe?.reduce((sum, t) => sum + t.montant, 0) || 0;
          
          setRapport(prev => ({
            ...prev,
            totalTPE,
            ticketsTPE: tpe || [],
          }));

          setLoading(prev => ({
            ...prev,
            tpe: false,
          }));
        });

      // Charger les lavages
      const lavagePromise = supabase
        .from('lavages')
        .select('montant')
        .eq('date', selectedDate)
        .then(({ data: lavages }) => {
          const totalLavage = lavages?.reduce((sum, l) => sum + l.montant, 0) || 0;
          
          setRapport(prev => ({
            ...prev,
            totalLavage,
            lavages: lavages || [],
          }));

          setLoading(prev => ({
            ...prev,
            lavage: false,
          }));
        });

      // Charger les compteurs
      const compteursPromise = supabase
        .from('compteurs')
        .select('pompe_numero, type, volume_vendu')
        .eq('date', selectedDate)
        .then(({ data: compteurs }) => {
          setRapport(prev => ({
            ...prev,
            compteurs: compteurs || [],
          }));

          setLoading(prev => ({
            ...prev,
            compteurs: false,
          }));
        });

      // Exécuter toutes les promesses
      await Promise.all([ventesPromise, tpePromise, lavagePromise, compteursPromise]);

    } catch (error) {
      console.error('Erreur lors du chargement du rapport:', error);
      // En cas d'erreur, arrêter tous les loaders
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

  // Calculer le total seulement si les données principales sont chargées
  const mainDataLoaded = !loading.essence && !loading.gasoil && !loading.tpe && !loading.lavage;
  const totalGeneral = mainDataLoaded ? rapport.totalEssence + rapport.totalGasoil + rapport.totalTPE + rapport.totalLavage : 0;

  const StatCard = ({ 
    title, 
    value, 
    icon, 
    color,
    details,
    isLoading 
  }: { 
    title: string; 
    value: number; 
    icon: React.ReactNode; 
    color: string;
    details?: string;
    isLoading: boolean;
  }) => (
    <View style={styles.statCard}>
      <View style={[styles.statIcon, { backgroundColor: color + '20' }]}>
        {icon}
      </View>
      <View style={styles.statContent}>
        {isLoading ? (
          <>
            <FastLoaderDots color={color} />
            <FastShimmerText width={60} height={14} />
            <FastShimmerText width={80} height={12} />
          </>
        ) : (
          <>
            <Text style={styles.statValue}>{value.toFixed(2)} {t('dh')}</Text>
            <Text style={styles.statTitle}>{title}</Text>
            {details && <Text style={styles.statDetails}>{details}</Text>}
          </>
        )}
      </View>
    </View>
  );

  const DetailSection = ({ 
    title, 
    children,
    isLoading = false
  }: { 
    title: string; 
    children: React.ReactNode;
    isLoading?: boolean;
  }) => {
    if (isLoading) {
      return <DetailSectionLoader />;
    }

    return (
      <View style={styles.detailSection}>
        <Text style={styles.detailSectionTitle}>{title}</Text>
        {children}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerInfo}>
          <FileText size={24} color="#2563EB" />
          <Text style={styles.headerTitle}>{t('dailyReport')}</Text>
        </View>
        <TouchableOpacity onPress={onRefresh} style={styles.refreshButton}>
          <RefreshCw size={20} color="#2563EB" />
        </TouchableOpacity>
      </View>

      <View style={styles.dateContainer}>
        <Calendar size={16} color="#6B7280" />
        <Text style={styles.dateText}>{selectedDate}</Text>
      </View>

      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Résumé financier */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <TrendingUp size={20} color="#2563EB" />
            <Text style={styles.sectionTitle}>{t('financialSummary')}</Text>
          </View>
          
          <View style={styles.statsContainer}>
            <StatCard
              title={t('essence')}
              value={rapport.totalEssence}
              icon={<Fuel size={20} color="#EF4444" />}
              color="#EF4444"
              details={`${rapport.ventesEssence.length} ${t('sales')}`}
              isLoading={loading.essence}
            />
            <StatCard
              title={t('gasoil')}
              value={rapport.totalGasoil}
              icon={<Droplets size={20} color="#059669" />}
              color="#059669"
              details={`${rapport.ventesGasoil.length} ${t('sales')}`}
              isLoading={loading.gasoil}
            />
            <StatCard
              title={t('tpe')}
              value={rapport.totalTPE}
              icon={<CreditCard size={20} color="#7C3AED" />}
              color="#7C3AED"
              details={`${rapport.ticketsTPE.length} ${t('tickets')}`}
              isLoading={loading.tpe}
            />
            <StatCard
              title={t('lavage')}
              value={rapport.totalLavage}
              icon={<Car size={20} color="#0891B2" />}
              color="#0891B2"
              details={`${rapport.lavages.length} ${t('washes')}`}
              isLoading={loading.lavage}
            />
          </View>

          <View style={styles.totalCard}>
            <Text style={styles.totalLabel}>{t('generalTotal')}</Text>
            {mainDataLoaded ? (
              <Text style={styles.totalValue}>{totalGeneral.toFixed(2)} {t('dh')}</Text>
            ) : (
              <FastLoaderDots color="#BFDBFE" />
            )}
          </View>
        </View>

        {/* Détails des ventes d'essence */}
        {loading.essence ? (
          <DetailSectionLoader />
        ) : rapport.ventesEssence.length > 0 ? (
          <DetailSection title={t('gasolineSalesDetail')}>
            {rapport.ventesEssence.map((vente, index) => (
              <View key={index} style={styles.detailItem}>
                <Text style={styles.detailText}>
                  {vente.volume}{t('liters')} × {vente.prix_par_litre}{t('dh')}/{t('liters')}
                </Text>
                <Text style={styles.detailValue}>{vente.total.toFixed(2)} {t('dh')}</Text>
              </View>
            ))}
          </DetailSection>
        ) : null}

        {/* Détails des ventes de gasoil */}
        {loading.gasoil ? (
          <DetailSectionLoader />
        ) : rapport.ventesGasoil.length > 0 ? (
          <DetailSection title={t('dieselSalesDetail')}>
            {rapport.ventesGasoil.map((vente, index) => (
              <View key={index} style={styles.detailItem}>
                <Text style={styles.detailText}>
                  {vente.volume}{t('liters')} × {vente.prix_par_litre}{t('dh')}/{t('liters')}
                </Text>
                <Text style={styles.detailValue}>{vente.total.toFixed(2)} {t('dh')}</Text>
              </View>
            ))}
          </DetailSection>
        ) : null}

        {/* Détails des tickets TPE */}
        {loading.tpe ? (
          <DetailSectionLoader />
        ) : rapport.ticketsTPE.length > 0 ? (
          <DetailSection title={t('posTicketsDetail')}>
            {rapport.ticketsTPE.map((ticket, index) => (
              <View key={index} style={styles.detailItem}>
                <Text style={styles.detailText}>{ticket.nom_client}</Text>
                <Text style={styles.detailValue}>{ticket.montant.toFixed(2)} {t('dh')}</Text>
              </View>
            ))}
          </DetailSection>
        ) : null}

        {/* Volumes vendus (compteurs) */}
        {loading.compteurs ? (
          <DetailSectionLoader />
        ) : rapport.compteurs.length > 0 ? (
          <DetailSection title={t('volumesSoldMeters')}>
            {rapport.compteurs.map((compteur, index) => (
              <View key={index} style={styles.detailItem}>
                <Text style={styles.detailText}>
                  {t('pump')} {compteur.pompe_numero} - {t(compteur.type)}
                </Text>
                <Text style={styles.detailValue}>{compteur.volume_vendu.toFixed(2)} {t('liters')}</Text>
              </View>
            ))}
          </DetailSection>
        ) : null}

        {/* Espacement en bas */}
        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
    paddingTop: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1E293B',
  },
  refreshButton: {
    padding: 8,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingBottom: 16,
    gap: 8,
  },
  dateText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
  },
  statsContainer: {
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 8,
    gap: 12,
    minHeight: 80, // Hauteur fixe pour éviter les sauts
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statContent: {
    flex: 1,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
  },
  statTitle: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 2,
  },
  statDetails: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },
  totalCard: {
    backgroundColor: '#2563EB',
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
    minHeight: 80, // Hauteur fixe pour le total
  },
  totalLabel: {
    fontSize: 14,
    color: '#BFDBFE',
    marginBottom: 4,
  },
  totalValue: {
    fontSize: 24,
    fontWeight: '700',
    color: 'white',
  },
  detailSection: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  detailSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  detailText: {
    fontSize: 14,
    color: '#374151',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
  },
  // Nouveaux styles pour les loaders rapides
  loaderContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start', // Aligné à gauche dans le rapport
    alignItems: 'center',
    gap: 3,
    marginVertical: 6,
  },
  loaderDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  shimmerPlaceholder: {
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    marginTop: 2,
  },
  detailLoaderContainer: {
    marginTop: 12,
  },
});