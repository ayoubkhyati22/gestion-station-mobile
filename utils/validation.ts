// Validation utilities for forms and data

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateRequired = (value: string): boolean => {
  return value.trim().length > 0;
};

export const validateNumeric = (value: string): boolean => {
  return !isNaN(parseFloat(value)) && isFinite(parseFloat(value));
};

export const validatePositiveNumber = (value: string): boolean => {
  const num = parseFloat(value);
  return validateNumeric(value) && num > 0;
};

export const validateCompteurData = (compteur: { numero_precedent: number; numero_actuel: number }): string | null => {
  if (compteur.numero_actuel < compteur.numero_precedent) {
    return 'Le numéro actuel ne peut pas être inférieur au numéro précédent';
  }
  return null;
};

export const validateVenteData = (volume: string, prixParLitre: string): string | null => {
  if (!validateRequired(volume) || !validateRequired(prixParLitre)) {
    return 'Tous les champs sont requis';
  }
  
  if (!validatePositiveNumber(volume) || !validatePositiveNumber(prixParLitre)) {
    return 'Les valeurs doivent être des nombres positifs';
  }
  
  return null;
};

export const validateTPEData = (nomClient: string, montant: string): string | null => {
  if (!validateRequired(nomClient) || !validateRequired(montant)) {
    return 'Tous les champs sont requis';
  }
  
  if (!validatePositiveNumber(montant)) {
    return 'Le montant doit être un nombre positif';
  }
  
  return null;
};