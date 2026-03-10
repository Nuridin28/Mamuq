import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiShoppingCart, FiCheck, FiX, FiSliders } from 'react-icons/fi';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';
import api from '../utils/api';
import { useAnalytics } from '../hooks/useAnalytics';
import { useCart } from '../context/CartContext';

export default function ProductPage() {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { trackButtonClick } = useAnalytics();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [showCustomization, setShowCustomization] = useState(false);
  const [customization, setCustomization] = useState({ fastener: '', sleeveLength: '', seamType: '', notes: '' });
  const [addedToCart, setAddedToCart] = useState(false);

  const lang = i18n.language;

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/products/${id}`);
        setProduct(response.data);
      } catch (err) {
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    trackButtonClick('add_to_cart', `/product/${id}`);
    addToCart(product, selectedSize, customization);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2500);
  };

  if (loading) return <Loading />;

  if (!product) {
    return (
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '80px 24px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.5rem', color: '#A0A0A0' }}>{t('product.notFound')}</h2>
        <Button variant="outline" onClick={() => navigate('/catalog')} style={{ marginTop: '20px' }} icon={FiArrowLeft}>
          {t('product.backToCatalog')}
        </Button>
      </div>
    );
  }

  const name = lang === 'ru' ? (product.nameRu || product.nameEn) : lang === 'kz' ? (product.nameKz || product.nameEn) : (product.nameEn || '');
  const description = lang === 'ru' ? (product.descriptionRu || product.descriptionEn) : lang === 'kz' ? (product.descriptionKz || product.descriptionEn) : (product.descriptionEn || '');

  const productSizes = product.sizes || ['xs', 's', 'm', 'l', 'xl', 'xxl'];

  const featureItem = (label, value, isBoolean = false) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #333' }}>
      <span style={{ fontSize: '0.9rem', color: '#A0A0A0' }}>{label}</span>
      <span style={{ fontSize: '0.9rem', color: '#FFFFFF', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '6px' }}>
        {isBoolean ? (
          value ? <FiCheck size={16} color="#22C55E" /> : <FiX size={16} color="#EF4444" />
        ) : (
          value || '--'
        )}
      </span>
    </div>
  );

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 24px' }}>
      <button
        onClick={() => navigate('/catalog')}
        style={{
          display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none',
          color: '#A0A0A0', cursor: 'pointer', fontSize: '0.9rem', marginBottom: '30px',
          fontFamily: "'Inter', sans-serif",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = '#FF6B00')}
        onMouseLeave={(e) => (e.currentTarget.style.color = '#A0A0A0')}
      >
        <FiArrowLeft size={18} /> {t('product.backToCatalog')}
      </button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '50px',
          alignItems: 'start',
        }}
        className="product-grid"
      >
        {/* Image area */}
        <div
          style={{
            background: product.imageUrl ? `url(${product.imageUrl}) center/cover` : 'linear-gradient(135deg, #FF6B00 0%, #CC5500 100%)',
            borderRadius: '16px',
            aspectRatio: '1',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '300px',
          }}
        >
          {!product.imageUrl && (
            <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '6rem', fontWeight: 800 }}>
              {name.charAt(0)}
            </span>
          )}
        </div>

        {/* Product details */}
        <div>
          <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, color: '#FFFFFF', marginBottom: '10px' }}>
            {name}
          </h1>

          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#FF6B00', marginBottom: '20px' }}>
            ${parseFloat(product.basePrice || 0).toFixed(2)}
          </div>

          {/* Suitability score */}
          {product.suitabilityScore !== undefined && (
            <div style={{ marginBottom: '24px', padding: '16px', background: '#2A2A2A', borderRadius: '12px', border: '1px solid #3A3A3A' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.9rem', color: '#E0E0E0', fontWeight: 500 }}>{t('product.suitabilityScore')}</span>
                <span style={{ fontSize: '0.9rem', fontWeight: 700, color: product.suitabilityScore >= 70 ? '#22C55E' : product.suitabilityScore >= 40 ? '#F59E0B' : '#EF4444' }}>
                  {product.suitabilityScore}%
                </span>
              </div>
              <div style={{ height: '6px', background: '#3A3A3A', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{
                  height: '100%', width: `${product.suitabilityScore}%`, borderRadius: '3px',
                  background: product.suitabilityScore >= 70 ? '#22C55E' : product.suitabilityScore >= 40 ? '#F59E0B' : '#EF4444',
                }} />
              </div>
              <p style={{ fontSize: '0.8rem', color: '#A0A0A0', marginTop: '8px' }}>
                {product.suitabilityScore >= 70 ? t('product.suitabilityHigh') : product.suitabilityScore >= 40 ? t('product.suitabilityMedium') : t('product.suitabilityLow')}
              </p>
            </div>
          )}

          {/* Description */}
          <p style={{ fontSize: '0.95rem', color: '#A0A0A0', lineHeight: 1.7, marginBottom: '24px' }}>
            {description}
          </p>

          {/* Features */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '12px' }}>
              {t('product.features')}
            </h3>
            {featureItem(
              t('product.fastenerType'),
              product.fastenerTypes && product.fastenerTypes.length > 0
                ? product.fastenerTypes.map((ft) => t(`catalog.fastenerTypes.${ft}`)).join(', ')
                : null
            )}
            {featureItem(t('product.neckWidth'), product.neckWidth ? t(`catalog.neckWidth.${product.neckWidth}`) : null)}
            {featureItem(t('product.sleeveType'), product.sleeveType)}
            {featureItem(t('product.wheelchairFriendly'), product.suitableForWheelchair, true)}
            {featureItem(t('product.softSeams'), product.hasSoftSeams, true)}
            {product.fabricType && featureItem(t('product.fabricType'), product.fabricType)}
          </div>

          {/* Size selector */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#FFFFFF', marginBottom: '10px' }}>
              {t('product.size')}
            </h3>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {productSizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  style={{
                    padding: '10px 18px',
                    borderRadius: '8px',
                    border: `2px solid ${selectedSize === size ? '#FF6B00' : '#3A3A3A'}`,
                    background: selectedSize === size ? 'rgba(255, 107, 0, 0.12)' : 'transparent',
                    color: selectedSize === size ? '#FF6B00' : '#E0E0E0',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    fontFamily: "'Inter', sans-serif",
                    textTransform: 'uppercase',
                  }}
                >
                  {t(`product.sizes.${size}`, size.toUpperCase())}
                </button>
              ))}
            </div>
          </div>

          {/* Customization toggle */}
          <button
            onClick={() => setShowCustomization(!showCustomization)}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none',
              color: '#FF6B00', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 500, marginBottom: '16px',
              fontFamily: "'Inter', sans-serif",
            }}
          >
            <FiSliders size={16} /> {t('product.customization.title')}
          </button>

          {showCustomization && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              style={{ background: '#2A2A2A', borderRadius: '12px', padding: '20px', marginBottom: '20px', border: '1px solid #3A3A3A' }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', color: '#A0A0A0', display: 'block', marginBottom: '6px' }}>
                    {t('product.customization.fastener')}
                  </label>
                  <select
                    value={customization.fastener}
                    onChange={(e) => setCustomization({ ...customization, fastener: e.target.value })}
                    style={{
                      width: '100%', padding: '10px', background: '#1A1A1A', border: '1px solid #3A3A3A',
                      borderRadius: '8px', color: '#E0E0E0', fontSize: '0.9rem', fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    <option value="">{t('product.selectSize')}</option>
                    {(product.fastenerTypes || ['magnetic', 'velcro', 'snaps', 'zipper', 'buttons']).map((f) => (
                      <option key={f} value={f}>{t(`catalog.fastenerTypes.${f}`)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', color: '#A0A0A0', display: 'block', marginBottom: '6px' }}>
                    {t('product.customization.notes')}
                  </label>
                  <textarea
                    value={customization.notes}
                    onChange={(e) => setCustomization({ ...customization, notes: e.target.value })}
                    placeholder={t('product.customization.notesPlaceholder')}
                    rows={3}
                    style={{
                      width: '100%', padding: '10px', background: '#1A1A1A', border: '1px solid #3A3A3A',
                      borderRadius: '8px', color: '#E0E0E0', fontSize: '0.9rem', resize: 'vertical',
                      fontFamily: "'Inter', sans-serif",
                    }}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Added to cart notification */}
          {addedToCart && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{
                padding: '12px 16px',
                background: 'rgba(34, 197, 94, 0.15)',
                border: '1px solid rgba(34, 197, 94, 0.3)',
                borderRadius: '10px',
                color: '#22C55E',
                fontSize: '0.9rem',
                fontWeight: 500,
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <FiCheck size={18} /> {t('cart.addedToCart')}
            </motion.div>
          )}

          <Button
            variant="primary"
            size="lg"
            fullWidth
            icon={FiShoppingCart}
            onClick={handleAddToCart}
            trackName="add_to_cart"
          >
            {t('product.addToCart')}
          </Button>
        </div>
      </motion.div>

      <style>{`
        @media (max-width: 768px) {
          .product-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
