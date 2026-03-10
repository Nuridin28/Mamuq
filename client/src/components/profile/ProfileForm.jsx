import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronRight, FiChevronLeft, FiCheck } from 'react-icons/fi';
import { useAnalytics } from '../../hooks/useAnalytics';
import Button from '../common/Button';
import api from '../../utils/api';

const TOTAL_STEPS = 4;

const mobilityOptions = ['full', 'limited', 'none'];
const fabricOptions = ['wool', 'synthetic', 'latex', 'rough', 'tags', 'none'];
const fastenerOptions = ['magnetic', 'velcro', 'snaps', 'zipper', 'buttons', 'pullover'];
const neckOptions = ['standard', 'wide', 'extraWide'];
const sleeveOptions = ['long', 'short', 'sleeveless', 'raglan'];
const bodyAreas = ['neck', 'shoulders', 'arms', 'wrists', 'chest', 'back', 'waist', 'hips', 'legs', 'ankles'];

export default function ProfileForm({ existingProfile, onSave }) {
  const { t } = useTranslation();
  const { trackButtonClick } = useAnalytics();
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [profile, setProfile] = useState({
    leftHandMobility: existingProfile?.leftHandMobility || 'full',
    rightHandMobility: existingProfile?.rightHandMobility || 'full',
    wheelchairUser: existingProfile?.wheelchairUser || false,
    fabricSensitivities: existingProfile?.fabricSensitivities || [],
    fastenerPreferences: existingProfile?.fastenerPreferences || [],
    neckWidth: existingProfile?.neckWidth || 'standard',
    sleeveType: existingProfile?.sleeveType || 'long',
    softSeams: existingProfile?.softSeams || false,
    sensitiveAreas: existingProfile?.sensitiveAreas || [],
    additionalNotes: existingProfile?.additionalNotes || '',
  });

  const updateField = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const toggleArrayField = (field, value) => {
    const arr = profile[field] || [];
    const updated = arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
    updateField(field, updated);
  };

  const handleSubmit = async () => {
    setSaving(true);
    trackButtonClick('save_profile');
    try {
      if (existingProfile) {
        await api.put('/profile', profile);
      } else {
        await api.post('/profile', profile);
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      if (onSave) onSave(profile);
    } catch (err) {
      // Error handled silently
    } finally {
      setSaving(false);
    }
  };

  const progressPercent = (step / TOTAL_STEPS) * 100;

  const selectStyle = {
    width: '100%',
    padding: '12px 16px',
    background: '#1A1A1A',
    border: '2px solid #3A3A3A',
    borderRadius: '10px',
    color: '#E0E0E0',
    fontSize: '0.95rem',
    outline: 'none',
    fontFamily: "'Inter', sans-serif",
    cursor: 'pointer',
  };

  const chipStyle = (selected) => ({
    padding: '8px 16px',
    borderRadius: '8px',
    border: `2px solid ${selected ? '#FF6B00' : '#3A3A3A'}`,
    background: selected ? 'rgba(255, 107, 0, 0.12)' : 'transparent',
    color: selected ? '#FF6B00' : '#E0E0E0',
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontWeight: 500,
    fontFamily: "'Inter', sans-serif",
    transition: 'all 0.2s',
  });

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '24px' }}>
              {t('profile.step1.title')}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', color: '#E0E0E0', marginBottom: '8px', fontWeight: 500 }}>
                  {t('profile.step1.leftHand')}
                </label>
                <select value={profile.leftHandMobility} onChange={(e) => updateField('leftHandMobility', e.target.value)} style={selectStyle}>
                  {mobilityOptions.map((opt) => (
                    <option key={opt} value={opt}>{t(`profile.step1.mobilityOptions.${opt}`)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', color: '#E0E0E0', marginBottom: '8px', fontWeight: 500 }}>
                  {t('profile.step1.rightHand')}
                </label>
                <select value={profile.rightHandMobility} onChange={(e) => updateField('rightHandMobility', e.target.value)} style={selectStyle}>
                  {mobilityOptions.map((opt) => (
                    <option key={opt} value={opt}>{t(`profile.step1.mobilityOptions.${opt}`)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', color: '#E0E0E0', marginBottom: '12px', fontWeight: 500 }}>
                  {t('profile.step1.wheelchairUser')}
                </label>
                <div style={{ display: 'flex', gap: '12px' }}>
                  {[true, false].map((val) => (
                    <button
                      key={String(val)}
                      onClick={() => updateField('wheelchairUser', val)}
                      style={chipStyle(profile.wheelchairUser === val)}
                    >
                      {val ? t('profile.step1.yes') : t('profile.step1.no')}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '24px' }}>
              {t('profile.step2.title')}
            </h3>
            <div style={{ marginBottom: '28px' }}>
              <label style={{ display: 'block', fontSize: '0.9rem', color: '#E0E0E0', marginBottom: '12px', fontWeight: 500 }}>
                {t('profile.step2.fabricSensitivity')}
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {fabricOptions.map((opt) => (
                  <button key={opt} onClick={() => toggleArrayField('fabricSensitivities', opt)} style={chipStyle(profile.fabricSensitivities.includes(opt))}>
                    {t(`profile.step2.fabricOptions.${opt}`)}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.9rem', color: '#E0E0E0', marginBottom: '12px', fontWeight: 500 }}>
                {t('profile.step2.fastenerPreference')}
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {fastenerOptions.map((opt) => (
                  <button key={opt} onClick={() => toggleArrayField('fastenerPreferences', opt)} style={chipStyle(profile.fastenerPreferences.includes(opt))}>
                    {t(`profile.step2.fastenerOptions.${opt}`)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '24px' }}>
              {t('profile.step3.title')}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', color: '#E0E0E0', marginBottom: '12px', fontWeight: 500 }}>
                  {t('profile.step3.neckWidth')}
                </label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {neckOptions.map((opt) => (
                    <button key={opt} onClick={() => updateField('neckWidth', opt)} style={chipStyle(profile.neckWidth === opt)}>
                      {t(`profile.step3.neckOptions.${opt}`)}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', color: '#E0E0E0', marginBottom: '12px', fontWeight: 500 }}>
                  {t('profile.step3.sleeveType')}
                </label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {sleeveOptions.map((opt) => (
                    <button key={opt} onClick={() => updateField('sleeveType', opt)} style={chipStyle(profile.sleeveType === opt)}>
                      {t(`profile.step3.sleeveOptions.${opt}`)}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                  <div
                    onClick={() => updateField('softSeams', !profile.softSeams)}
                    style={{
                      width: '44px', height: '24px', borderRadius: '12px',
                      background: profile.softSeams ? '#FF6B00' : '#3A3A3A',
                      position: 'relative', cursor: 'pointer', transition: 'background 0.2s', flexShrink: 0,
                    }}
                  >
                    <div style={{
                      width: '20px', height: '20px', borderRadius: '50%', background: '#FFFFFF',
                      position: 'absolute', top: '2px', left: profile.softSeams ? '22px' : '2px', transition: 'left 0.2s',
                    }} />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.9rem', color: '#E0E0E0', fontWeight: 500 }}>{t('profile.step3.softSeams')}</span>
                    <p style={{ fontSize: '0.8rem', color: '#A0A0A0', marginTop: '2px' }}>{t('profile.step3.softSeamsDescription')}</p>
                  </div>
                </label>
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '24px' }}>
              {t('profile.step4.title')}
            </h3>
            <div style={{ marginBottom: '28px' }}>
              <label style={{ display: 'block', fontSize: '0.9rem', color: '#E0E0E0', marginBottom: '12px', fontWeight: 500 }}>
                {t('profile.step4.sensitiveAreas')}
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '8px' }}>
                {bodyAreas.map((area) => (
                  <button key={area} onClick={() => toggleArrayField('sensitiveAreas', area)} style={chipStyle(profile.sensitiveAreas.includes(area))}>
                    {t(`profile.step4.areaOptions.${area}`)}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.9rem', color: '#E0E0E0', marginBottom: '8px', fontWeight: 500 }}>
                {t('profile.step4.additionalNotes')}
              </label>
              <textarea
                value={profile.additionalNotes}
                onChange={(e) => updateField('additionalNotes', e.target.value)}
                placeholder={t('profile.step4.notesPlaceholder')}
                rows={4}
                style={{
                  width: '100%', padding: '12px 16px', background: '#1A1A1A', border: '2px solid #3A3A3A',
                  borderRadius: '10px', color: '#E0E0E0', fontSize: '0.95rem', outline: 'none', resize: 'vertical',
                  fontFamily: "'Inter', sans-serif",
                }}
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      {/* Progress bar */}
      <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.85rem', color: '#A0A0A0' }}>
          {t('profile.progress', { current: step, total: TOTAL_STEPS })}
        </span>
        <span style={{ fontSize: '0.85rem', color: '#FF6B00', fontWeight: 600 }}>
          {Math.round(progressPercent)}%
        </span>
      </div>
      <div style={{ height: '4px', background: '#3A3A3A', borderRadius: '2px', marginBottom: '32px', overflow: 'hidden' }}>
        <motion.div
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.3 }}
          style={{ height: '100%', background: '#FF6B00', borderRadius: '2px' }}
        />
      </div>

      {/* Step content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.25 }}
        >
          {renderStep()}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '36px', gap: '12px' }}>
        {step > 1 ? (
          <Button variant="secondary" onClick={() => setStep(step - 1)} icon={FiChevronLeft}>
            {t('profile.previous')}
          </Button>
        ) : (
          <div />
        )}
        {step < TOTAL_STEPS ? (
          <Button variant="primary" onClick={() => setStep(step + 1)} icon={FiChevronRight} trackName="profile_next_step">
            {t('profile.next')}
          </Button>
        ) : (
          <Button variant="primary" onClick={handleSubmit} loading={saving} icon={FiCheck} trackName="save_profile">
            {saving ? t('profile.saving') : t('profile.save')}
          </Button>
        )}
      </div>

      {saved && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            marginTop: '20px', padding: '12px 20px', background: 'rgba(34, 197, 94, 0.15)',
            border: '1px solid #22C55E', borderRadius: '8px', color: '#22C55E',
            fontSize: '0.9rem', textAlign: 'center',
          }}
        >
          {t('profile.saved')}
        </motion.div>
      )}
    </div>
  );
}
