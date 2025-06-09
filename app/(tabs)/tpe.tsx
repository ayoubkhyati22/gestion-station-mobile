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
import { Save, CreditCard, User, Car } from 'lucide-react-native';

export default function TPEScreen() {
  const [nomClient, setNomClient] = useState('');
  const [montant, setMontant] = useState('');
  const [montantLavage, setMontantLavage] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'tpe' | 'lavage'>('tpe');
  const { t } = useTranslation(); // Hook pour les traductions

  const handleSaveTPE = async () => {
    if (!nomClient || !montant) {
      Alert.alert(t('error'), t('fillAllFields'));
      return;
    }

    setLoading(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const { error } = await supabase
        .from('tickets_tpe')
        .insert({
          nom_client: nomClient,
          montant: parseFloat(montant),
          date: today,
        });

      if (error) throw error;

      Alert.alert(t('success'), t('posTicketSavedSuccess'));
      
      // Reset form
      setNomClient('');
      setMontant('');
    } catch (error: any) {
      Alert.alert(t('error'), error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveLavage = async () => {
    if (!montantLavage) {
      Alert.alert(t('error'), t('enterAmount'));
      return;
    }

    setLoading(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const { error } = await supabase
        .from('lavages')
        .insert({
          montant: parseFloat(montantLavage),
          date: today,
        });

      if (error) throw error;

      Alert.alert(t('success'), t('washSavedSuccess'));
      
      // Reset form
      setMontantLavage('');
    } catch (error: any) {
      Alert.alert(t('error'), error.message);
    } finally {
      setLoading(false);
    }
  };

  const TabButton = ({ 
    value, 
    label, 
    icon 
  }: { 
    value: 'tpe' | 'lavage'; 
    label: string; 
    icon: React.ReactNode; 
  }) => (
    <TouchableOpacity
      style={[
        styles.tabButton,
        activeTab === value && styles.tabButtonActive,
      ]}
      onPress={() => setActiveTab(value)}
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
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerInfo}>
          <CreditCard size={24} color="#2563EB" />
          <Text style={styles.headerTitle}>{t('tpeAndWash')}</Text>
        </View>
      </View>

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

      <ScrollView style={styles.content}>
        {activeTab === 'tpe' ? (
          <View style={styles.form}>
            <Text style={styles.formTitle}>{t('addPosTicket')}</Text>
            
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t('clientName')}</Text>
              <View style={styles.inputContainer}>
                <User size={20} color="#6B7280" />
                <TextInput
                  style={styles.input}
                  value={nomClient}
                  onChangeText={setNomClient}
                  placeholder={t('clientName')}
                  autoCapitalize="words"
                />
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t('amount')}</Text>
              <View style={styles.inputContainer}>
                <CreditCard size={20} color="#6B7280" />
                <TextInput
                  style={styles.input}
                  value={montant}
                  onChangeText={setMontant}
                  placeholder={t('amount')}
                  keyboardType="numeric"
                />
                <Text style={styles.inputUnit}>{t('dh')}</Text>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.saveButton, loading && styles.buttonDisabled]}
              onPress={handleSaveTPE}
              disabled={loading}
            >
              <Save size={20} color="white" />
              <Text style={styles.saveButtonText}>
                {loading ? t('saving') : t('savePosTicket')}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.form}>
            <Text style={styles.formTitle}>{t('addWash')}</Text>
            
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t('washAmount')}</Text>
              <View style={styles.inputContainer}>
                <Car size={20} color="#6B7280" />
                <TextInput
                  style={styles.input}
                  value={montantLavage}
                  onChangeText={setMontantLavage}
                  placeholder={t('washAmount')}
                  keyboardType="numeric"
                />
                <Text style={styles.inputUnit}>{t('dh')}</Text>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.saveButton, styles.saveButtonLavage, loading && styles.buttonDisabled]}
              onPress={handleSaveLavage}
              disabled={loading}
            >
              <Save size={20} color="white" />
              <Text style={styles.saveButtonText}>
                {loading ? t('saving') : t('saveWash')}
              </Text>
            </TouchableOpacity>
          </View>
        )}
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
  content: {
    flex: 1,
    padding: 16,
  },
  form: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 20,
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 12,
    gap: 8,
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 16,
  },
  inputUnit: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#7C3AED',
    padding: 16,
    borderRadius: 8,
    gap: 8,
  },
  saveButtonLavage: {
    backgroundColor: '#0891B2',
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