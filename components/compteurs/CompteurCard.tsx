import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Fuel, Droplets } from 'lucide-react-native';
import { Input } from '@/components/ui/Input';
import type { Compteur } from '@/types';

interface CompteurCardProps {
  compteur: Compteur;
  index: number;
  onUpdate: (index: number, field: keyof Compteur, value: string) => void;
  t: (key: string) => string;
}

export const CompteurCard: React.FC<CompteurCardProps> = ({
  compteur,
  index,
  onUpdate,
  t,
}) => {
  return (
    <View style={styles.compteurCard}>
      <View style={styles.compteurHeader}>
        <View style={styles.compteurInfo}>
          {compteur.type === 'essence' ? (
            <Fuel size={24} color="#EF4444" />
          ) : (
            <Droplets size={24} color="#059669" />
          )}
          <Text style={styles.compteurTitle}>
            {t('pump')} {compteur.pompe_numero} - {t(compteur.type)}
          </Text>
        </View>
      </View>

      <View style={styles.inputsContainer}>
        <Input
          label={t('previousNumber')}
          value={compteur.numero_precedent.toString()}
          onChangeText={(value) => onUpdate(index, 'numero_precedent', value)}
          keyboardType="numeric"
          placeholder="0"
        />

        <Input
          label={t('currentNumber')}
          value={compteur.numero_actuel.toString()}
          onChangeText={(value) => onUpdate(index, 'numero_actuel', value)}
          keyboardType="numeric"
          placeholder="0"
        />

        <View style={styles.resultGroup}>
          <Text style={styles.resultLabel}>{t('volumeSold')}</Text>
          <Text style={styles.resultValue}>
            {compteur.volume_vendu.toFixed(2)} {t('liters')}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  compteurCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  compteurHeader: {
    marginBottom: 16,
  },
  compteurInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  compteurTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
  inputsContainer: {
    gap: 16,
  },
  resultGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F0F9FF',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  resultLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#0369A1',
  },
  resultValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0369A1',
  },
});