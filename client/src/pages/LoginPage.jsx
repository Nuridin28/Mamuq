import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiLogIn } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useAnalytics } from '../hooks/useAnalytics';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

export default function LoginPage() {
  const { t } = useTranslation();
  const { login } = useAuth();
  const { trackButtonClick } = useAnalytics();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    trackButtonClick('login_submit');
    try {
      await login(form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(t('auth.login.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 70px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4 }}
        style={{
          background: '#2A2A2A',
          borderRadius: '20px',
          padding: '48px 40px',
          width: '100%',
          maxWidth: '440px',
          border: '1px solid #3A3A3A',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '8px' }}>
            {t('auth.login.title')}
          </h1>
          <p style={{ color: '#A0A0A0', fontSize: '0.95rem' }}>
            {t('auth.login.subtitle')}
          </p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              padding: '12px 16px',
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid #EF4444',
              borderRadius: '8px',
              color: '#EF4444',
              fontSize: '0.85rem',
              marginBottom: '20px',
              textAlign: 'center',
            }}
            role="alert"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <Input
            id="login-email"
            label={t('auth.login.email')}
            type="email"
            icon={FiMail}
            placeholder={t('auth.login.emailPlaceholder')}
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />

          <Input
            id="login-password"
            label={t('auth.login.password')}
            type="password"
            icon={FiLock}
            placeholder={t('auth.login.passwordPlaceholder')}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            loading={loading}
            icon={FiLogIn}
            trackName="login"
          >
            {t('auth.login.submit')}
          </Button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.9rem', color: '#A0A0A0' }}>
          {t('auth.login.noAccount')}{' '}
          <Link to="/register" style={{ color: '#FF6B00', fontWeight: 600 }}>
            {t('auth.login.registerLink')}
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
