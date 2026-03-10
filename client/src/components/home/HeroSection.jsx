import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';
import Button from '../common/Button';
import FloatingShirt from '../three/FloatingShirt';

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

export default function HeroSection() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <section
      style={{
        minHeight: 'calc(100vh - 70px)',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        padding: '40px 24px',
      }}
    >
      {/* Gradient background */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at 20% 50%, rgba(255, 107, 0, 0.08) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(255, 107, 0, 0.05) 0%, transparent 50%)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          width: '100%',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '60px',
          alignItems: 'center',
        }}
        className="hero-grid"
      >
        <motion.div variants={containerVariants} initial="hidden" animate="visible">
          <motion.h1
            variants={itemVariants}
            style={{
              fontSize: 'clamp(2.2rem, 5vw, 3.5rem)',
              fontWeight: 800,
              color: '#FFFFFF',
              lineHeight: 1.15,
              marginBottom: '20px',
            }}
          >
            {t('hero.title')}
          </motion.h1>

          <motion.p
            variants={itemVariants}
            style={{
              fontSize: 'clamp(1rem, 2vw, 1.2rem)',
              color: '#A0A0A0',
              lineHeight: 1.7,
              marginBottom: '36px',
              maxWidth: '520px',
            }}
          >
            {t('hero.subtitle')}
          </motion.p>

          <motion.div
            variants={itemVariants}
            style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}
          >
            <Button
              variant="primary"
              size="lg"
              icon={FiArrowRight}
              onClick={() => navigate('/catalog')}
              trackName="hero_browse_catalog"
            >
              {t('hero.browseCatalog')}
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/profile')}
              trackName="hero_create_profile"
            >
              {t('hero.createProfile')}
            </Button>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="hero-3d"
          style={{ height: '450px' }}
        >
          <FloatingShirt />
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .hero-grid { grid-template-columns: 1fr !important; text-align: center; }
          .hero-3d { display: none !important; }
          .hero-grid p { margin-left: auto; margin-right: auto; }
          .hero-grid div:last-of-type { justify-content: center; }
        }
      `}</style>
    </section>
  );
}
