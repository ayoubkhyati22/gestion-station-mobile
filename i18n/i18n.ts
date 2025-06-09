import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Configuration des ressources de traduction
const resources = {
  en: {
    translation: {
      selectLanguage: 'Select Language',
      // Navigation et interface générale
      dashboard: 'Dashboard',
      compteurs: 'Meters',
      ventes: 'Sales',
      tpe: 'POS',
      rapport: 'Report',
      
      // Dashboard
      welcome: 'Welcome',
      dailySummary: 'Daily Summary',
      quickActions: 'Quick Actions',
      totalDay: 'Daily Total',
      
      // Types de carburant et services
      essence: 'Gasoline',
      gasoil: 'Diesel',
      lavage: 'Car Wash',
      
      // Actions
      enterMeters: 'Enter Meters',
      addSale: 'Add Sale',
      posTicket: 'POS Ticket',
      viewReport: 'View Report',
      
      // Formulaires
      save: 'Save',
      saving: 'Saving...',
      cancel: 'Cancel',
      
      // Messages
      success: 'Success',
      error: 'Error',
      fillAllFields: 'Please fill all fields',
      
      // Unités
      dh: 'DH',
      liters: 'L',
      
      // Compteurs
      enterMetersTitle: 'Enter Meters',
      previousNumber: 'Previous Number',
      currentNumber: 'Current Number',
      volumeSold: 'Volume Sold',
      saveMeters: 'Save Meters',
      pump: 'Pump',
      metersSavedSuccess: 'Meters saved successfully',
      
      // Ventes
      addSaleTitle: 'Add Sale',
      fuelType: 'Fuel Type',
      volumeSoldInput: 'Volume Sold',
      pricePerLiter: 'Price per Liter',
      calculatedTotal: 'Calculated Total',
      saveSale: 'Save Sale',
      saleSavedSuccess: 'Sale saved successfully',
      
      // TPE et Lavage
      tpeAndWash: 'POS & Car Wash',
      addPosTicket: 'Add POS Ticket',
      addWash: 'Add Car Wash',
      clientName: 'Client Name',
      amount: 'Amount',
      washAmount: 'Car Wash Amount',
      savePosTicket: 'Save POS Ticket',
      saveWash: 'Save Car Wash',
      posTicketSavedSuccess: 'POS ticket saved successfully',
      washSavedSuccess: 'Car wash saved successfully',
      enterAmount: 'Please enter amount',
      
      // Rapport
      dailyReport: 'Daily Report',
      financialSummary: 'Financial Summary',
      generalTotal: 'General Total',
      sales: 'sale(s)',
      tickets: 'ticket(s)',
      washes: 'wash(es)',
      gasolineSalesDetail: 'Gasoline Sales Detail',
      dieselSalesDetail: 'Diesel Sales Detail',
      posTicketsDetail: 'POS Tickets Detail',
      volumesSoldMeters: 'Volumes Sold (Meters)',
      
      // Connexion
      stationManager: 'Station Manager',
      gasStationManagement: 'Gas Station Management',
      email: 'Email',
      password: 'Password',
      signIn: 'Sign In',
      signingIn: 'Signing In...',
      connectionError: 'Connection Error'
    }
  },
  fr: {
    translation: {
      selectLanguage: 'Sélectionner la langue',
      // Navigation et interface générale
      dashboard: 'Tableau de bord',
      compteurs: 'Compteurs',
      ventes: 'Ventes',
      tpe: 'TPE',
      rapport: 'Rapport',
      
      // Dashboard
      welcome: 'Bienvenue',
      dailySummary: 'Résumé du jour',
      quickActions: 'Actions rapides',
      totalDay: 'Total du jour',
      
      // Types de carburant et services
      essence: 'Essence',
      gasoil: 'Gasoil',
      lavage: 'Lavage',
      
      // Actions
      enterMeters: 'Saisir compteurs',
      addSale: 'Ajouter vente',
      posTicket: 'Ticket TPE',
      viewReport: 'Voir rapport',
      
      // Formulaires
      save: 'Enregistrer',
      saving: 'Enregistrement...',
      cancel: 'Annuler',
      
      // Messages
      success: 'Succès',
      error: 'Erreur',
      fillAllFields: 'Veuillez remplir tous les champs',
      
      // Unités
      dh: 'DH',
      liters: 'L',
      
      // Compteurs
      enterMetersTitle: 'Saisie des compteurs',
      previousNumber: 'Numéro précédent',
      currentNumber: 'Numéro actuel',
      volumeSold: 'Volume vendu',
      saveMeters: 'Enregistrer les compteurs',
      pump: 'Pompe',
      metersSavedSuccess: 'Compteurs enregistrés avec succès',
      
      // Ventes
      addSaleTitle: 'Ajouter une vente',
      fuelType: 'Type de carburant',
      volumeSoldInput: 'Volume vendu',
      pricePerLiter: 'Prix par litre',
      calculatedTotal: 'Total calculé',
      saveSale: 'Enregistrer la vente',
      saleSavedSuccess: 'Vente enregistrée avec succès',
      
      // TPE et Lavage
      tpeAndWash: 'TPE & Lavage',
      addPosTicket: 'Ajouter un ticket TPE',
      addWash: 'Ajouter un lavage',
      clientName: 'Nom du client',
      amount: 'Montant',
      washAmount: 'Montant du lavage',
      savePosTicket: 'Enregistrer le ticket TPE',
      saveWash: 'Enregistrer le lavage',
      posTicketSavedSuccess: 'Ticket TPE enregistré avec succès',
      washSavedSuccess: 'Lavage enregistré avec succès',
      enterAmount: 'Veuillez saisir le montant',
      
      // Rapport
      dailyReport: 'Rapport journalier',
      financialSummary: 'Résumé financier',
      generalTotal: 'Total général',
      sales: 'vente(s)',
      tickets: 'ticket(s)',
      washes: 'lavage(s)',
      gasolineSalesDetail: 'Détail des ventes d\'essence',
      dieselSalesDetail: 'Détail des ventes de gasoil',
      posTicketsDetail: 'Détail des tickets TPE',
      volumesSoldMeters: 'Volumes vendus (compteurs)',
      
      // Connexion
      stationManager: 'Station Manager',
      gasStationManagement: 'Gestion de station de gazoil',
      email: 'Email',
      password: 'Mot de passe',
      signIn: 'Se connecter',
      signingIn: 'Connexion...',
      connectionError: 'Erreur de connexion'
    }
  },
  ع: {
    translation: {
      selectLanguage: 'اختر اللغة',
      // Navigation et interface générale
      dashboard: 'لوحة التحكم',
      compteurs: 'العدادات',
      ventes: 'المبيعات',
      tpe: 'نقطة البيع',
      rapport: 'التقرير',
      
      // Dashboard
      welcome: 'مرحباً',
      dailySummary: 'ملخص اليوم',
      quickActions: 'إجراءات سريعة',
      totalDay: 'إجمالي اليوم',
      
      // Types de carburant et services
      essence: 'البنزين',
      gasoil: 'الديزل',
      lavage: 'غسيل السيارات',
      
      // Actions
      enterMeters: 'إدخال العدادات',
      addSale: 'إضافة مبيعة',
      posTicket: 'تذكرة نقطة البيع',
      viewReport: 'عرض التقرير',
      
      // Formulaires
      save: 'حفظ',
      saving: 'جاري الحفظ...',
      cancel: 'إلغاء',
      
      // Messages
      success: 'نجح',
      error: 'خطأ',
      fillAllFields: 'يرجى ملء جميع الحقول',
      
      // Unités
      dh: 'درهم',
      liters: 'لتر',
      
      // Compteurs
      enterMetersTitle: 'إدخال العدادات',
      previousNumber: 'الرقم السابق',
      currentNumber: 'الرقم الحالي',
      volumeSold: 'الكمية المباعة',
      saveMeters: 'حفظ العدادات',
      pump: 'المضخة',
      metersSavedSuccess: 'تم حفظ العدادات بنجاح',
      
      // Ventes
      addSaleTitle: 'إضافة مبيعة',
      fuelType: 'نوع الوقود',
      volumeSoldInput: 'الكمية المباعة',
      pricePerLiter: 'السعر للتر',
      calculatedTotal: 'المجموع المحسوب',
      saveSale: 'حفظ المبيعة',
      saleSavedSuccess: 'تم حفظ المبيعة بنجاح',
      
      // TPE et Lavage
      tpeAndWash: 'نقطة البيع والغسيل',
      addPosTicket: 'إضافة تذكرة نقطة البيع',
      addWash: 'إضافة غسيل',
      clientName: 'اسم العميل',
      amount: 'المبلغ',
      washAmount: 'مبلغ الغسيل',
      savePosTicket: 'حفظ تذكرة نقطة البيع',
      saveWash: 'حفظ الغسيل',
      posTicketSavedSuccess: 'تم حفظ تذكرة نقطة البيع بنجاح',
      washSavedSuccess: 'تم حفظ الغسيل بنجاح',
      enterAmount: 'يرجى إدخال المبلغ',
      
      // Rapport
      dailyReport: 'التقرير اليومي',
      financialSummary: 'الملخص المالي',
      generalTotal: 'المجموع العام',
      sales: 'مبيعة/مبيعات',
      tickets: 'تذكرة/تذاكر',
      washes: 'غسيل/غسلات',
      gasolineSalesDetail: 'تفاصيل مبيعات البنزين',
      dieselSalesDetail: 'تفاصيل مبيعات الديزل',
      posTicketsDetail: 'تفاصيل تذاكر نقطة البيع',
      volumesSoldMeters: 'الكميات المباعة (العدادات)',
      
      // Connexion
      stationManager: 'مدير المحطة',
      gasStationManagement: 'إدارة محطة الوقود',
      email: 'البريد الإلكتروني',
      password: 'كلمة المرور',
      signIn: 'تسجيل الدخول',
      signingIn: 'جاري تسجيل الدخول...',
      connectionError: 'خطأ في الاتصال'
    }
  }
};

// Configuration d'i18next
i18n
  .use(initReactI18next) // Passe i18n vers react-i18next
  .init({
    resources,
    lng: 'fr', // Langue par défaut (français)
    fallbackLng: 'en', // Langue de secours
    
    interpolation: {
      escapeValue: false // React échappe déjà les valeurs
    },
    
    // Configuration pour le développement
    debug: false,
    
    // Configuration des namespaces
    defaultNS: 'translation',
    ns: ['translation']
  });

export default i18n;