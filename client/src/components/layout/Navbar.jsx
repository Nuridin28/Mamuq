import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiUser, FiShoppingBag, FiShoppingCart, FiSettings, FiLogOut, FiLogIn, FiUserPlus } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useAnalytics } from '../../hooks/useAnalytics';
import LanguageSwitcher from '../common/LanguageSwitcher';

export default function Navbar() {
  const { t } = useTranslation();
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const { cartCount } = useCart();
  const { trackButtonClick } = useAnalytics();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { to: '/', label: t('nav.home') },
    { to: '/catalog', label: t('nav.catalog') },
    ...(isAuthenticated ? [
      { to: '/profile', label: t('nav.profile') },
      { to: '/orders', label: t('nav.orders') },
    ] : []),
    ...(isAdmin ? [{ to: '/admin', label: t('nav.admin') }] : []),
  ];

  const handleLogout = () => {
    trackButtonClick('logout');
    logout();
    navigate('/');
    setUserMenuOpen(false);
    setMobileOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const navStyle = {
    position: 'sticky',
    top: 0,
    zIndex: 900,
    background: 'rgba(26, 26, 26, 0.9)',
    backdropFilter: 'blur(12px)',
    borderBottom: '1px solid #2A2A2A',
  };

  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '70px',
  };

  const logoStyle = {
    fontSize: '1.5rem',
    fontWeight: 800,
    color: '#FFFFFF',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '2px',
  };

  const linkStyle = (active) => ({
    color: active ? '#FF6B00' : '#E0E0E0',
    textDecoration: 'none',
    fontSize: '0.95rem',
    fontWeight: active ? 600 : 400,
    padding: '8px 16px',
    borderRadius: '8px',
    transition: 'all 0.2s',
    background: active ? 'rgba(255, 107, 0, 0.1)' : 'transparent',
  });

  return (
    <nav style={navStyle} role="navigation" aria-label={t('accessibility.navigationMenu')}>
      <div style={containerStyle}>
        <Link to="/" style={logoStyle}>
          Ma<span style={{ color: '#FF6B00' }}>muq</span>
        </Link>

        {/* Desktop nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
          className="desktop-nav"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
            id="desktop-links"
          >
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                style={linkStyle(isActive(link.to))}
                onMouseEnter={(e) => {
                  if (!isActive(link.to)) e.currentTarget.style.color = '#FF6B00';
                }}
                onMouseLeave={(e) => {
                  if (!isActive(link.to)) e.currentTarget.style.color = '#E0E0E0';
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginLeft: '16px' }}>
            <Link
              to="/cart"
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '8px',
                color: '#E0E0E0',
                textDecoration: 'none',
                borderRadius: '8px',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#FF6B00')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#E0E0E0')}
              aria-label={t('cart.title')}
            >
              <FiShoppingCart size={20} />
              {cartCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '2px',
                    right: '2px',
                    background: '#FF6B00',
                    color: '#FFFFFF',
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    minWidth: '16px',
                    height: '16px',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    lineHeight: 1,
                  }}
                >
                  {cartCount}
                </span>
              )}
            </Link>
            <LanguageSwitcher />

            {isAuthenticated ? (
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  aria-label={t('nav.myAccount')}
                  aria-expanded={userMenuOpen}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 14px',
                    background: '#2A2A2A',
                    border: '1px solid #3A3A3A',
                    borderRadius: '8px',
                    color: '#E0E0E0',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  <FiUser size={16} />
                  <span style={{ maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {user?.name || t('nav.myAccount')}
                  </span>
                </button>
                <AnimatePresence>
                  {userMenuOpen && (
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
                        minWidth: '180px',
                        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)',
                        zIndex: 100,
                      }}
                    >
                      <Link
                        to="/profile"
                        onClick={() => setUserMenuOpen(false)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '10px',
                          padding: '12px 16px', color: '#E0E0E0', textDecoration: 'none',
                          fontSize: '0.9rem', transition: 'background 0.15s',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = '#333333')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                      >
                        <FiUser size={16} /> {t('nav.profile')}
                      </Link>
                      <Link
                        to="/orders"
                        onClick={() => setUserMenuOpen(false)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '10px',
                          padding: '12px 16px', color: '#E0E0E0', textDecoration: 'none',
                          fontSize: '0.9rem', transition: 'background 0.15s',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = '#333333')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                      >
                        <FiShoppingBag size={16} /> {t('nav.orders')}
                      </Link>
                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setUserMenuOpen(false)}
                          style={{
                            display: 'flex', alignItems: 'center', gap: '10px',
                            padding: '12px 16px', color: '#E0E0E0', textDecoration: 'none',
                            fontSize: '0.9rem', transition: 'background 0.15s',
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = '#333333')}
                          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                        >
                          <FiSettings size={16} /> {t('nav.admin')}
                        </Link>
                      )}
                      <div style={{ borderTop: '1px solid #3A3A3A' }} />
                      <button
                        onClick={handleLogout}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '10px',
                          padding: '12px 16px', color: '#EF4444', background: 'none',
                          border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer',
                          fontSize: '0.9rem', fontFamily: "'Inter', sans-serif",
                          transition: 'background 0.15s',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = '#333333')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                      >
                        <FiLogOut size={16} /> {t('nav.logout')}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '8px' }}>
                <Link
                  to="/login"
                  style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    padding: '8px 16px', color: '#E0E0E0', textDecoration: 'none',
                    fontSize: '0.9rem', borderRadius: '8px', transition: 'color 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#FF6B00')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#E0E0E0')}
                >
                  <FiLogIn size={16} /> {t('nav.login')}
                </Link>
                <Link
                  to="/register"
                  style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    padding: '8px 16px', background: '#FF6B00', color: '#FFFFFF',
                    textDecoration: 'none', fontSize: '0.9rem', borderRadius: '8px',
                    fontWeight: 600, transition: 'background 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#E05E00')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = '#FF6B00')}
                >
                  <FiUserPlus size={16} /> {t('nav.register')}
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? t('accessibility.closeMenu') : t('accessibility.openMenu')}
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            color: '#E0E0E0',
            padding: '8px',
            cursor: 'pointer',
          }}
          className="mobile-menu-btn"
        >
          {mobileOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{
              overflow: 'hidden',
              background: '#1A1A1A',
              borderTop: '1px solid #2A2A2A',
            }}
            className="mobile-menu"
          >
            <div style={{ padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  style={{
                    ...linkStyle(isActive(link.to)),
                    display: 'block',
                    padding: '12px 16px',
                    fontSize: '1rem',
                  }}
                >
                  {link.label}
                </Link>
              ))}
              <div style={{ borderTop: '1px solid #2A2A2A', margin: '8px 0' }} />
              <div style={{ padding: '8px 0' }}>
                <LanguageSwitcher />
              </div>
              {isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '12px 16px', color: '#EF4444', background: 'none',
                    border: 'none', cursor: 'pointer', fontSize: '1rem',
                    fontFamily: "'Inter', sans-serif", borderRadius: '8px',
                  }}
                >
                  <FiLogOut size={18} /> {t('nav.logout')}
                </button>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '8px 0' }}>
                  <Link
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    style={{ padding: '12px 16px', color: '#E0E0E0', textDecoration: 'none', fontSize: '1rem' }}
                  >
                    {t('nav.login')}
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileOpen(false)}
                    style={{
                      padding: '12px 16px', background: '#FF6B00', color: '#FFFFFF',
                      textDecoration: 'none', fontSize: '1rem', borderRadius: '8px',
                      textAlign: 'center', fontWeight: 600,
                    }}
                  >
                    {t('nav.register')}
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 768px) {
          .mobile-menu-btn { display: flex !important; }
          #desktop-links { display: none !important; }
          .desktop-nav > div:last-child { display: none !important; }
        }
      `}</style>
    </nav>
  );
}
