import { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { FiGrid, FiPackage, FiShoppingBag, FiBarChart2 } from 'react-icons/fi';
import DashboardStats from '../components/admin/DashboardStats';
import AnalyticsCharts from '../components/admin/AnalyticsCharts';
import OnlineUsers from '../components/admin/OnlineUsers';
import ButtonClicksTable from '../components/admin/ButtonClicksTable';
import RecentEvents from '../components/admin/RecentEvents';
import Loading from '../components/common/Loading';
import api from '../utils/api';

const sidebarLinks = [
  { to: '/admin', icon: FiGrid, key: 'dashboard' },
  { to: '/admin/products', icon: FiPackage, key: 'products' },
  { to: '/admin/orders', icon: FiShoppingBag, key: 'orders' },
];

export default function AdminDashboard() {
  const { t } = useTranslation();
  const location = useLocation();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = useCallback(async () => {
    try {
      const response = await api.get('/analytics/dashboard');
      setData(response.data);
    } catch (err) {
      setData({
        totalUsers: 0, onlineNow: 0, totalOrders: 0, revenue: 0,
        buttonClicks: [], pageViews: [], userLanguages: [], sessions: [],
        recentEvents: [], buttonClicksTable: [],
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
    const interval = setInterval(fetchDashboard, 30000);
    return () => clearInterval(interval);
  }, [fetchDashboard]);

  const isActive = (path) => location.pathname === path;

  if (loading) return <Loading />;

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 70px)' }}>
      {/* Sidebar */}
      <aside
        style={{
          width: '240px',
          background: '#111111',
          borderRight: '1px solid #2A2A2A',
          padding: '30px 16px',
          flexShrink: 0,
        }}
        className="admin-sidebar"
      >
        <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FFFFFF', padding: '0 12px', marginBottom: '24px' }}>
          {t('admin.title')}
        </h2>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {sidebarLinks.map(({ to, icon: Icon, key }) => (
            <Link
              key={to}
              to={to}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '12px 16px',
                borderRadius: '10px',
                color: isActive(to) ? '#FF6B00' : '#A0A0A0',
                textDecoration: 'none',
                fontSize: '0.9rem',
                fontWeight: isActive(to) ? 600 : 400,
                background: isActive(to) ? 'rgba(255, 107, 0, 0.1)' : 'transparent',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                if (!isActive(to)) e.currentTarget.style.background = '#1A1A1A';
              }}
              onMouseLeave={(e) => {
                if (!isActive(to)) e.currentTarget.style.background = 'transparent';
              }}
            >
              <Icon size={18} />
              {t(`admin.sidebar.${key}`)}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, padding: '30px', overflowY: 'auto' }}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
          <DashboardStats data={data || {}} />
          <AnalyticsCharts
            buttonClicks={data?.buttonClicks || []}
            pageViews={data?.pageViews || []}
            userLanguages={data?.userLanguages || []}
            sessions={data?.sessions || []}
          />
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
              gap: '20px',
            }}
          >
            <OnlineUsers initialCount={data?.onlineNow || 0} />
            <RecentEvents events={data?.recentEvents || []} />
          </div>
          <ButtonClicksTable data={data?.buttonClicksTable || []} />
        </motion.div>
      </main>

      <style>{`
        @media (max-width: 768px) {
          .admin-sidebar { display: none; }
        }
      `}</style>
    </div>
  );
}
