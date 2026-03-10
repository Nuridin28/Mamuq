import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { FiUsers, FiActivity, FiShoppingBag, FiDollarSign } from 'react-icons/fi';

const statConfigs = [
  { key: 'totalUsers', icon: FiUsers, color: '#3B82F6', field: 'totalUsers' },
  { key: 'onlineNow', icon: FiActivity, color: '#22C55E', field: 'onlineNow' },
  { key: 'totalOrders', icon: FiShoppingBag, color: '#FF6B00', field: 'totalOrders' },
  { key: 'revenue', icon: FiDollarSign, color: '#F59E0B', field: 'revenue', prefix: '$' },
];

export default function DashboardStats({ data = {} }) {
  const { t } = useTranslation();

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '20px',
        marginBottom: '30px',
      }}
    >
      {statConfigs.map(({ key, icon: Icon, color, field, prefix }, index) => (
        <motion.div
          key={key}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.08 }}
          style={{
            background: '#2A2A2A',
            borderRadius: '14px',
            padding: '24px',
            border: '1px solid #3A3A3A',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.85rem', color: '#A0A0A0', fontWeight: 500 }}>
              {t(`admin.stats.${key}`)}
            </span>
            <div
              style={{
                width: '40px', height: '40px', borderRadius: '10px',
                background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <Icon size={20} color={color} />
            </div>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#FFFFFF' }}>
            {prefix || ''}{(data[field] || 0).toLocaleString()}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
