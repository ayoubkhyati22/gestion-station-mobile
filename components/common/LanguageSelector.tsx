import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet, Modal, Pressable } from 'react-native';
import { Globe, ChevronDown, Check } from 'lucide-react-native';
import type { Language } from '@/types';

interface LanguageSelectorProps {
  currentLanguage: string;
  availableLanguages: Language[];
  onLanguageSelect: (languageCode: string) => void;
  t: (key: string) => string;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  currentLanguage,
  availableLanguages,
  onLanguageSelect,
  t,
}) => {
  const [dropdownVisible, setDropdownVisible] = React.useState(false);
  
  const currentLanguageData = availableLanguages.find(lang => lang.code === currentLanguage);

  const handleLanguageSelect = (languageCode: string) => {
    onLanguageSelect(languageCode);
    setDropdownVisible(false);
  };

  return (
    <>
      <TouchableOpacity
        onPress={() => setDropdownVisible(true)}
        style={styles.languageButton}
      >
        <Globe size={18} color="#2563EB" />
        <Text style={styles.languageText}>
          {currentLanguageData?.flag}
        </Text>
        <ChevronDown size={16} color="#2563EB" />
      </TouchableOpacity>

      <Modal
        visible={dropdownVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setDropdownVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setDropdownVisible(false)}
        >
          <View style={styles.dropdownContainer}>
            <View style={styles.dropdownHeader}>
              <Text style={styles.dropdownTitle}>
                {t('selectLanguage') || 'Choisir la langue'}
              </Text>
            </View>

            {availableLanguages.map((language) => (
              <TouchableOpacity
                key={language.code}
                style={[
                  styles.languageOption,
                  currentLanguage === language.code && styles.selectedLanguageOption
                ]}
                onPress={() => handleLanguageSelect(language.code)}
              >
                <View style={styles.languageOptionContent}>
                  <Text style={styles.languageFlag}>{language.flag}</Text>
                  <Text style={[
                    styles.languageName,
                    currentLanguage === language.code && styles.selectedLanguageName
                  ]}>
                    {language.name}
                  </Text>
                </View>
                {currentLanguage === language.code && (
                  <Check size={18} color="#2563EB" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EBF4FF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  languageText: {
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    minWidth: 250,
    maxWidth: 300,
    margin: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  dropdownHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  dropdownTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    textAlign: 'center',
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  selectedLanguageOption: {
    backgroundColor: '#EBF4FF',
  },
  languageOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  languageFlag: {
    fontSize: 24,
  },
  languageName: {
    fontSize: 16,
    color: '#374151',
  },
  selectedLanguageName: {
    color: '#2563EB',
    fontWeight: '600',
  },
});