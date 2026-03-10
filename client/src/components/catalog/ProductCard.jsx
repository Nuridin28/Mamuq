import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';
import { useAnalytics } from '../../hooks/useAnalytics';

const gradients = [
  'linear-gradient(135deg, #FF6B00 0%, #FF8C40 100%)',
  'linear-gradient(135deg, #2A2A2A 0%, #444444 100%)',
  'linear-gradient(135deg, #FF6B00 0%, #CC5500 100%)',
  'linear-gradient(135deg, #333333 0%, #555555 100%)',
];

export default function ProductCard({ product, index = 0 }) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { trackButtonClick } = useAnalytics();
  const lang = i18n.language;

  const name = (lang === 'ru' ? product.nameRu : lang === 'kz' ? product.nameKz : product.nameEn) || product.nameEn || 'Product';
  const gradient = gradients[index % gradients.length];

  const handleClick = () => {
    trackButtonClick('view_product_details', '/catalog');
    navigate(`/product/${product._id || product.id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -8, boxShadow: '0 12px 40px rgba(255, 107, 0, 0.15)' }}
      style={{
        background: '#2A2A2A',
        borderRadius: '16px',
        overflow: 'hidden',
        border: '1px solid #3A3A3A',
        cursor: 'pointer',
        transition: 'border-color 0.3s',
      }}
      onClick={handleClick}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#FF6B00')}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#3A3A3A')}
    >
      {/* Image placeholder */}
      <div
        style={{
          height: '200px',
          background: product.imageUrl ? `url(${product.imageUrl}) center/cover` : gradient,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        {!product.imageUrl && (
          <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '3rem', fontWeight: 800 }}>
            {name.charAt(0)}
          </span>
        )}
        {product.suitableForWheelchair && (
          <span
            style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              background: '#FF6B00',
              color: '#FFFFFF',
              fontSize: '0.7rem',
              fontWeight: 600,
              padding: '4px 10px',
              borderRadius: '20px',
            }}
          >
            {t('catalog.wheelchairBadge')}
          </span>
        )}
      </div>

      <div style={{ padding: '20px' }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '8px' }}>
          {name}
        </h3>

        <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FF6B00', marginBottom: '12px' }}>
          ${parseFloat(product.basePrice || 0).toFixed(2)}
        </div>

        {/* Feature tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
          {product.fastenerTypes && product.fastenerTypes.length > 0 && (
            <span
              style={{
                fontSize: '0.7rem',
                padding: '3px 8px',
                borderRadius: '4px',
                background: 'rgba(255, 107, 0, 0.12)',
                color: '#FF6B00',
                fontWeight: 500,
              }}
            >
              {t(`catalog.fastenerTypes.${product.fastenerTypes[0]}`) || product.fastenerTypes[0]}
            </span>
          )}
          {product.category && (
            <span
              style={{
                fontSize: '0.7rem',
                padding: '3px 8px',
                borderRadius: '4px',
                background: 'rgba(255, 255, 255, 0.08)',
                color: '#A0A0A0',
                fontWeight: 500,
              }}
            >
              {t(`catalog.categories.${product.category}`) || product.category}
            </span>
          )}
        </div>

        {product.suitabilityScore !== undefined && (
          <div style={{ marginBottom: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ fontSize: '0.75rem', color: '#A0A0A0' }}>{t('catalog.suitabilityScore')}</span>
              <span style={{ fontSize: '0.75rem', color: '#FF6B00', fontWeight: 600 }}>{product.suitabilityScore}%</span>
            </div>
            <div style={{ height: '4px', background: '#3A3A3A', borderRadius: '2px', overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  width: `${product.suitabilityScore}%`,
                  background: product.suitabilityScore >= 70 ? '#22C55E' : product.suitabilityScore >= 40 ? '#F59E0B' : '#EF4444',
                  borderRadius: '2px',
                  transition: 'width 0.5s ease',
                }}
              />
            </div>
          </div>
        )}

        <button
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            width: '100%',
            padding: '10px',
            background: 'transparent',
            border: '1px solid #FF6B00',
            borderRadius: '8px',
            color: '#FF6B00',
            cursor: 'pointer',
            fontSize: '0.85rem',
            fontWeight: 600,
            fontFamily: "'Inter', sans-serif",
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#FF6B00';
            e.currentTarget.style.color = '#FFFFFF';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = '#FF6B00';
          }}
          onClick={(e) => {
            e.stopPropagation();
            handleClick();
          }}
        >
          {t('catalog.viewDetails')} <FiArrowRight size={14} />
        </button>
      </div>
    </motion.div>
  );
}
