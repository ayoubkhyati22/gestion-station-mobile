import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTPE } from '@/hooks/useTPE';
import { Save, CreditCard, User, Car } from 'lucide-react-native';

// Components
import { Header } from '@/components/common/Header';
import { TabSelector } from '@/components/tpe/TabSelector';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function TPEScreen() {
  const { t } = useTranslation();
  const {
    nomClient,
    setNomClient,
    montant,
    setMontant,
    montantLavage,
    setMontantLavage,
    loading,
    activeTab,
    setActiveTab,
    handleSaveTPE,
    handleSaveLavage,
  } = useTPE();

  return (
    <View style={styles.container}>
      <Header
        title={t('tpeAndWash')}
        icon={<CreditCard size={24} color="#2563EB" />}
      />

      <TabSelector
        activeTab={activeTab}
        onTabChange={setActiveTab}
        t={t}
      />

      <ScrollView style={styles.content}>
        {activeTab === 'tpe' ? (
          <Card>
            <Text style={styles.formTitle}>{t('addPosTicket')}</Text>
            
            <Input
              label={t('clientName')}
              value={nomClient}
              onChangeText={setNomClient}
              placeholder={t('clientName')}
              autoCapitalize="words"
              icon={<User size={20} color="#6B7280" />}
            />

            <Input
              label={t('amount')}
              value={montant}
              onChangeText={setMontant}
              placeholder={t('amount')}
              keyboardType="numeric"
              icon={<CreditCard size={20} color="#6B7280" />}
              unit={t('dh')}
            />

            <Button
              title={loading ? t('saving') : t('savePosTicket')}
              onPress={() => handleSaveTPE(t)}
              disabled={loading}
              loading={loading}
              icon={<Save size={20} color="white" />}
              variant="primary"
            />
          </Card>
        ) : (
          <Card>
            <Text style={styles.formTitle}>{t('addWash')}</Text>
            
            <Input
              label={t('washAmount')}
              value={montantLavage}
              onChangeText={setMontantLavage}
              placeholder={t('washAmount')}
              keyboardType="numeric"
              icon={<Car size={20} color="#6B7280" />}
              unit={t('dh')}
            />

            <Button
              title={loading ? t('saving') : t('saveWash')}
              onPress={() => handleSaveLavage(t)}
              disabled={loading}
              loading={loading}
              icon={<Save size={20} color="white" />}
              style={styles.saveButtonLavage}
            />
          </Card>
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
  content: {
    flex: 1,
    padding: 16,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 20,
  },
  saveButtonLavage: {
    backgroundColor: '#0891B2',
  },
});