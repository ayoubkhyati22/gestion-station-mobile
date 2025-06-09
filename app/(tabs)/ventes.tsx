import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { supabase } from '@/lib/supabase';
import { useTranslation } from 'react-i18next';
import { Save, Fuel, Droplets, Calculator } from 'lucide-react-native';

export default function VentesScreen() {
  const [type, setType] = useState<'essence' | 'gasoil'>('essence');
  const [volume, setVolume] = useState('');
  const [prixParLitre, setPrixParLitre] = useState('');
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation(); // Hook pour les traductions

  const total = (parseFloat(volume) || 0) * (parseFloat(prixParLitre) || 0);

  const handleSaveVente = async () => {
    if (!volume || !prixParLitre) {
      Alert.alert(t('error'), t('fillAllFields'));
      return;
    }

    setLoading(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const { error } = await supabase
        .from('ventes')
        .insert({
          type,
          volume: parseFloat(volume),
          prix_par_litre: parseFloat(prixParLitre),
          total,
          date: today,
        });

      if (error) throw error;

      Alert.alert(t('success'), t('saleSavedSuccess'));
      
      // Reset form
      setVolume('');
      setPrixParLitre('');
      setType('essence');
    } catch (error: any) {
      Alert.alert(t('error'), error.message);
    } finally {
      setLoading(false);
    }
  };

  const TypeButton = ({ 
    value, 
    label, 
    icon 
  }: { 
    value: 'essence' | 'gasoil'; 
    label: string; 
    icon: React.ReactNode; 
  }) => (
    <TouchableOpacity
      style={[
        styles.typeButton,
        type === value && styles.typeButtonActive,
      ]}
      onPress={() => setType(value)}
    >
      {icon}
      <Text
        style={[
          styles.typeButtonText,
          type === value && styles.typeButtonTextActive,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerInfo}>
          <Save size={24} color="#2563EB" />
          <Text style={styles.headerTitle}>{t('addSaleTitle')}</Text>
        </View>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.form}>
          {/* Sélection du type */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('fuelType')}</Text>
            <View style={styles.typeContainer}>
              <TypeButton
                value="essence"
                label={t('essence')}
                icon={<Fuel size={20} color={type === 'essence' ? 'white' : '#EF4444'} />}
              />
              <TypeButton
                value="gasoil"
                label={t('gasoil')}
                icon={<Droplets size={20} color={type === 'gasoil' ? 'white' : '#059669'} />}
              />
            </View>
          </View>

          {/* Volume */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('volumeSoldInput')}</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={volume}
                onChangeText={setVolume}
                placeholder={t('volumeSoldInput')}
                keyboardType="numeric"
              />
              <Text style={styles.inputUnit}>{t('liters')}</Text>
            </View>
          </View>

          {/* Prix par litre */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('pricePerLiter')}</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={prixParLitre}
                onChangeText={setPrixParLitre}
                placeholder={t('pricePerLiter')}
                keyboardType="numeric"
              />
              <Text style={styles.inputUnit}>{t('dh')}</Text>
            </View>
          </View>

          {/* Calcul du total */}
          <View style={styles.totalSection}>
            <View style={styles.totalHeader}>
              <Calculator size={20} color="#2563EB" />
              <Text style={styles.totalTitle}>{t('calculatedTotal')}</Text>
            </View>
            <Text style={styles.totalValue}>{total.toFixed(2)} {t('dh')}</Text>
          </View>

          {/* Bouton d'enregistrement */}
          <TouchableOpacity
            style={[styles.saveButton, loading && styles.buttonDisabled]}
            onPress={handleSaveVente}
            disabled={loading}
          >
            <Save size={20} color="white" />
            <Text style={styles.saveButtonText}>
              {loading ? t('saving') : t('saveSale')}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: 'white',
    padding: 20,
    paddingTop: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1E293B',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  form: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
  },
  input: {
    flex: 1,
    height: 48,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  inputUnit: {
    paddingHorizontal: 12,
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
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
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    padding: 16,
    borderRadius: 8,
    gap: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});