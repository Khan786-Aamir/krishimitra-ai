import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enTranslation from './locales/en.json';

const resources = {
  en: {
    translation: enTranslation
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    }
  });

// Dynamic resource bundle loader
export const changeLanguage = async (lng) => {
  if (!i18n.hasResourceBundle(lng, 'translation')) {
    try {
      let translation;
      switch (lng) {
        case 'hi': translation = (await import('./locales/hi.json')).default; break;
        case 'bn': translation = (await import('./locales/bn.json')).default; break;
        case 'mr': translation = (await import('./locales/mr.json')).default; break;
        case 'te': translation = (await import('./locales/te.json')).default; break;
        case 'ta': translation = (await import('./locales/ta.json')).default; break;
        case 'gu': translation = (await import('./locales/gu.json')).default; break;
        case 'kn': translation = (await import('./locales/kn.json')).default; break;
        case 'ml': translation = (await import('./locales/ml.json')).default; break;
        case 'pa': translation = (await import('./locales/pa.json')).default; break;
        default: translation = {}; break;
      }
      if (translation && Object.keys(translation).length > 0) {
        i18n.addResourceBundle(lng, 'translation', translation, true, true);
      }
    } catch (err) {
      console.error(`Error loading translations for language ${lng}:`, err);
    }
  }
  await i18n.changeLanguage(lng);
};

// Initial load check for detected language
const detectedLng = i18n.language || 'en';
const baseLng = detectedLng.split('-')[0]; // handle variants like en-US
const popularLangs = ['hi', 'bn', 'mr', 'te', 'ta', 'gu', 'kn', 'ml', 'pa'];

if (popularLangs.includes(baseLng)) {
  changeLanguage(baseLng);
} else if (detectedLng !== 'en') {
  // If browser detected variant is supported
  if (popularLangs.includes(detectedLng)) {
    changeLanguage(detectedLng);
  }
}

export default i18n;
