import { motion } from 'framer-motion';

export default function Loading({ size = 48, text }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 20px',
        gap: '16px',
      }}
      role="status"
      aria-label="Loading"
    >
      <motion.div
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          border: '4px solid #3A3A3A',
          borderTopColor: '#FF6B00',
        }}
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 0.9, ease: 'linear' }}
      />
      <motion.div
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
        style={{ color: '#A0A0A0', fontSize: '0.95rem' }}
      >
        {text || 'Loading...'}
      </motion.div>
    </div>
  );
}
