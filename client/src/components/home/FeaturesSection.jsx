import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { FiHeart, FiShield, FiStar, FiUsers } from 'react-icons/fi';
import Card from '../common/Card';

const features = [
  { key: 'personalizedFit', icon: FiHeart },
  { key: 'adaptiveFasteners', icon: FiShield },
  { key: 'comfortableFabrics', icon: FiStar },
  { key: 'inclusiveDesign', icon: FiUsers },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

export default function FeaturesSection() {
  const { t } = useTranslation();

  return (
    <section style={{ padding: '100px 24px', background: '#1A1A1A' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{ textAlign: 'center', marginBottom: '60px' }}
        >
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, color: '#FFFFFF', marginBottom: '12px' }}>
            {t('features.title')}
          </h2>
          <p style={{ fontSize: '1.1rem', color: '#A0A0A0', maxWidth: '500px', margin: '0 auto' }}>
            {t('features.subtitle')}
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '24px',
          }}
        >
          {features.map(({ key, icon: Icon }) => (
            <Card key={key} style={{ textAlign: 'center', padding: '36px 24px' }}>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '16px',
                  background: 'rgba(255, 107, 0, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px',
                }}
              >
                <Icon size={28} color="#FF6B00" />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '10px' }}>
                {t(`features.${key}.title`)}
              </h3>
              <p style={{ fontSize: '0.9rem', color: '#A0A0A0', lineHeight: 1.6 }}>
                {t(`features.${key}.description`)}
              </p>
            </Card>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
