import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { FiFilter, FiX, FiSearch } from 'react-icons/fi';
import { useAnalytics } from '../../hooks/useAnalytics';
import Button from '../common/Button';

const categories = ['shirts', 'pants', 'outerwear', 'underwear', 'accessories', 'dresses'];
const fastenerTypes = ['magnetic', 'velcro', 'snaps', 'zipper', 'buttons', 'pullover'];
const neckOptions = ['standard', 'wide', 'extraWide'];

export default function FilterSidebar({ filters, setFilters, onApply }) {
  const { t } = useTranslation();
  const { trackButtonClick } = useAnalytics();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleCategoryChange = (cat) => {
    const current = filters.categories || [];
    const updated = current.includes(cat) ? current.filter((c) => c !== cat) : [...current, cat];
    setFilters({ ...filters, categories: updated });
  };

  const handleFastenerChange = (type) => {
    const current = filters.fastenerTypes || [];
    const updated = current.includes(type) ? current.filter((f) => f !== type) : [...current, type];
    setFilters({ ...filters, fastenerTypes: updated });
  };

  const handleClear = () => {
    trackButtonClick('clear_filters');
    setFilters({ categories: [], fastenerTypes: [], neckWidth: '', wheelchairFriendly: false, search: '', minPrice: '', maxPrice: '' });
  };

  const checkboxStyle = (checked) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '6px 0',
    cursor: 'pointer',
    fontSize: '0.9rem',
    color: checked ? '#FF6B00' : '#E0E0E0',
  });

  const customCheckbox = (checked) => ({
    width: '18px',
    height: '18px',
    borderRadius: '4px',
    border: `2px solid ${checked ? '#FF6B00' : '#3A3A3A'}`,
    background: checked ? '#FF6B00' : 'transparent',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    transition: 'all 0.2s',
  });

  const sectionTitleStyle = {
    fontSize: '0.95rem',
    fontWeight: 700,
    color: '#FFFFFF',
    marginBottom: '12px',
    marginTop: '20px',
  };

  const filterContent = (
    <div style={{ padding: '0' }}>
      {/* Search */}
      <div style={{ position: 'relative', marginBottom: '20px' }}>
        <FiSearch size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#A0A0A0' }} />
        <input
          type="text"
          placeholder={t('common.searchPlaceholder')}
          value={filters.search || ''}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          style={{
            width: '100%',
            padding: '10px 12px 10px 36px',
            background: '#1A1A1A',
            border: '1px solid #3A3A3A',
            borderRadius: '8px',
            color: '#E0E0E0',
            fontSize: '0.9rem',
            outline: 'none',
            fontFamily: "'Inter', sans-serif",
          }}
        />
      </div>

      {/* Categories */}
      <h4 style={sectionTitleStyle}>{t('catalog.categories.title')}</h4>
      {categories.map((cat) => (
        <label key={cat} style={checkboxStyle((filters.categories || []).includes(cat))}>
          <div style={customCheckbox((filters.categories || []).includes(cat))}>
            {(filters.categories || []).includes(cat) && (
              <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            )}
          </div>
          {t(`catalog.categories.${cat}`)}
          <input
            type="checkbox"
            checked={(filters.categories || []).includes(cat)}
            onChange={() => handleCategoryChange(cat)}
            style={{ display: 'none' }}
          />
        </label>
      ))}

      {/* Fastener Types */}
      <h4 style={sectionTitleStyle}>{t('catalog.fastenerTypes.title')}</h4>
      {fastenerTypes.map((type) => (
        <label key={type} style={checkboxStyle((filters.fastenerTypes || []).includes(type))}>
          <div style={customCheckbox((filters.fastenerTypes || []).includes(type))}>
            {(filters.fastenerTypes || []).includes(type) && (
              <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            )}
          </div>
          {t(`catalog.fastenerTypes.${type}`)}
          <input
            type="checkbox"
            checked={(filters.fastenerTypes || []).includes(type)}
            onChange={() => handleFastenerChange(type)}
            style={{ display: 'none' }}
          />
        </label>
      ))}

      {/* Neck Width */}
      <h4 style={sectionTitleStyle}>{t('catalog.neckWidth.title')}</h4>
      {neckOptions.map((opt) => (
        <label key={opt} style={checkboxStyle(filters.neckWidth === opt)}>
          <div
            style={{
              width: '18px',
              height: '18px',
              borderRadius: '50%',
              border: `2px solid ${filters.neckWidth === opt ? '#FF6B00' : '#3A3A3A'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {filters.neckWidth === opt && (
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#FF6B00' }} />
            )}
          </div>
          {t(`catalog.neckWidth.${opt}`)}
          <input
            type="radio"
            name="neckWidth"
            checked={filters.neckWidth === opt}
            onChange={() => setFilters({ ...filters, neckWidth: opt })}
            style={{ display: 'none' }}
          />
        </label>
      ))}

      {/* Wheelchair Friendly */}
      <h4 style={sectionTitleStyle}>{t('catalog.wheelchairFriendly')}</h4>
      <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
        <div
          onClick={() => setFilters({ ...filters, wheelchairFriendly: !filters.wheelchairFriendly })}
          style={{
            width: '44px',
            height: '24px',
            borderRadius: '12px',
            background: filters.wheelchairFriendly ? '#FF6B00' : '#3A3A3A',
            position: 'relative',
            cursor: 'pointer',
            transition: 'background 0.2s',
          }}
        >
          <div
            style={{
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              background: '#FFFFFF',
              position: 'absolute',
              top: '2px',
              left: filters.wheelchairFriendly ? '22px' : '2px',
              transition: 'left 0.2s',
            }}
          />
        </div>
        <span style={{ fontSize: '0.9rem', color: '#E0E0E0' }}>{t('catalog.wheelchairFriendly')}</span>
      </label>

      {/* Price Range */}
      <h4 style={sectionTitleStyle}>{t('catalog.priceRange')}</h4>
      <div style={{ display: 'flex', gap: '10px' }}>
        <input
          type="number"
          placeholder={t('catalog.minPrice')}
          value={filters.minPrice || ''}
          onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
          style={{
            width: '100%', padding: '8px 10px', background: '#1A1A1A', border: '1px solid #3A3A3A',
            borderRadius: '6px', color: '#E0E0E0', fontSize: '0.85rem', outline: 'none', fontFamily: "'Inter', sans-serif",
          }}
        />
        <input
          type="number"
          placeholder={t('catalog.maxPrice')}
          value={filters.maxPrice || ''}
          onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
          style={{
            width: '100%', padding: '8px 10px', background: '#1A1A1A', border: '1px solid #3A3A3A',
            borderRadius: '6px', color: '#E0E0E0', fontSize: '0.85rem', outline: 'none', fontFamily: "'Inter', sans-serif",
          }}
        />
      </div>

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: '10px', marginTop: '28px' }}>
        <Button variant="primary" size="sm" fullWidth onClick={() => { onApply(); setMobileOpen(false); }} trackName="apply_filters">
          {t('catalog.applyFilters')}
        </Button>
        <Button variant="secondary" size="sm" fullWidth onClick={handleClear}>
          {t('catalog.clearFilters')}
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="filter-mobile-btn"
        style={{
          display: 'none',
          alignItems: 'center',
          gap: '8px',
          padding: '10px 20px',
          background: '#2A2A2A',
          border: '1px solid #3A3A3A',
          borderRadius: '8px',
          color: '#E0E0E0',
          cursor: 'pointer',
          fontSize: '0.9rem',
          fontFamily: "'Inter', sans-serif",
          marginBottom: '16px',
        }}
        aria-label={t('accessibility.toggleFilter')}
      >
        <FiFilter size={16} /> {t('catalog.showFilters')}
      </button>

      {/* Desktop sidebar */}
      <div
        className="filter-desktop"
        style={{
          width: '280px',
          flexShrink: 0,
          background: '#2A2A2A',
          borderRadius: '16px',
          padding: '24px',
          border: '1px solid #3A3A3A',
          height: 'fit-content',
          position: 'sticky',
          top: '90px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FiFilter size={18} /> {t('catalog.filters')}
          </h3>
        </div>
        {filterContent}
      </div>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000,
              backdropFilter: 'blur(4px)',
            }}
            onClick={() => setMobileOpen(false)}
          >
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              style={{
                position: 'absolute', left: 0, top: 0, bottom: 0, width: '320px', maxWidth: '85vw',
                background: '#2A2A2A', padding: '24px', overflowY: 'auto',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFFFFF' }}>{t('catalog.filters')}</h3>
                <button
                  onClick={() => setMobileOpen(false)}
                  style={{ background: 'none', border: 'none', color: '#A0A0A0', cursor: 'pointer' }}
                >
                  <FiX size={22} />
                </button>
              </div>
              {filterContent}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 768px) {
          .filter-desktop { display: none !important; }
          .filter-mobile-btn { display: flex !important; }
        }
      `}</style>
    </>
  );
}
