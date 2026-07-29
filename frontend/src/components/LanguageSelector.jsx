import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, Search, Check } from 'lucide-react';
import { changeLanguage } from '../i18n';
import { motion, AnimatePresence } from 'framer-motion';

const popularLangs = [
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇧🇩' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', flag: '🇮🇳' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', flag: '🇮🇳' }
];

const otherLangs = [
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', flag: '🇵🇰' },
  { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া', flag: '🇮🇳' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', flag: '🇮🇳' },
  { code: 'sa', name: 'Sanskrit', nativeName: 'संस्कृतम्', flag: '🇮🇳' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷' },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', flag: '🇳🇱' },
  { code: 'sv', name: 'Swedish', nativeName: 'Svenska', flag: '🇸🇪' },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', flag: '🇮🇩' },
  { code: 'th', name: 'Thai', nativeName: 'ไทย', flag: '🇹🇭' },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'he', name: 'Hebrew', nativeName: 'עברית', flag: '🇮🇱' },
  { code: 'pl', name: 'Polish', nativeName: 'Polski', flag: '🇵🇱' },
  { code: 'fa', name: 'Persian', nativeName: 'فارسی', flag: '🇮🇷' },
  { code: 'uk', name: 'Ukrainian', nativeName: 'Українська', flag: '🇺🇦' }
];

export const LanguageSelector = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef(null);

  const currentLanguage = i18n.language || 'en';

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectLanguage = (code) => {
    changeLanguage(code);
    setIsOpen(false);
  };

  const filteredPopular = popularLangs.filter(
    (l) =>
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.nativeName.toLowerCase().includes(search.toLowerCase())
  );

  const filteredOther = otherLangs.filter(
    (l) =>
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.nativeName.toLowerCase().includes(search.toLowerCase())
  );

  const activeLangDetails = [...popularLangs, ...otherLangs].find(
    (l) => l.code === currentLanguage.split('-')[0]
  ) || { flag: '🌐', nativeName: 'Language' };

  return (
    <div className="relative z-[99]" ref={dropdownRef}>
      {/* Globe Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 p-2 bg-card/60 hover:bg-surface border border-border/80 rounded-xl transition-all cursor-pointer text-text hover:text-white"
        aria-label="Select Language"
      >
        <Globe className="w-4 h-4 text-primary shrink-0" />
        <span className="text-xs font-bold uppercase tracking-wider hidden md:inline">
          {activeLangDetails.flag} {activeLangDetails.nativeName}
        </span>
      </button>

      {/* Language Selection Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-72 max-h-[380px] bg-card-dark/95 border border-border-dark rounded-2xl shadow-2xl backdrop-blur-md overflow-hidden flex flex-col z-[99]"
          >
            {/* Search Input Container */}
            <div className="p-3 border-b border-border-dark flex items-center gap-2 bg-surface/30">
              <Search className="w-3.5 h-3.5 text-text/40 shrink-0" />
              <input
                type="text"
                placeholder="Search language / भाषा खोजें..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-transparent text-xs text-text placeholder-text/30 border-none outline-none focus:ring-0 font-medium"
              />
            </div>

            {/* Scrollable Language Options */}
            <div className="flex-1 overflow-y-auto p-2 space-y-3.5">
              
              {/* Popular Languages Group */}
              {filteredPopular.length > 0 && (
                <div className="space-y-1">
                  <span className="block text-[9px] uppercase font-bold text-primary tracking-wider px-2.5 pb-1">
                    Popular Languages
                  </span>
                  <div className="grid grid-cols-2 gap-1">
                    {filteredPopular.map((lang) => {
                      const isActive = currentLanguage.split('-')[0] === lang.code;
                      return (
                        <button
                          key={lang.code}
                          onClick={() => handleSelectLanguage(lang.code)}
                          className={`flex items-center justify-between p-2 rounded-xl text-left transition-all text-xs font-bold cursor-pointer border ${
                            isActive
                              ? 'bg-primary/10 border-primary text-primary'
                              : 'bg-surface/30 hover:bg-surface border-transparent text-text-muted hover:text-text'
                          }`}
                        >
                          <span className="truncate flex items-center gap-1.5">
                            <span className="text-base shrink-0">{lang.flag}</span>
                            <span className="truncate">{lang.nativeName}</span>
                          </span>
                          {isActive && <Check className="w-3.5 h-3.5 text-primary shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Other Languages Group */}
              {filteredOther.length > 0 && (
                <div className="space-y-1 border-t border-border-dark/40 pt-2.5">
                  <span className="block text-[9px] uppercase font-bold text-indigo-400 tracking-wider px-2.5 pb-1">
                    Other Languages
                  </span>
                  <div className="grid grid-cols-2 gap-1">
                    {filteredOther.map((lang) => {
                      const isActive = currentLanguage.split('-')[0] === lang.code;
                      return (
                        <button
                          key={lang.code}
                          onClick={() => handleSelectLanguage(lang.code)}
                          className={`flex items-center justify-between p-2 rounded-xl text-left transition-all text-xs font-bold cursor-pointer border ${
                            isActive
                              ? 'bg-primary/10 border-primary text-primary'
                              : 'bg-surface/30 hover:bg-surface border-transparent text-text-muted hover:text-text'
                          }`}
                        >
                          <span className="truncate flex items-center gap-1.5">
                            <span className="text-base shrink-0">{lang.flag}</span>
                            <span className="truncate">{lang.nativeName}</span>
                          </span>
                          {isActive && <Check className="w-3.5 h-3.5 text-primary shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {filteredPopular.length === 0 && filteredOther.length === 0 && (
                <div className="text-center py-6 text-xs text-text/30 font-semibold">
                  No languages found / भाषा नहीं मिली
                </div>
              )}

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LanguageSelector;
