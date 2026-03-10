import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { FiTrash2, FiPlus, FiMinus, FiShoppingCart, FiArrowRight } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useAnalytics } from '../hooks/useAnalytics';
import Button from '../components/common/Button';

export default function CartPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();
  const { trackButtonClick } = useAnalytics();
  const lang = i18n.language;

  const getProductName = (product) => {
    if (!product) return 'Product';
    const langKey = lang === 'ru' ? 'nameRu' : lang === 'kz' ? 'nameKz' : 'nameEn';
    return product[langKey] || product.nameEn || '';
  };

  const handleCheckout = () => {
    trackButtonClick('proceed_to_checkout', '/cart');
    navigate('/checkout');
  };

  if (cartItems.length === 0) {
    return (
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 24px' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            textAlign: 'center',
            padding: '60px 20px',
            background: '#2A2A2A',
            borderRadius: '16px',
            border: '1px solid #3A3A3A',
          }}
        >
          <FiShoppingCart size={48} color="#3A3A3A" style={{ marginBottom: '16px' }} />
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '12px' }}>
            {t('cart.title')}
          </h2>
          <p style={{ color: '#A0A0A0', marginBottom: '24px', fontSize: '1rem' }}>
            {t('cart.empty')}
          </p>
          <Button variant="primary" icon={FiShoppingCart} onClick={() => navigate('/catalog')} trackName="continue_shopping">
            {t('cart.continueShopping')}
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 24px' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, color: '#FFFFFF', marginBottom: '32px' }}>
          {t('cart.title')}
        </h1>
      </motion.div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
        <AnimatePresence>
          {cartItems.map((item, idx) => (
            <motion.div
              key={item.productId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ delay: idx * 0.05 }}
              style={{
                background: '#2A2A2A',
                borderRadius: '14px',
                border: '1px solid #3A3A3A',
                padding: '20px 24px',
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
              }}
            >
              {/* Product image */}
              <div
                style={{
                  width: '70px',
                  height: '70px',
                  borderRadius: '10px',
                  flexShrink: 0,
                  background: item.product?.imageUrl
                    ? `url(${item.product.imageUrl}) center/cover`
                    : 'linear-gradient(135deg, #FF6B00 0%, #CC5500 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {!item.product?.imageUrl && (
                  <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '1.5rem', fontWeight: 800 }}>
                    {getProductName(item.product).charAt(0)}
                  </span>
                )}
              </div>

              {/* Product info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '4px' }}>
                  {getProductName(item.product)}
                </h3>
                {item.size && (
                  <span style={{ fontSize: '0.8rem', color: '#A0A0A0' }}>
                    {t('product.size')}: {item.size.toUpperCase()}
                  </span>
                )}
              </div>

              {/* Quantity controls */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button
                  onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    border: '1px solid #3A3A3A',
                    background: 'transparent',
                    color: item.quantity <= 1 ? '#555' : '#E0E0E0',
                    cursor: item.quantity <= 1 ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <FiMinus size={14} />
                </button>
                <span style={{ fontSize: '1rem', fontWeight: 600, color: '#FFFFFF', minWidth: '24px', textAlign: 'center' }}>
                  {item.quantity}
                </span>
                <button
                  onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    border: '1px solid #3A3A3A',
                    background: 'transparent',
                    color: '#E0E0E0',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <FiPlus size={14} />
                </button>
              </div>

              {/* Price */}
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FF6B00', minWidth: '80px', textAlign: 'right' }}>
                ${(parseFloat(item.product?.basePrice || 0) * item.quantity).toFixed(2)}
              </div>

              {/* Remove button */}
              <button
                onClick={() => {
                  trackButtonClick('remove_from_cart', '/cart');
                  removeFromCart(item.productId);
                }}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  border: 'none',
                  background: 'rgba(239, 68, 68, 0.1)',
                  color: '#EF4444',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)')}
                aria-label={t('cart.remove')}
              >
                <FiTrash2 size={16} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Cart total and checkout */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{
          background: '#2A2A2A',
          borderRadius: '14px',
          border: '1px solid #3A3A3A',
          padding: '24px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <span style={{ fontSize: '1.2rem', fontWeight: 700, color: '#FFFFFF' }}>
            {t('cart.total')}
          </span>
          <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FF6B00' }}>
            ${cartTotal.toFixed(2)}
          </span>
        </div>
        <Button
          variant="primary"
          size="lg"
          fullWidth
          icon={FiArrowRight}
          onClick={handleCheckout}
          trackName="proceed_to_checkout"
        >
          {t('cart.checkout')}
        </Button>
      </motion.div>
    </div>
  );
}
