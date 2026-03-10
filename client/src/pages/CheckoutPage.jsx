import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { FiShoppingBag, FiCheck } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useAnalytics } from '../hooks/useAnalytics';
import Button from '../components/common/Button';
import api from '../utils/api';

export default function CheckoutPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { cartItems, cartTotal, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { trackButtonClick } = useAnalytics();
  const lang = i18n.language;

  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const getProductName = (product) => {
    if (!product) return 'Product';
    const langKey = lang === 'ru' ? 'nameRu' : lang === 'kz' ? 'nameKz' : 'nameEn';
    return product[langKey] || product.nameEn || '';
  };

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  if (cartItems.length === 0 && !success) {
    navigate('/cart');
    return null;
  }

  const handleAddressChange = (field) => (e) => {
    setAddress((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handlePlaceOrder = async () => {
    trackButtonClick('place_order', '/checkout');
    setLoading(true);
    setError('');
    try {
      await api.post('/orders', {
        items: cartItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          customizations: item.customizations || {},
        })),
        shippingAddress: address,
      });
      clearCart();
      setSuccess(true);
      setTimeout(() => navigate('/orders'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    background: '#1A1A1A',
    border: '1px solid #3A3A3A',
    borderRadius: '10px',
    color: '#E0E0E0',
    fontSize: '0.95rem',
    fontFamily: "'Inter', sans-serif",
    outline: 'none',
    transition: 'border-color 0.2s',
  };

  const labelStyle = {
    fontSize: '0.85rem',
    color: '#A0A0A0',
    display: 'block',
    marginBottom: '6px',
    fontWeight: 500,
  };

  if (success) {
    return (
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '80px 24px', textAlign: 'center' }}>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', duration: 0.5 }}
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'rgba(34, 197, 94, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
          }}
        >
          <FiCheck size={40} color="#22C55E" />
        </motion.div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '12px' }}>
          {t('checkout.success')}
        </h2>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 24px' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, color: '#FFFFFF', marginBottom: '32px' }}>
          {t('checkout.title')}
        </h1>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', alignItems: 'start' }} className="checkout-grid">
        {/* Shipping Address Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          style={{
            background: '#2A2A2A',
            borderRadius: '14px',
            border: '1px solid #3A3A3A',
            padding: '24px',
          }}
        >
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '20px' }}>
            {t('checkout.shippingAddress')}
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={labelStyle}>{t('checkout.street')}</label>
              <input
                type="text"
                value={address.street}
                onChange={handleAddressChange('street')}
                style={inputStyle}
                onFocus={(e) => (e.currentTarget.style.borderColor = '#FF6B00')}
                onBlur={(e) => (e.currentTarget.style.borderColor = '#3A3A3A')}
                required
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={labelStyle}>{t('checkout.city')}</label>
                <input
                  type="text"
                  value={address.city}
                  onChange={handleAddressChange('city')}
                  style={inputStyle}
                  onFocus={(e) => (e.currentTarget.style.borderColor = '#FF6B00')}
                  onBlur={(e) => (e.currentTarget.style.borderColor = '#3A3A3A')}
                  required
                />
              </div>
              <div>
                <label style={labelStyle}>{t('checkout.state')}</label>
                <input
                  type="text"
                  value={address.state}
                  onChange={handleAddressChange('state')}
                  style={inputStyle}
                  onFocus={(e) => (e.currentTarget.style.borderColor = '#FF6B00')}
                  onBlur={(e) => (e.currentTarget.style.borderColor = '#3A3A3A')}
                />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={labelStyle}>{t('checkout.zipCode')}</label>
                <input
                  type="text"
                  value={address.zipCode}
                  onChange={handleAddressChange('zipCode')}
                  style={inputStyle}
                  onFocus={(e) => (e.currentTarget.style.borderColor = '#FF6B00')}
                  onBlur={(e) => (e.currentTarget.style.borderColor = '#3A3A3A')}
                  required
                />
              </div>
              <div>
                <label style={labelStyle}>{t('checkout.country')}</label>
                <input
                  type="text"
                  value={address.country}
                  onChange={handleAddressChange('country')}
                  style={inputStyle}
                  onFocus={(e) => (e.currentTarget.style.borderColor = '#FF6B00')}
                  onBlur={(e) => (e.currentTarget.style.borderColor = '#3A3A3A')}
                  required
                />
              </div>
            </div>
            <div>
              <label style={labelStyle}>{t('checkout.phone')}</label>
              <input
                type="tel"
                value={address.phone}
                onChange={handleAddressChange('phone')}
                style={inputStyle}
                onFocus={(e) => (e.currentTarget.style.borderColor = '#FF6B00')}
                onBlur={(e) => (e.currentTarget.style.borderColor = '#3A3A3A')}
                required
              />
            </div>
          </div>
        </motion.div>

        {/* Order Summary */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          style={{
            background: '#2A2A2A',
            borderRadius: '14px',
            border: '1px solid #3A3A3A',
            padding: '24px',
          }}
        >
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '20px' }}>
            {t('checkout.orderSummary')}
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
            {cartItems.map((item, idx) => (
              <div
                key={item.productId}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 0',
                  borderBottom: idx < cartItems.length - 1 ? '1px solid #333' : 'none',
                }}
              >
                <div>
                  <span style={{ fontSize: '0.9rem', color: '#E0E0E0' }}>
                    {getProductName(item.product)}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: '#A0A0A0', marginLeft: '8px' }}>
                    x{item.quantity}
                  </span>
                </div>
                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#FF6B00' }}>
                  ${(parseFloat(item.product?.basePrice || 0) * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div style={{ borderTop: '2px solid #3A3A3A', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFFFFF' }}>
              {t('cart.total')}
            </span>
            <span style={{ fontSize: '1.3rem', fontWeight: 800, color: '#FF6B00' }}>
              ${cartTotal.toFixed(2)}
            </span>
          </div>

          {error && (
            <div style={{ padding: '12px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px', color: '#EF4444', fontSize: '0.9rem', marginBottom: '16px' }}>
              {error}
            </div>
          )}

          <Button
            variant="primary"
            size="lg"
            fullWidth
            icon={FiShoppingBag}
            onClick={handlePlaceOrder}
            loading={loading}
            trackName="place_order"
            disabled={!address.street || !address.city || !address.country || !address.phone}
          >
            {loading ? t('checkout.processing') : t('checkout.placeOrder')}
          </Button>
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .checkout-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
