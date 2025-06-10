import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRapport } from '@/hooks/useRapport';
import { 
  FileText, 
  TrendingUp, 
  Fuel, 
  Droplets, 
  CreditCard, 
  Car, 
  Calendar,
  RefreshCw,
  Download
} from 'lucide-react-native';

// Components
import { Header } from '@/components/common/Header';
import { StatCard } from '@/components/dashboard/StatCard';
import { TotalCard } from '@/components/dashboard/TotalCard';
import { Card } from '@/components/ui/Card';
import { LoadingDots } from '@/components/ui/LoadingDots';
import { ShimmerText } from '@/components/ui/ShimmerText';

// Detail Section Loader Component
const DetailSectionLoader = () => {
  return (
    <Card style={styles.detailSection}>
      <ShimmerText width={150} height={16} />
      <View style={styles.detailLoaderContainer}>
        {[1, 2, 3].map((item) => (
          <View key={item} style={styles.detailItem}>
            <ShimmerText width={120} height={14} />
            <ShimmerText width={60} height={14} />
          </View>
        ))}
      </View>
    </Card>
  );
};

// Detail Section Component
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
    <Card style={styles.detailSection}>
      <Text style={styles.detailSectionTitle}>{title}</Text>
      {children}
    </Card>
  );
};

export default function RapportScreen() {
  const { t } = useTranslation();
  const selectedDate = new Date().toISOString().split('T')[0];
  
  const {
    rapport,
    loading,
    refreshing,
    downloadingPDF,
    onRefresh,
    downloadPDF,
    mainDataLoaded,
    totalGeneral,
  } = useRapport(selectedDate);

  const headerActions = (
    <>
      <TouchableOpacity
        onPress={() => downloadPDF(t)}
        style={[styles.downloadButton, downloadingPDF && styles.buttonDisabled]}
        disabled={downloadingPDF || !mainDataLoaded}
      >
        <Download size={20} color={downloadingPDF ? "#9CA3AF" : "#059669"} />
      </TouchableOpacity>
      <TouchableOpacity onPress={onRefresh} style={styles.refreshButton}>
        <RefreshCw size={20} color="#2563EB" />
      </TouchableOpacity>
    </>
  );

  return (
    <View style={styles.container}>
      <Header
        title={t('dailyReport')}
        icon={<FileText size={24} color="#2563EB" />}
        actions={headerActions}
      />

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
        {/* Financial Summary */}
        <Card style={styles.section}>
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
              currency={t('dh')}
            />
            <StatCard
              title={t('gasoil')}
              value={rapport.totalGasoil}
              icon={<Droplets size={20} color="#059669" />}
              color="#059669"
              details={`${rapport.ventesGasoil.length} ${t('sales')}`}
              isLoading={loading.gasoil}
              currency={t('dh')}
            />
            <StatCard
              title={t('tpe')}
              value={rapport.totalTPE}
              icon={<CreditCard size={20} color="#7C3AED" />}
              color="#7C3AED"
              details={`${rapport.ticketsTPE.length} ${t('tickets')}`}
              isLoading={loading.tpe}
              currency={t('dh')}
            />
            <StatCard
              title={t('lavage')}
              value={rapport.totalLavage}
              icon={<Car size={20} color="#0891B2" />}
              color="#0891B2"
              details={`${rapport.lavages.length} ${t('washes')}`}
              isLoading={loading.lavage}
              currency={t('dh')}
            />
          </View>

          <TotalCard
            label={t('generalTotal')}
            value={totalGeneral}
            isLoading={!mainDataLoaded}
            currency={t('dh')}
          />
        </Card>

        {/* Gasoline Sales Detail */}
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

        {/* Diesel Sales Detail */}
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

        {/* POS Tickets Detail */}
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

        {/* Volumes Sold (Meters) */}
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
  downloadButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F0FDF4',
  },
  refreshButton: {
    padding: 8,
  },
  buttonDisabled: {
    opacity: 0.5,
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
  detailSection: {
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
  detailLoaderContainer: {
    marginTop: 12,
  },
});