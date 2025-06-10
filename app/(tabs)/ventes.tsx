import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useVentes } from '@/hooks/useVentes';
import { Save } from 'lucide-react-native';

// Components
import { Header } from '@/components/common/Header';
import { FuelTypeSelector } from '@/components/ventes/FuelTypeSelector';
import { TotalCalculator } from '@/components/ventes/TotalCalculator';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function VentesScreen() {
  const { t } = useTranslation();
  const {
    type,
    setType,
    volume,
    setVolume,
    prixParLitre,
    setPrixParLitre,
    loading,
    total,
    handleSaveVente,
  } = useVentes();

  return (
    <View style={styles.container}>
      <Header
        title={t('addSaleTitle')}
        icon={<Save size={24} color="#2563EB" />}
      />

      <ScrollView style={styles.content}>
        <Card>
          <FuelTypeSelector
            selectedType={type}
            onTypeChange={setType}
            t={t}
          />

          <Input
            label={t('volumeSoldInput')}
            value={volume}
            onChangeText={setVolume}
            placeholder={t('volumeSoldInput')}
            keyboardType="numeric"
            unit={t('liters')}
          />

          <Input
            label={t('pricePerLiter')}
            value={prixParLitre}
            onChangeText={setPrixParLitre}
            placeholder={t('pricePerLiter')}
            keyboardType="numeric"
            unit={t('dh')}
          />

          <TotalCalculator
            total={total}
            currency={t('dh')}
            label={t('calculatedTotal')}
          />

          <Button
            title={loading ? t('saving') : t('saveSale')}
            onPress={() => handleSaveVente(t)}
            disabled={loading}
            loading={loading}
            icon={<Save size={20} color="white" />}
          />
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    flex: 1,
    padding: 16,
  },
});