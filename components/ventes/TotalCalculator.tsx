import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Calculator } from 'lucide-react-native';

interface TotalCalculatorProps {
  total: number;
  currency: string;
  label: string;
}

export const TotalCalculator: React.FC<TotalCalculatorProps> = ({
  total,
  currency,
  label,
}) => {
  return (
    <View style={styles.totalSection}>
      <View style={styles.totalHeader}>
        <Calculator size={20} color="#2563EB" />
        <Text style={styles.totalTitle}>{label}</Text>
      </View>
      <Text style={styles.totalValue}>
        {total.toFixed(2)} {currency}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  totalSection: {
    backgroundColor: '#F0F9FF',
    padding: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BAE6FD',
    marginBottom: 24,
  },
  totalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  totalTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#0369A1',
  },
  totalValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0369A1',
  },
});