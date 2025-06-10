import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useCompteurs } from '@/hooks/useCompteurs';
import { Save, Gauge } from 'lucide-react-native';

// Components
import { Header } from '@/components/common/Header';
import { CompteurCard } from '@/components/compteurs/CompteurCard';
import { Button } from '@/components/ui/Button';

export default function CompteursScreen() {
  const { t } = useTranslation();
  const { compteurs, loading, updateCompteur, saveCompteurs } = useCompteurs();

  return (
    <View style={styles.container}>
      <Header
        title={t('enterMetersTitle')}
        icon={<Gauge size={24} color="#2563EB" />}
      />

      <ScrollView style={styles.content}>
        {compteurs.map((compteur, index) => (
          <CompteurCard
            key={`${compteur.pompe_numero}-${compteur.type}`}
            compteur={compteur}
            index={index}
            onUpdate={updateCompteur}
            t={t}
          />
        ))}

        <Button
          title={loading ? t('saving') : t('saveMeters')}
          onPress={() => saveCompteurs(t)}
          disabled={loading}
          loading={loading}
          icon={<Save size={20} color="white" />}
          style={styles.saveButton}
        />

        <View style={{ height: 32 }} />
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
  saveButton: {
    marginTop: 8,
  },
});