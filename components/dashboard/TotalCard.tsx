import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LoadingDots } from '@/components/ui/LoadingDots';

interface TotalCardProps {
  label: string;
  value: number;
  isLoading: boolean;
  currency?: string;
}

export const TotalCard: React.FC<TotalCardProps> = ({
  label,
  value,
  isLoading,
  currency = 'DH',
}) => {
  return (
    <View style={styles.totalCard}>
      <Text style={styles.totalLabel}>{label}</Text>
      {isLoading ? (
        <LoadingDots color="#BFDBFE" />
      ) : (
        <Text style={styles.totalValue}>
          {value.toFixed(2)} {currency}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  totalCard: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
    minHeight: 80,
  },
  totalLabel: {
    fontSize: 14,
    color: 'grey',
    marginBottom: 4,
  },
  totalValue: {
    fontSize: 24,
    fontWeight: '700',
    color: 'black',
  },
});