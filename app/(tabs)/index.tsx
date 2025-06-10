import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Image,
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from 'react-i18next';
import { useDashboardData } from '@/hooks/useDashboardData';
import {
  Fuel,
  Droplets,
  CreditCard,
  Car,
  Settings,
  LogOut,
  Plus,
  TrendingUp,
} from 'lucide-react-native';

// Components
import { Header } from '@/components/common/Header';
import { LanguageSelector } from '@/components/common/LanguageSelector';
import { StatCard } from '@/components/dashboard/StatCard';
import { ActionButton } from '@/components/dashboard/ActionButton';
import { TotalCard } from '@/components/dashboard/TotalCard';
import { Card } from '@/components/ui/Card';

export default function DashboardScreen() {
  const { signOut, user } = useAuth();
  const { currentLanguage, changeLanguage, availableLanguages } = useLanguage();
  const { t } = useTranslation();
  const { stats, loading, refreshing, onRefresh, allDataLoaded, totalJour } = useDashboardData();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace('/login');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  const headerActions = (
    <>
      <LanguageSelector
        currentLanguage={currentLanguage}
        availableLanguages={availableLanguages}
        onLanguageSelect={changeLanguage}
        t={t}
      />
      <TouchableOpacity onPress={handleSignOut} style={styles.logoutButton}>
        <LogOut size={20} color="#EF4444" />
      </TouchableOpacity>
    </>
  );

  return (
    <View style={styles.container}>
      <Header
        title={t('dashboard')}
        subtitle={`${t('welcome')}, ${user?.email?.split('@')[0]}`}
        actions={headerActions}
      />

      <ScrollView
        style={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Daily Summary */}
        <Card style={styles.section}>
          <View style={styles.sectionHeader}>
            <TrendingUp size={20} color="#2563EB" />
            <Text style={styles.sectionTitle}>{t('dailySummary')}</Text>
            <Image
              source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/c/c8/Afriquia-smdc-175639.png' }}
              style={styles.sectionHeaderImage}
              resizeMode="contain"
            />
          </View>

          <View style={styles.statsContainer}>
            <StatCard
              title={t('essence')}
              value={stats.totalEssence}
              icon={<Fuel size={24} color="#EF4444" />}
              color="#EF4444"
              isLoading={loading.essence}
              currency={t('dh')}
            />
            <StatCard
              title={t('gasoil')}
              value={stats.totalGasoil}
              icon={<Droplets size={24} color="#059669" />}
              color="#059669"
              isLoading={loading.gasoil}
              currency={t('dh')}
            />
            <StatCard
              title={t('tpe')}
              value={stats.totalTPE}
              icon={<CreditCard size={24} color="#7C3AED" />}
              color="#7C3AED"
              isLoading={loading.tpe}
              currency={t('dh')}
            />
            <StatCard
              title={t('lavage')}
              value={stats.totalLavage}
              icon={<Car size={24} color="#0891B2" />}
              color="#0891B2"
              isLoading={loading.lavage}
              currency={t('dh')}
            />
          </View>

          <TotalCard
            label={t('totalDay')}
            value={totalJour}
            isLoading={!allDataLoaded}
            currency={t('dh')}
          />
        </Card>

        {/* Quick Actions */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>{t('quickActions')}</Text>

          <View style={styles.actionsGrid}>
            <View style={styles.actionRow}>
              <ActionButton
                title={t('enterMeters')}
                icon={<Settings />}
                onPress={() => router.push('/compteurs')}
                style={styles.actionCard}
              />
              <ActionButton
                title={t('addSale')}
                icon={<Plus />}
                onPress={() => router.push('/ventes')}
                color="#059669"
                style={styles.actionCard}
              />
            </View>
            <View style={styles.actionRow}>
              <ActionButton
                title={t('posTicket')}
                icon={<CreditCard />}
                onPress={() => router.push('/tpe')}
                color="#7C3AED"
                style={styles.actionCard}
              />
              <ActionButton
                title={t('viewReport')}
                icon={<TrendingUp />}
                onPress={() => router.push('/rapport')}
                color="#F59E0B"
                style={styles.actionCard}
              />
            </View>
          </View>
        </Card>

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
  logoutButton: {
    padding: 8,
  },
  scrollContent: {
    flex: 1,
  },
  section: {
    margin: 16,
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
  statsContainer: {
    gap: 12,
    marginBottom: 20,
  },
  actionsGrid: {
    marginTop: 12,
    gap: 12,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  actionCard: {
    flex: 1,
    minHeight: 80,
  },
});