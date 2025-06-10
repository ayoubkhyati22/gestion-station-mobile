import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { CreditCard, Car } from 'lucide-react-native';
import type { TabType } from '@/types';

interface TabSelectorProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  t: (key: string) => string;
}

export const TabSelector: React.FC<TabSelectorProps> = ({
  activeTab,
  onTabChange,
  t,
}) => {
  const TabButton = ({ 
    value, 
    label, 
    icon 
  }: { 
    value: TabType; 
    label: string; 
    icon: React.ReactNode; 
  }) => (
    <TouchableOpacity
      style={[
        styles.tabButton,
        activeTab === value && styles.tabButtonActive,
      ]}
      onPress={() => onTabChange(value)}
    >
      {icon}
      <Text
        style={[
          styles.tabButtonText,
          activeTab === value && styles.tabButtonTextActive,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.tabContainer}>
      <TabButton
        value="tpe"
        label={t('posTicket')}
        icon={<CreditCard size={18} color={activeTab === 'tpe' ? 'white' : '#7C3AED'} />}
      />
      <TabButton
        value="lavage"
        label={t('lavage')}
        icon={<Car size={18} color={activeTab === 'lavage' ? 'white' : '#0891B2'} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 8,
    padding: 4,
    gap: 4,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 6,
    gap: 6,
  },
  tabButtonActive: {
    backgroundColor: '#2563EB',
  },
  tabButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  tabButtonTextActive: {
    color: 'white',
  },
});