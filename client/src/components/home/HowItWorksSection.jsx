import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { FiUser, FiSearch, FiPackage } from 'react-icons/fi';

const steps = [
  { key: 'step1', icon: FiUser, number: '01' },
  { key: 'step2', icon: FiSearch, number: '02' },
  { key: 'step3', icon: FiPackage, number: '03' },
];

export default function HowItWorksSection() {
  const { t } = useTranslation();

  return (
    <section
      style={{
        padding: '100px 24px',
        background: 'linear-gradient(180deg, #1A1A1A 0%, #222222 100%)',
      }}
    >
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{ textAlign: 'center', marginBottom: '70px' }}
        >
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, color: '#FFFFFF', marginBottom: '12px' }}>
            {t('howItWorks.title')}
          </h2>
          <p style={{ fontSize: '1.1rem', color: '#A0A0A0', maxWidth: '520px', margin: '0 auto' }}>
            {t('howItWorks.subtitle')}
          </p>
        </motion.div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0', position: 'relative' }}>
          {/* Vertical line connector */}
          <div
            style={{
              position: 'absolute',
              left: '39px',
              top: '40px',
              bottom: '40px',
              width: '2px',
              background: 'linear-gradient(180deg, #FF6B00, rgba(255, 107, 0, 0.2))',
            }}
            className="step-line"
          />

          {steps.map(({ key, icon: Icon, number }, index) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '28px',
                padding: '30px 0',
              }}
              className="step-item"
            >
              <div
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: '#2A2A2A',
                  border: '3px solid #FF6B00',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  position: 'relative',
                  zIndex: 2,
                }}
              >
                <Icon size={28} color="#FF6B00" />
              </div>
              <div style={{ paddingTop: '12px' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#FF6B00', marginBottom: '6px', letterSpacing: '1px' }}>
                  {number}
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '8px' }}>
                  {t(`howItWorks.${key}.title`)}
                </h3>
                <p style={{ fontSize: '0.95rem', color: '#A0A0A0', lineHeight: 1.6, maxWidth: '450px' }}>
                  {t(`howItWorks.${key}.description`)}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 600px) {
          .step-line { left: 29px !important; }
          .step-item > div:first-child { width: 60px !important; height: 60px !important; }
        }
      `}</style>
    </section>
  );
}
