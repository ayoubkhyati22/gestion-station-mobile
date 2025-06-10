import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Fuel, Droplets } from 'lucide-react-native';
import type { FuelType } from '@/types';

interface FuelTypeSelectorProps {
  selectedType: FuelType;
  onTypeChange: (type: FuelType) => void;
  t: (key: string) => string;
}

export const FuelTypeSelector: React.FC<FuelTypeSelectorProps> = ({
  selectedType,
  onTypeChange,
  t,
}) => {
  const TypeButton = ({ 
    value, 
    label, 
    icon 
  }: { 
    value: FuelType; 
    label: string; 
    icon: React.ReactNode; 
  }) => (
    <TouchableOpacity
      style={[
        styles.typeButton,
        selectedType === value && styles.typeButtonActive,
      ]}
      onPress={() => onTypeChange(value)}
    >
      {icon}
      <Text
        style={[
          styles.typeButtonText,
          selectedType === value && styles.typeButtonTextActive,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{t('fuelType')}</Text>
      <View style={styles.typeContainer}>
        <TypeButton
          value="essence"
          label={t('essence')}
          icon={<Fuel size={20} color={selectedType === 'essence' ? 'white' : '#EF4444'} />}
        />
        <TypeButton
          value="gasoil"
          label={t('gasoil')}
          icon={<Droplets size={20} color={selectedType === 'gasoil' ? 'white' : '#059669'} />}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 12,
  },
  typeContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#F9FAFB',
    gap: 8,
  },
  typeButtonActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  typeButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  typeButtonTextActive: {
    color: 'white',
  },
});