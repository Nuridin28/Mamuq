import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { FiShoppingBag, FiChevronDown, FiChevronUp, FiPackage } from 'react-icons/fi';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';
import api from '../utils/api';

const statusColors = {
  pending: '#F59E0B',
  confirmed: '#3B82F6',
  processing: '#A855F7',
  shipped: '#22C55E',
  delivered: '#22C55E',
  cancelled: '#EF4444',
};

export default function OrdersPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const lang = i18n.language;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get('/orders');
        setOrders(response.data.orders || response.data || []);
      } catch (err) {
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <Loading />;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 24px' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, color: '#FFFFFF', marginBottom: '32px' }}>
          {t('orders.title')}
        </h1>
      </motion.div>

      {orders.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            textAlign: 'center', padding: '60px 20px', background: '#2A2A2A',
            borderRadius: '16px', border: '1px solid #3A3A3A',
          }}
        >
          <FiPackage size={48} color="#3A3A3A" style={{ marginBottom: '16px' }} />
          <p style={{ color: '#A0A0A0', marginBottom: '24px', fontSize: '1rem' }}>
            {t('orders.noOrders')}
          </p>
          <Button variant="primary" icon={FiShoppingBag} onClick={() => navigate('/catalog')} trackName="browse_from_orders">
            {t('orders.browseProducts')}
          </Button>
        </motion.div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {orders.map((order, idx) => {
            const isExpanded = expandedOrder === (order.id || idx);
            const color = statusColors[order.status] || '#A0A0A0';
            return (
              <motion.div
                key={order.id || idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                style={{
                  background: '#2A2A2A',
                  borderRadius: '14px',
                  border: '1px solid #3A3A3A',
                  overflow: 'hidden',
                }}
              >
                <button
                  onClick={() => setExpandedOrder(isExpanded ? null : (order.id || idx))}
                  style={{
                    width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '20px 24px', background: 'none', border: 'none', cursor: 'pointer',
                    fontFamily: "'Inter', sans-serif",
                  }}
                  aria-expanded={isExpanded}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <FiShoppingBag size={20} color="#FF6B00" />
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontSize: '1rem', fontWeight: 700, color: '#FFFFFF' }}>
                        {t('orders.orderNumber', { id: order.orderNumber || order.id?.slice(-6) || idx + 1 })}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#A0A0A0', marginTop: '2px' }}>
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : ''}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <span
                      style={{
                        padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600,
                        background: `${color}18`, color, border: `1px solid ${color}40`,
                      }}
                    >
                      {t(`orders.statuses.${order.status || 'pending'}`)}
                    </span>
                    <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFFFFF' }}>
                      ${parseFloat(order.totalPrice || 0).toFixed(2)}
                    </span>
                    {isExpanded ? <FiChevronUp size={20} color="#A0A0A0" /> : <FiChevronDown size={20} color="#A0A0A0" />}
                  </div>
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      style={{ overflow: 'hidden' }}
                    >
                      <div style={{ padding: '0 24px 24px', borderTop: '1px solid #333' }}>
                        <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#FFFFFF', margin: '16px 0 12px' }}>
                          {t('orders.items')}
                        </h4>
                        {(order.items || []).map((item, itemIdx) => {
                          const itemName = item.product
                            ? ((lang === 'ru' ? item.product.nameRu : lang === 'kz' ? item.product.nameKz : item.product.nameEn) || item.product.nameEn || `#${item.productId}`)
                            : (item.productId ? `#${item.productId}` : 'Product');
                          return (
                            <div
                              key={itemIdx}
                              style={{
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                padding: '10px 0', borderBottom: itemIdx < (order.items || []).length - 1 ? '1px solid #333' : 'none',
                              }}
                            >
                              <div>
                                <span style={{ fontSize: '0.9rem', color: '#E0E0E0' }}>{itemName}</span>
                                {item.size && (
                                  <span style={{ fontSize: '0.8rem', color: '#A0A0A0', marginLeft: '8px' }}>
                                    ({item.size.toUpperCase()})
                                  </span>
                                )}
                              </div>
                              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.85rem', color: '#A0A0A0' }}>
                                  {t('orders.quantity')}: {item.quantity || 1}
                                </span>
                                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#FF6B00' }}>
                                  ${parseFloat(item.price || item.product?.basePrice || 0).toFixed(2)}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
