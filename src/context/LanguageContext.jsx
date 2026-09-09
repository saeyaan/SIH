import React, { createContext, useContext, useState, useEffect } from 'react';
import { loadState, saveState } from '../utils/storage';
import { translations } from '../utils/i18n';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [uiLanguage, setUiLanguage] = useState(() => loadState('bhashasetu_ui_lang', 'English'));

  useEffect(() => {
    saveState('bhashasetu_ui_lang', uiLanguage);
  }, [uiLanguage]);

  const t = (key) => {
    const langDict = translations[uiLanguage] || translations['English'];
    return langDict[key] || translations['English'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ uiLanguage, setUiLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
