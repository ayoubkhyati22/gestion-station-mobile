import React, { useState, useEffect } from 'react';
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
import { Save, Gauge, Fuel, Droplets } from 'lucide-react-native';

interface Compteur {
  id?: number;
  pompe_numero: number;
  type: 'essence' | 'gasoil';
  numero_precedent: number;
  numero_actuel: number;
  volume_vendu: number;
}

const initialCompteurs: Compteur[] = [
  { pompe_numero: 1, type: 'essence', numero_precedent: 0, numero_actuel: 0, volume_vendu: 0 },
  { pompe_numero: 2, type: 'essence', numero_precedent: 0, numero_actuel: 0, volume_vendu: 0 },
  { pompe_numero: 3, type: 'gasoil', numero_precedent: 0, numero_actuel: 0, volume_vendu: 0 },
  { pompe_numero: 4, type: 'gasoil', numero_precedent: 0, numero_actuel: 0, volume_vendu: 0 },
];

export default function CompteursScreen() {
  const [compteurs, setCompteurs] = useState<Compteur[]>(initialCompteurs);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation(); // Hook pour les traductions

  useEffect(() => {
    loadCompteurs();
  }, []);

  const loadCompteurs = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('compteurs')
        .select('*')
        .eq('date', today)
        .order('pompe_numero');

      if (error) throw error;

      if (data && data.length > 0) {
        setCompteurs(data);
      } else {
        // Charger les derniers compteurs disponibles pour initialiser
        const { data: lastCompteurs } = await supabase
          .from('compteurs')
          .select('*')
          .order('date', { ascending: false })
          .order('pompe_numero')
          .limit(4);

        if (lastCompteurs && lastCompteurs.length > 0) {
          const updatedCompteurs = initialCompteurs.map((compteur) => {
            const lastCompteur = lastCompteurs.find(
              (c) => c.pompe_numero === compteur.pompe_numero && c.type === compteur.type
            );
            return lastCompteur
              ? {
                  ...compteur,
                  numero_precedent: lastCompteur.numero_actuel,
                }
              : compteur;
          });
          setCompteurs(updatedCompteurs);
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement des compteurs:', error);
    }
  };

  const updateCompteur = (index: number, field: keyof Compteur, value: string) => {
    const newCompteurs = [...compteurs];
    const numValue = parseFloat(value) || 0;
    
    newCompteurs[index] = {
      ...newCompteurs[index],
      [field]: numValue,
    };

    // Calculer automatiquement le volume vendu
    if (field === 'numero_precedent' || field === 'numero_actuel') {
      const compteur = newCompteurs[index];
      compteur.volume_vendu = Math.max(0, compteur.numero_actuel - compteur.numero_precedent);
    }

    setCompteurs(newCompteurs);
  };

  const saveCompteurs = async () => {
    setLoading(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      
      // Préparer les données pour l'insertion
      const compteursToSave = compteurs.map((compteur) => ({
        pompe_numero: compteur.pompe_numero,
        type: compteur.type,
        numero_precedent: compteur.numero_precedent,
        numero_actuel: compteur.numero_actuel,
        volume_vendu: compteur.volume_vendu,
        date: today,
      }));

      // Supprimer les enregistrements existants pour aujourd'hui
      await supabase
        .from('compteurs')
        .delete()
        .eq('date', today);

      // Insérer les nouveaux compteurs
      const { error } = await supabase
        .from('compteurs')
        .insert(compteursToSave);

      if (error) throw error;

      Alert.alert(t('success'), t('metersSavedSuccess'));
    } catch (error: any) {
      Alert.alert(t('error'), error.message);
    } finally {
      setLoading(false);
    }
  };

  const CompteurCard = ({ compteur, index }: { compteur: Compteur; index: number }) => (
    <View style={styles.compteurCard}>
      <View style={styles.compteurHeader}>
        <View style={styles.compteurInfo}>
          {compteur.type === 'essence' ? (
            <Fuel size={24} color="#EF4444" />
          ) : (
            <Droplets size={24} color="#059669" />
          )}
          <Text style={styles.compteurTitle}>
            {t('pump')} {compteur.pompe_numero} - {t(compteur.type)}
          </Text>
        </View>
      </View>

      <View style={styles.inputsContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>{t('previousNumber')}</Text>
          <TextInput
            style={styles.input}
            value={compteur.numero_precedent.toString()}
            onChangeText={(value) => updateCompteur(index, 'numero_precedent', value)}
            keyboardType="numeric"
            placeholder="0"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>{t('currentNumber')}</Text>
          <TextInput
            style={styles.input}
            value={compteur.numero_actuel.toString()}
            onChangeText={(value) => updateCompteur(index, 'numero_actuel', value)}
            keyboardType="numeric"
            placeholder="0"
          />
        </View>

        <View style={styles.resultGroup}>
          <Text style={styles.resultLabel}>{t('volumeSold')}</Text>
          <Text style={styles.resultValue}>{compteur.volume_vendu.toFixed(2)} {t('liters')}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerInfo}>
          <Gauge size={24} color="#2563EB" />
          <Text style={styles.headerTitle}>{t('enterMetersTitle')}</Text>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {compteurs.map((compteur, index) => (
          <CompteurCard key={`${compteur.pompe_numero}-${compteur.type}`} compteur={compteur} index={index} />
        ))}

        <TouchableOpacity
          style={[styles.saveButton, loading && styles.buttonDisabled]}
          onPress={saveCompteurs}
          disabled={loading}
        >
          <Save size={20} color="white" />
          <Text style={styles.saveButtonText}>
            {loading ? t('saving') : t('saveMeters')}
          </Text>
        </TouchableOpacity>
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
  compteurCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  compteurHeader: {
    marginBottom: 16,
  },
  compteurInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  compteurTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
  inputsContainer: {
    gap: 16,
  },
  inputGroup: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    backgroundColor: '#F9FAFB',
  },
  resultGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F0F9FF',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  resultLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#0369A1',
  },
  resultValue: {
    fontSize: 16,
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
    marginTop: 8,
    marginBottom: 32,
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