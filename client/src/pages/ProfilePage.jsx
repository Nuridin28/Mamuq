import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { FiEdit2, FiTrash2, FiUser } from 'react-icons/fi';
import ProfileForm from '../components/profile/ProfileForm';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';
import Modal from '../components/common/Modal';
import api from '../utils/api';

export default function ProfilePage() {
  const { t } = useTranslation();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await api.get('/profile');
      setProfile(response.data);
    } catch (err) {
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleDelete = async () => {
    try {
      await api.delete('/profile');
      setProfile(null);
      setShowDeleteModal(false);
    } catch (err) {
      // Error
    }
  };

  const handleSave = (data) => {
    setProfile(data);
    setEditing(false);
    fetchProfile();
  };

  if (loading) return <Loading />;

  const summaryItem = (label, value) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #333' }}>
      <span style={{ fontSize: '0.9rem', color: '#A0A0A0' }}>{label}</span>
      <span style={{ fontSize: '0.9rem', color: '#FFFFFF', fontWeight: 500, textAlign: 'right', maxWidth: '60%' }}>
        {Array.isArray(value) ? (value.length > 0 ? value.join(', ') : '--') : (value !== undefined && value !== null && value !== '' ? String(value) : '--')}
      </span>
    </div>
  );

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', padding: '40px 24px' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, color: '#FFFFFF', marginBottom: '8px' }}>
          {t('profile.title')}
        </h1>
        <p style={{ fontSize: '0.95rem', color: '#A0A0A0', marginBottom: '32px' }}>
          {t('profile.subtitle')}
        </p>
      </motion.div>

      {!profile && !editing ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            textAlign: 'center',
            padding: '60px 20px',
            background: '#2A2A2A',
            borderRadius: '16px',
            border: '1px solid #3A3A3A',
          }}
        >
          <FiUser size={48} color="#3A3A3A" style={{ marginBottom: '16px' }} />
          <p style={{ color: '#A0A0A0', marginBottom: '24px', maxWidth: '400px', margin: '0 auto 24px' }}>
            {t('profile.noProfile')}
          </p>
          <Button variant="primary" onClick={() => setEditing(true)} trackName="create_profile">
            {t('profile.createProfile')}
          </Button>
        </motion.div>
      ) : editing || !profile ? (
        <ProfileForm existingProfile={profile} onSave={handleSave} />
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            background: '#2A2A2A',
            borderRadius: '16px',
            padding: '32px',
            border: '1px solid #3A3A3A',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#FFFFFF' }}>
              {t('profile.summary.title')}
            </h2>
            <div style={{ display: 'flex', gap: '8px' }}>
              <Button variant="outline" size="sm" icon={FiEdit2} onClick={() => setEditing(true)} trackName="edit_profile">
                {t('profile.editProfile')}
              </Button>
              <Button variant="danger" size="sm" icon={FiTrash2} onClick={() => setShowDeleteModal(true)} trackName="delete_profile_click">
                {t('profile.deleteProfile')}
              </Button>
            </div>
          </div>

          {summaryItem(t('profile.summary.handMobility'), `L: ${profile.leftHandMobility || '--'}, R: ${profile.rightHandMobility || '--'}`)}
          {summaryItem(t('profile.summary.wheelchairUser'), profile.wheelchairUser ? t('common.yes') : t('common.no'))}
          {summaryItem(t('profile.summary.fabricSensitivities'), profile.fabricSensitivities)}
          {summaryItem(t('profile.summary.fastenerPreferences'), profile.fastenerPreferences)}
          {summaryItem(t('profile.summary.neckWidth'), profile.neckWidth)}
          {summaryItem(t('profile.summary.sleeveType'), profile.sleeveType)}
          {summaryItem(t('profile.summary.softSeams'), profile.softSeams ? t('common.yes') : t('common.no'))}
          {summaryItem(t('profile.summary.sensitiveAreas'), profile.sensitiveAreas)}
          {summaryItem(t('profile.summary.notes'), profile.additionalNotes)}
        </motion.div>
      )}

      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} title={t('profile.deleteProfile')}>
        <p style={{ color: '#A0A0A0', marginBottom: '24px' }}>{t('profile.deleteConfirm')}</p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>{t('common.cancel')}</Button>
          <Button variant="danger" onClick={handleDelete}>{t('common.delete')}</Button>
        </div>
      </Modal>
    </div>
  );
}
