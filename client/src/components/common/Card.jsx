import { motion } from 'framer-motion';

export default function Card({ children, style: customStyle, onClick, hoverable = true, ...props }) {
  const baseStyle = {
    background: '#2A2A2A',
    borderRadius: '16px',
    padding: '24px',
    border: '1px solid #3A3A3A',
    transition: 'all 0.3s ease',
    cursor: onClick ? 'pointer' : 'default',
    ...customStyle,
  };

  return (
    <motion.div
      style={baseStyle}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      whileHover={
        hoverable
          ? {
              borderColor: '#FF6B00',
              boxShadow: '0 8px 30px rgba(255, 107, 0, 0.15)',
              y: -4,
            }
          : {}
      }
      onClick={onClick}
      {...props}
    >
      {children}
    </motion.div>
  );
}
