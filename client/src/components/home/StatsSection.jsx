import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useInView } from 'framer-motion';

const stats = [
  { key: 'customers', value: 1000, suffix: '+' },
  { key: 'products', value: 500, suffix: '+' },
  { key: 'customizations', value: 50, suffix: '+' },
  { key: 'languages', value: 3, suffix: '' },
];

function AnimatedCounter({ target, suffix, inView }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 2000;
    const startTime = Date.now();

    const step = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);
      setCount(current);
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };
    requestAnimationFrame(step);
  }, [inView, target]);

  return (
    <span>
      {count.toLocaleString()}{suffix}
    </span>
  );
}

export default function StatsSection() {
  const { t } = useTranslation();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section
      ref={ref}
      style={{
        padding: '80px 24px',
        background: '#1A1A1A',
        borderTop: '1px solid #2A2A2A',
        borderBottom: '1px solid #2A2A2A',
      }}
    >
      <div
        style={{
          maxWidth: '1000px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '40px',
          textAlign: 'center',
        }}
      >
        {stats.map(({ key, value, suffix }, index) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div
              style={{
                fontSize: 'clamp(2rem, 4vw, 3rem)',
                fontWeight: 800,
                color: '#FF6B00',
                marginBottom: '8px',
              }}
            >
              <AnimatedCounter target={value} suffix={suffix} inView={inView} />
            </div>
            <div style={{ fontSize: '0.95rem', color: '#A0A0A0', fontWeight: 500 }}>
              {t(`stats.${key}`)}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
