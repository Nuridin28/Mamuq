import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FiGlobe, FiChevronDown } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useAnalytics } from '../../hooks/useAnalytics';

const languages = [
  { code: 'en', label: 'English', short: 'EN' },
  { code: 'ru', label: 'Русский', short: 'RU' },
  { code: 'kz', label: 'Қазақша', short: 'KZ' },
];

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const { trackButtonClick } = useAnalytics();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const current = languages.find((l) => l.code === i18n.language) || languages[0];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (code) => {
    i18n.changeLanguage(code);
    trackButtonClick(`language_switch_${code}`);
    setOpen(false);
  };

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(!open)}
        aria-label="Select language"
        aria-expanded={open}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '8px 12px',
          background: '#2A2A2A',
          border: '1px solid #3A3A3A',
          borderRadius: '8px',
          color: '#E0E0E0',
          cursor: 'pointer',
          fontSize: '0.85rem',
          fontWeight: 500,
          fontFamily: "'Inter', sans-serif",
          transition: 'border-color 0.2s',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#FF6B00')}
        onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#3A3A3A')}
      >
        <FiGlobe size={16} />
        <span>{current.short}</span>
        <FiChevronDown size={14} style={{ transform: open ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            style={{
              position: 'absolute',
              top: 'calc(100% + 6px)',
              right: 0,
              background: '#2A2A2A',
              border: '1px solid #3A3A3A',
              borderRadius: '10px',
              overflow: 'hidden',
              minWidth: '140px',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)',
              zIndex: 100,
            }}
          >
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleSelect(lang.code)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  width: '100%',
                  padding: '10px 14px',
                  background: lang.code === i18n.language ? 'rgba(255, 107, 0, 0.15)' : 'transparent',
                  border: 'none',
                  color: lang.code === i18n.language ? '#FF6B00' : '#E0E0E0',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  fontFamily: "'Inter', sans-serif",
                  textAlign: 'left',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={(e) => {
                  if (lang.code !== i18n.language) e.currentTarget.style.background = '#333333';
                }}
                onMouseLeave={(e) => {
                  if (lang.code !== i18n.language) e.currentTarget.style.background = 'transparent';
                }}
              >
                <span style={{ fontWeight: 600, minWidth: '24px' }}>{lang.short}</span>
                <span>{lang.label}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
