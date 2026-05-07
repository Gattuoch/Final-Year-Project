import React, { createContext, useState, useEffect, useContext } from 'react';
import en from '../locales/en.json';
import am from '../locales/am.json';
import om from '../locales/om.json';
import api from '../services/api';

const translations = { en, am, om };

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en'); // fallback
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch user's preferred language from backend config
    const fetchLanguage = async () => {
      try {
        const res = await api.get('/sysadmin/config');
        if (res.data && res.data.success && res.data.data.settings?.language) {
          setLanguage(res.data.data.settings.language);
        }
      } catch (error) {
        console.error('Failed to load system language:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    // We only need this fallback check for the system admin part right now, 
    // but globally it doesn't hurt to load the config language.
    fetchLanguage();
  }, []);

  const changeLanguage = (lang) => {
    if (translations[lang]) {
      setLanguage(lang);
    }
  };

  const t = (key, replacements = {}) => {
    const keys = key.split('.');
    let value = translations[language];
    
    let found = true;
    for (const k of keys) {
      if (value && value[k]) {
        value = value[k];
      } else {
        found = false;
        break;
      }
    }

    if (!found) {
        // Fallback to English
        value = translations['en'];
        for (const k of keys) {
            if (value && value[k]) {
                value = value[k];
            } else {
                return key; // return key name if not found in fallback
            }
        }
    }

    // Handle replacements
    if (typeof value === 'string' && replacements) {
        Object.entries(replacements).forEach(([k, v]) => {
            value = value.replace(new RegExp(`{{${k}}}`, 'g'), v);
        });
    }

    return value;
  };


  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t, isLoading }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
