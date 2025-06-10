import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';

interface ActionButtonProps {
  title: string;
  icon: React.ReactNode;
  onPress: () => void;
  color?: string;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  title,
  icon,
  onPress,
  color = '#2563EB',
}) => {
  return (
    <TouchableOpacity style={styles.actionButton} onPress={onPress}>
      <View style={[styles.actionIcon, { backgroundColor: color + '20' }]}>
        {React.cloneElement(icon as React.ReactElement, { size: 24, color })}
      </View>
      <Text style={styles.actionTitle}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  actionButton: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  actionTitle: {
    fontSize: 12,
    color: '#1E293B',
    textAlign: 'center',
    fontWeight: '500',
  },
});