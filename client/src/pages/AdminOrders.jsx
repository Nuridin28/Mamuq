import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { FiShoppingBag } from 'react-icons/fi';
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

const statuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

export default function AdminOrders() {
  const { t } = useTranslation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  const fetchOrders = async () => {
    try {
      const params = statusFilter ? { status: statusFilter } : {};
      const response = await api.get('/orders/all', { params });
      setOrders(response.data.orders || response.data || []);
    } catch (err) {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const updateStatus = async (orderId, newStatus) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status: newStatus });
      fetchOrders();
    } catch (err) {
      // Error
    }
  };

  const thStyle = {
    padding: '12px 16px', textAlign: 'left', fontSize: '0.8rem', fontWeight: 600,
    color: '#A0A0A0', borderBottom: '1px solid #3A3A3A', textTransform: 'uppercase',
  };

  const tdStyle = {
    padding: '14px 16px', fontSize: '0.9rem', color: '#E0E0E0', borderBottom: '1px solid #2A2A2A',
  };

  const selectStyle = {
    padding: '8px 14px', background: '#1A1A1A', border: '1px solid #3A3A3A',
    borderRadius: '8px', color: '#E0E0E0', fontSize: '0.85rem', fontFamily: "'Inter', sans-serif",
    cursor: 'pointer', outline: 'none',
  };

  if (loading) return <Loading />;

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 70px)' }}>
      {/* Sidebar */}
      <aside
        style={{ width: '240px', background: '#111111', borderRight: '1px solid #2A2A2A', padding: '30px 16px', flexShrink: 0 }}
        className="admin-sidebar"
      >
        <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FFFFFF', padding: '0 12px', marginBottom: '24px' }}>
          {t('admin.title')}
        </h2>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <Link to="/admin" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', borderRadius: '10px', color: '#A0A0A0', textDecoration: 'none', fontSize: '0.9rem' }}>
            {t('admin.sidebar.dashboard')}
          </Link>
          <Link to="/admin/products" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', borderRadius: '10px', color: '#A0A0A0', textDecoration: 'none', fontSize: '0.9rem' }}>
            {t('admin.sidebar.products')}
          </Link>
          <Link to="/admin/orders" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', borderRadius: '10px', color: '#FF6B00', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600, background: 'rgba(255,107,0,0.1)' }}>
            <FiShoppingBag size={18} /> {t('admin.sidebar.orders')}
          </Link>
        </nav>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, padding: '30px', overflowY: 'auto' }}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FFFFFF' }}>
              {t('admin.orders.title')}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '0.85rem', color: '#A0A0A0' }}>{t('admin.orders.filterByStatus')}:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={selectStyle}
              >
                <option value="">{t('admin.orders.allStatuses')}</option>
                {statuses.map((s) => (
                  <option key={s} value={s}>{t(`orders.statuses.${s}`)}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ background: '#2A2A2A', borderRadius: '14px', border: '1px solid #3A3A3A', overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#1A1A1A' }}>
                    <th style={thStyle}>Order</th>
                    <th style={thStyle}>{t('admin.orders.customerInfo')}</th>
                    <th style={thStyle}>{t('orders.items')}</th>
                    <th style={thStyle}>{t('orders.total')}</th>
                    <th style={thStyle}>{t('orders.status')}</th>
                    <th style={thStyle}>{t('orders.date')}</th>
                    <th style={thStyle}>{t('common.actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length === 0 ? (
                    <tr><td colSpan={7} style={{ ...tdStyle, textAlign: 'center', color: '#666', padding: '30px' }}>{t('common.noResults')}</td></tr>
                  ) : orders.map((order) => {
                    const color = statusColors[order.status] || '#A0A0A0';
                    return (
                      <tr
                        key={order._id || order.id}
                        onMouseEnter={(e) => (e.currentTarget.style.background = '#333333')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                      >
                        <td style={{ ...tdStyle, fontWeight: 600 }}>
                          #{order.orderNumber || order._id?.slice(-6) || '--'}
                        </td>
                        <td style={tdStyle}>
                          <div style={{ fontSize: '0.85rem' }}>{order.user?.name || '--'}</div>
                          <div style={{ fontSize: '0.75rem', color: '#A0A0A0' }}>{order.user?.email || ''}</div>
                        </td>
                        <td style={tdStyle}>{order.items?.length || 0}</td>
                        <td style={{ ...tdStyle, color: '#FF6B00', fontWeight: 600 }}>
                          ${order.totalAmount?.toFixed(2) || '0.00'}
                        </td>
                        <td style={tdStyle}>
                          <span style={{
                            padding: '3px 10px', borderRadius: '12px', fontSize: '0.78rem', fontWeight: 600,
                            background: `${color}18`, color, border: `1px solid ${color}40`,
                          }}>
                            {t(`orders.statuses.${order.status || 'pending'}`)}
                          </span>
                        </td>
                        <td style={{ ...tdStyle, fontSize: '0.85rem', color: '#A0A0A0' }}>
                          {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '--'}
                        </td>
                        <td style={tdStyle}>
                          <select
                            value={order.status || 'pending'}
                            onChange={(e) => updateStatus(order._id || order.id, e.target.value)}
                            style={{
                              ...selectStyle,
                              padding: '6px 10px',
                              fontSize: '0.8rem',
                            }}
                          >
                            {statuses.map((s) => (
                              <option key={s} value={s}>{t(`orders.statuses.${s}`)}</option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </main>

      <style>{`@media (max-width: 768px) { .admin-sidebar { display: none; } }`}</style>
    </div>
  );
}
