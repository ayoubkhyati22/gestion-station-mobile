import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LoadingDots } from '@/components/ui/LoadingDots';
import { ShimmerText } from '@/components/ui/ShimmerText';

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  details?: string;
  isLoading: boolean;
  currency?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  color,
  details,
  isLoading,
  currency = 'DH',
}) => {
  return (
    <View style={styles.statCard}>
      {/* Icon at the top */}
      <View style={[styles.statIcon, { backgroundColor: color + '20' }]}>
        {icon}
      </View>
      
      {/* Price and title at the bottom */}
      <View style={styles.statContent}>
        {isLoading ? (
          <>
            <LoadingDots color={color} />
            <ShimmerText width={60} height={14} />
            {details && <ShimmerText width={80} height={12} />}
          </>
        ) : (
          <>
            <Text style={styles.statValue}>
              {value.toFixed(2)} {currency}
            </Text>
            <Text style={styles.statTitle}>{title}</Text>
            {details && <Text style={styles.statDetails}>{details}</Text>}
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  statCard: {
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 8,
    minHeight: 120,
    justifyContent: 'space-between',
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statContent: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    textAlign: 'center',
  },
  statTitle: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
    textAlign: 'center',
  },
  statDetails: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
    textAlign: 'center',
  },
});