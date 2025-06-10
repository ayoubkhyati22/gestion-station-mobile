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
      <View style={[styles.statIcon, { backgroundColor: color + '20' }]}>
        {icon}
      </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 8,
    gap: 12,
    minHeight: 80,
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
});