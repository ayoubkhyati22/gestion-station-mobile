import { Tabs } from 'expo-router';
import { ChartColumnStacked as Home, Gauge, CirclePlus as PlusCircle, Receipt, FileText } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { router } from 'expo-router';

export default function TabLayout() {
  const { session, loading } = useAuth();
  const { t } = useTranslation(); // Hook pour les traductions

  useEffect(() => {
    if (!loading && !session) {
      router.replace('/login');
    }
  }, [session, loading]);

  if (loading) {
    return null;
  }

  if (!session) {
    return null;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          paddingTop: 0,
          paddingBottom: 0,
          height: 60,
        },
        tabBarActiveTintColor: '#2563EB',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: t('dashboard'), // Traduction dynamique
          tabBarIcon: ({ size, color }) => (
            <Home size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="compteurs"
        options={{
          title: t('compteurs'), // Traduction dynamique
          tabBarIcon: ({ size, color }) => (
            <Gauge size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="ventes"
        options={{
          title: t('ventes'), // Traduction dynamique
          tabBarIcon: ({ size, color }) => (
            <PlusCircle size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="tpe"
        options={{
          title: t('tpe'), // Traduction dynamique
          tabBarIcon: ({ size, color }) => (
            <Receipt size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="rapport"
        options={{
          title: t('rapport'), // Traduction dynamique
          tabBarIcon: ({ size, color }) => (
            <FileText size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}