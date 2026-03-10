import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiLock, FiUserPlus } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useAnalytics } from '../hooks/useAnalytics';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

export default function RegisterPage() {
  const { t } = useTranslation();
  const { register } = useAuth();
  const { trackButtonClick } = useAnalytics();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    language: 'en',
    role: 'user',
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.firstName.trim()) errs.firstName = t('auth.register.validation.nameRequired');
    if (!form.lastName.trim()) errs.lastName = t('auth.register.validation.nameRequired');
    if (!form.email.trim()) errs.email = t('auth.register.validation.emailRequired');
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = t('auth.register.validation.emailInvalid');
    if (!form.password) errs.password = t('auth.register.validation.passwordRequired');
    else if (form.password.length < 6) errs.password = t('auth.register.validation.passwordMin');
    if (form.password !== form.confirmPassword) errs.confirmPassword = t('auth.register.passwordMismatch');
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    if (!validate()) return;
    setLoading(true);
    trackButtonClick('register_submit');
    try {
      await register({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
        language: form.language,
        role: form.role,
      });
      navigate('/');
    } catch (err) {
      setApiError(err.response?.data?.error || t('auth.register.error'));
    } finally {
      setLoading(false);
    }
  };

  const selectStyle = {
    width: '100%',
    padding: '12px 16px',
    background: '#1A1A1A',
    border: '2px solid #3A3A3A',
    borderRadius: '10px',
    color: '#E0E0E0',
    fontSize: '1rem',
    outline: 'none',
    fontFamily: "'Inter', sans-serif",
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
          maxWidth: '480px',
          border: '1px solid #3A3A3A',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '8px' }}>
            {t('auth.register.title')}
          </h1>
          <p style={{ color: '#A0A0A0', fontSize: '0.95rem' }}>
            {t('auth.register.subtitle')}
          </p>
        </div>

        {apiError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              padding: '12px 16px', background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid #EF4444', borderRadius: '8px', color: '#EF4444',
              fontSize: '0.85rem', marginBottom: '20px', textAlign: 'center',
            }}
            role="alert"
          >
            {apiError}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <Input
              id="register-firstName"
              label={t('auth.register.firstName')}
              icon={FiUser}
              placeholder={t('auth.register.firstNamePlaceholder')}
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              error={errors.firstName}
              required
            />
            <Input
              id="register-lastName"
              label={t('auth.register.lastName')}
              icon={FiUser}
              placeholder={t('auth.register.lastNamePlaceholder')}
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              error={errors.lastName}
              required
            />
          </div>

          <Input
            id="register-email"
            label={t('auth.register.email')}
            type="email"
            icon={FiMail}
            placeholder={t('auth.register.emailPlaceholder')}
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            error={errors.email}
            required
          />

          <Input
            id="register-password"
            label={t('auth.register.password')}
            type="password"
            icon={FiLock}
            placeholder={t('auth.register.passwordPlaceholder')}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            error={errors.password}
            required
          />

          <Input
            id="register-confirm"
            label={t('auth.register.confirmPassword')}
            type="password"
            icon={FiLock}
            placeholder={t('auth.register.confirmPasswordPlaceholder')}
            value={form.confirmPassword}
            onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
            error={errors.confirmPassword}
            required
          />

          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 500, color: '#E0E0E0', marginBottom: '6px' }}>
              {t('auth.register.language')}
            </label>
            <select value={form.language} onChange={(e) => setForm({ ...form, language: e.target.value })} style={selectStyle}>
              <option value="en">English</option>
              <option value="ru">Русский</option>
              <option value="kz">Қазақша</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 500, color: '#E0E0E0', marginBottom: '6px' }}>
              {t('auth.register.role')}
            </label>
            <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} style={selectStyle}>
              <option value="user">{t('auth.register.roleOptions.user')}</option>
              <option value="guardian">{t('auth.register.roleOptions.guardian')}</option>
            </select>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            loading={loading}
            icon={FiUserPlus}
            trackName="register"
            style={{ marginTop: '8px' }}
          >
            {t('auth.register.submit')}
          </Button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.9rem', color: '#A0A0A0' }}>
          {t('auth.register.hasAccount')}{' '}
          <Link to="/login" style={{ color: '#FF6B00', fontWeight: 600 }}>
            {t('auth.register.loginLink')}
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
