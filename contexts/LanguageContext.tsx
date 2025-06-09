import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Types pour le contexte de langue
interface LanguageContextType {
  currentLanguage: string;
  changeLanguage: (language: string) => Promise<void>;
  availableLanguages: { code: string; name: string; flag: string }[];
}

// Langues disponibles avec leurs informations
const AVAILABLE_LANGUAGES = [
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ar', name: 'العربية', flag: 'ar' }
];

// Clé pour le stockage local
const LANGUAGE_STORAGE_KEY = 'app_language';

// Création du contexte
const LanguageContext = createContext<LanguageContextType>({
  currentLanguage: 'fr',
  changeLanguage: async () => {},
  availableLanguages: AVAILABLE_LANGUAGES
});

// Provider du contexte de langue
export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState<string>('fr');

  // Charger la langue sauvegardée au démarrage
  useEffect(() => {
    loadSavedLanguage();
  }, []);

  // Fonction pour charger la langue sauvegardée
  const loadSavedLanguage = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (savedLanguage && AVAILABLE_LANGUAGES.find(lang => lang.code === savedLanguage)) {
        await changeLanguage(savedLanguage);
      }
    } catch (error) {
      console.error('Erreur lors du chargement de la langue:', error);
    }
  };

  // Fonction pour changer la langue
  const changeLanguage = async (language: string) => {
    try {
      // Vérifier que la langue est disponible
      if (!AVAILABLE_LANGUAGES.find(lang => lang.code === language)) {
        console.warn(`Langue non disponible: ${language}`);
        return;
      }

      // Changer la langue dans i18next
      await i18n.changeLanguage(language);
      
      // Mettre à jour l'état local
      setCurrentLanguage(language);
      
      // Sauvegarder la langue dans le stockage local
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, language);
      
      console.log(`Langue changée vers: ${language}`);
    } catch (error) {
      console.error('Erreur lors du changement de langue:', error);
    }
  };

  // Valeurs du contexte
  const contextValue: LanguageContextType = {
    currentLanguage,
    changeLanguage,
    availableLanguages: AVAILABLE_LANGUAGES
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};

// Hook personnalisé pour utiliser le contexte de langue
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  
  if (!context) {
    throw new Error('useLanguage doit être utilisé dans un LanguageProvider');
  }
  
  return context;
};

// Export du contexte pour usage direct si nécessaire
export { LanguageContext };