import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiMail, FiPhone, FiMapPin, FiHeart, FiShield } from 'react-icons/fi';

export default function Footer() {
  const { t } = useTranslation();

  const sectionTitle = {
    fontSize: '1.1rem',
    fontWeight: 700,
    color: '#FFFFFF',
    marginBottom: '16px',
  };

  const linkStyle = {
    color: '#A0A0A0',
    textDecoration: 'none',
    fontSize: '0.9rem',
    display: 'block',
    padding: '4px 0',
    transition: 'color 0.2s',
  };

  const contactItemStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    color: '#A0A0A0',
    fontSize: '0.9rem',
    padding: '4px 0',
  };

  return (
    <footer
      style={{
        background: '#111111',
        borderTop: '1px solid #2A2A2A',
        padding: '60px 24px 30px',
      }}
      role="contentinfo"
      aria-label={t('accessibility.footerNavigation')}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '40px',
        }}
      >
        {/* About */}
        <div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '12px' }}>
            Ma<span style={{ color: '#FF6B00' }}>muq</span>
          </div>
          <p style={{ color: '#A0A0A0', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '20px' }}>
            {t('footer.description')}
          </p>
          {/* SDG badges */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#22C55E', fontSize: '0.8rem', fontWeight: 500 }}>
              <FiHeart size={14} />
              {t('about.sdg3')}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#FF6B00', fontSize: '0.8rem', fontWeight: 500 }}>
              <FiShield size={14} />
              {t('about.sdg10')}
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 style={sectionTitle}>{t('footer.quickLinks')}</h3>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <Link
              to="/catalog"
              style={linkStyle}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#FF6B00')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#A0A0A0')}
            >
              {t('nav.catalog')}
            </Link>
            <Link
              to="/profile"
              style={linkStyle}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#FF6B00')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#A0A0A0')}
            >
              {t('nav.profile')}
            </Link>
            <Link
              to="/orders"
              style={linkStyle}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#FF6B00')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#A0A0A0')}
            >
              {t('nav.orders')}
            </Link>
            <Link
              to="/login"
              style={linkStyle}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#FF6B00')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#A0A0A0')}
            >
              {t('nav.login')}
            </Link>
          </nav>
        </div>

        {/* Contact */}
        <div>
          <h3 style={sectionTitle}>{t('footer.contact')}</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={contactItemStyle}>
              <FiMail size={16} style={{ color: '#FF6B00', flexShrink: 0 }} />
              <a href="mailto:support@adaptwear.com" style={{ color: '#A0A0A0', textDecoration: 'none' }}>
                {t('footer.contactEmail')}
              </a>
            </div>
            <div style={contactItemStyle}>
              <FiPhone size={16} style={{ color: '#FF6B00', flexShrink: 0 }} />
              <span>{t('footer.contactPhone')}</span>
            </div>
            <div style={contactItemStyle}>
              <FiMapPin size={16} style={{ color: '#FF6B00', flexShrink: 0 }} />
              <span>{t('footer.contactAddress')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        style={{
          maxWidth: '1200px',
          margin: '40px auto 0',
          paddingTop: '20px',
          borderTop: '1px solid #2A2A2A',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <p style={{ color: '#666', fontSize: '0.85rem' }}>
          2024-2026 Mamuq. {t('footer.rights')}
        </p>
        <p style={{ color: '#666', fontSize: '0.8rem' }}>
          {t('footer.sdgBadge')}
        </p>
      </div>
    </footer>
  );
}
