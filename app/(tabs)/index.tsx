import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Modal,
  Pressable,
  Animated,
} from 'react-native';
import { router } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from 'react-i18next';
import {
  Fuel,
  Droplets,
  CreditCard,
  Car,
  Settings,
  LogOut,
  Plus,
  TrendingUp,
  Globe,
  ChevronDown,
  Check,
} from 'lucide-react-native';
import { Image } from 'react-native';

interface DashboardStats {
  totalEssence: number;
  totalGasoil: number;
  totalTPE: number;
  totalLavage: number;
}

interface LoadingStates {
  essence: boolean;
  gasoil: boolean;
  tpe: boolean;
  lavage: boolean;
}

// Composant de loader animé
const LoaderDots = ({ color = '#2563EB' }: { color?: string }) => {
  const dot1Anim = new Animated.Value(0);
  const dot2Anim = new Animated.Value(0);
  const dot3Anim = new Animated.Value(0);

  useEffect(() => {
    const createAnimation = (animValue: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.timing(animValue, {
            toValue: 1,
            duration: 300,
            delay,
            useNativeDriver: true,
          }),
          Animated.timing(animValue, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ])
      );
    };

    const animations = [
      createAnimation(dot1Anim, 0),
      createAnimation(dot2Anim, 100),
      createAnimation(dot3Anim, 300),
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
          outputRange: [0.8, 1.2],
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

// Composant de shimmer pour le texte
const ShimmerText = ({ width = 80, height = 20 }: { width?: number; height?: number }) => {
  const shimmerAnim = new Animated.Value(0);

  useEffect(() => {
    const shimmerAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );

    shimmerAnimation.start();
    return () => shimmerAnimation.stop();
  }, []);

  const opacity = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
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

export default function DashboardScreen() {
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
  const [languageDropdownVisible, setLanguageDropdownVisible] = useState(false);

  const { signOut, user } = useAuth();
  const { currentLanguage, changeLanguage, availableLanguages } = useLanguage();
  const { t } = useTranslation();

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

      // Charger les ventes du jour avec gestion individuelle du loading
      const ventesPromise = supabase
        .from('ventes')
        .select('type, total')
        .eq('date', today)
        .then(({ data: ventes }) => {
          let totalEssence = 0;
          let totalGasoil = 0;

          ventes?.forEach((vente) => {
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

      // Charger les tickets TPE du jour
      const tpePromise = supabase
        .from('tickets_tpe')
        .select('montant')
        .eq('date', today)
        .then(({ data: tpe }) => {
          const totalTPE = tpe?.reduce((sum, ticket) => sum + ticket.montant, 0) || 0;
          
          setStats(prev => ({
            ...prev,
            totalTPE,
          }));

          setLoading(prev => ({
            ...prev,
            tpe: false,
          }));
        });

      // Charger les lavages du jour
      const lavagePromise = supabase
        .from('lavages')
        .select('montant')
        .eq('date', today)
        .then(({ data: lavages }) => {
          const totalLavage = lavages?.reduce((sum, lavage) => sum + lavage.montant, 0) || 0;
          
          setStats(prev => ({
            ...prev,
            totalLavage,
          }));

          setLoading(prev => ({
            ...prev,
            lavage: false,
          }));
        });

      // Exécuter toutes les promesses
      await Promise.all([ventesPromise, tpePromise, lavagePromise]);

    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      // En cas d'erreur, arrêter tous les loaders
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

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace('/login');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  const handleLanguageSelect = async (languageCode: string) => {
    await changeLanguage(languageCode);
    setLanguageDropdownVisible(false);
  };

  const currentLanguageData = availableLanguages.find(lang => lang.code === currentLanguage);
  
  // Calculer le total seulement si toutes les données sont chargées
  const allDataLoaded = !Object.values(loading).some(isLoading => isLoading);
  const totalJour = allDataLoaded ? stats.totalEssence + stats.totalGasoil + stats.totalTPE + stats.totalLavage : 0;

  const StatCard = ({
    title,
    value,
    icon,
    color,
    isLoading
  }: {
    title: string;
    value: number;
    icon: React.ReactNode;
    color: string;
    isLoading: boolean;
  }) => (
    <View style={styles.statCard}>
      <View style={[styles.statIcon, { backgroundColor: color + '20' }]}>
        {icon}
      </View>
      
      {isLoading ? (
        <>
          <LoaderDots color={color} />
          <ShimmerText width={60} height={14} />
        </>
      ) : (
        <>
          <Text style={styles.statValue}>{value.toFixed(2)} {t('dh')}</Text>
          <Text style={styles.statTitle}>{title}</Text>
        </>
      )}
    </View>
  );

  const ActionButton = ({
    title,
    icon,
    onPress,
    color = '#2563EB'
  }: {
    title: string;
    icon: React.ReactNode;
    onPress: () => void;
    color?: string;
  }) => (
    <TouchableOpacity style={styles.actionButton} onPress={onPress}>
      <View style={[styles.actionIcon, { backgroundColor: color + '20' }]}>
        {React.cloneElement(icon as React.ReactElement, { size: 24, color })}
      </View>
      <Text style={styles.actionTitle}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header fixe */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.headerTitle}>{t('dashboard')}</Text>
            <Text style={styles.headerSubtitle}>
              {t('welcome')}, {user?.email?.split('@')[0]}
            </Text>
          </View>

          {/* Boutons d'action dans le header */}
          <View style={styles.headerActions}>
            {/* Bouton dropdown de langue */}
            <TouchableOpacity
              onPress={() => setLanguageDropdownVisible(true)}
              style={styles.languageButton}
            >
              <Globe size={18} color="#2563EB" />
              <Text style={styles.languageText}>
                {currentLanguageData?.flag}
              </Text>
              <ChevronDown size={16} color="#2563EB" />
            </TouchableOpacity>

            {/* Bouton de déconnexion */}
            <TouchableOpacity onPress={handleSignOut} style={styles.logoutButton}>
              <LogOut size={20} color="#EF4444" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Contenu scrollable */}
      <ScrollView
        style={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Résumé du jour */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <TrendingUp size={20} color="#2563EB" />
            <Text style={styles.sectionTitle}>{t('dailySummary')}</Text>
            <Image
              source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/c/c8/Afriquia-smdc-175639.png' }}
              style={styles.sectionHeaderImage}
              resizeMode="contain"
            />
          </View>

          <View style={styles.statsGrid}>
            <StatCard
              title={t('essence')}
              value={stats.totalEssence}
              icon={<Fuel size={24} color="#EF4444" />}
              color="#EF4444"
              isLoading={loading.essence}
            />
            <StatCard
              title={t('gasoil')}
              value={stats.totalGasoil}
              icon={<Droplets size={24} color="#059669" />}
              color="#059669"
              isLoading={loading.gasoil}
            />
            <StatCard
              title={t('tpe')}
              value={stats.totalTPE}
              icon={<CreditCard size={24} color="#7C3AED" />}
              color="#7C3AED"
              isLoading={loading.tpe}
            />
            <StatCard
              title={t('lavage')}
              value={stats.totalLavage}
              icon={<Car size={24} color="#0891B2" />}
              color="#0891B2"
              isLoading={loading.lavage}
            />
          </View>

          <View style={styles.totalCard}>
            <Text style={styles.totalLabel}>{t('totalDay')}</Text>
            {allDataLoaded ? (
              <Text style={styles.totalValue}>{totalJour.toFixed(2)} {t('dh')}</Text>
            ) : (
              <LoaderDots color="#BFDBFE" />
            )}
          </View>
        </View>

        {/* Actions rapides */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('quickActions')}</Text>

          <View style={styles.actionsGrid}>
            <ActionButton
              title={t('enterMeters')}
              icon={<Settings />}
              onPress={() => router.push('/compteurs')}
            />
            <ActionButton
              title={t('addSale')}
              icon={<Plus />}
              onPress={() => router.push('/ventes')}
              color="#059669"
            />
            <ActionButton
              title={t('posTicket')}
              icon={<CreditCard />}
              onPress={() => router.push('/tpe')}
              color="#7C3AED"
            />
            <ActionButton
              title={t('viewReport')}
              icon={<TrendingUp />}
              onPress={() => router.push('/rapport')}
              color="#F59E0B"
            />
          </View>
        </View>

        {/* Espacement en bas pour éviter que le contenu soit caché */}
        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Modal Dropdown pour la sélection de langue */}
      <Modal
        visible={languageDropdownVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setLanguageDropdownVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setLanguageDropdownVisible(false)}
        >
          <View style={styles.dropdownContainer}>
            <View style={styles.dropdownHeader}>
              <Text style={styles.dropdownTitle}>{t('selectLanguage') || 'Choisir la langue'}</Text>
            </View>

            {availableLanguages.map((language) => (
              <TouchableOpacity
                key={language.code}
                style={[
                  styles.languageOption,
                  currentLanguage === language.code && styles.selectedLanguageOption
                ]}
                onPress={() => handleLanguageSelect(language.code)}
              >
                <View style={styles.languageOptionContent}>
                  <Text style={styles.languageFlag}>{language.flag}</Text>
                  <Text style={[
                    styles.languageName,
                    currentLanguage === language.code && styles.selectedLanguageName
                  ]}>
                    {language.name}
                  </Text>
                </View>
                {currentLanguage === language.code && (
                  <Check size={18} color="#2563EB" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingTop: 14,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E293B',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EBF4FF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  languageText: {
    fontSize: 16,
  },
  logoutButton: {
    padding: 8,
  },
  scrollContent: {
    flex: 1,
  },
  section: {
    margin: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sectionHeaderImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    minHeight: 120, // Hauteur fixe pour éviter le saut lors du chargement
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
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
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 12,
  },
  actionButton: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  actionTitle: {
    fontSize: 12,
    color: '#1E293B',
    textAlign: 'center',
    fontWeight: '500',
  },
  // Nouveaux styles pour les loaders
  loaderContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
    marginVertical: 8,
  },
  loaderDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  shimmerPlaceholder: {
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    marginTop: 4,
  },
  // Styles pour le dropdown de langue
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    minWidth: 250,
    maxWidth: 300,
    margin: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  dropdownHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  dropdownTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    textAlign: 'center',
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  selectedLanguageOption: {
    backgroundColor: '#EBF4FF',
  },
  languageOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  languageFlag: {
    fontSize: 24,
  },
  languageName: {
    fontSize: 16,
    color: '#374151',
  },
  selectedLanguageName: {
    color: '#2563EB',
    fontWeight: '600',
  },
});