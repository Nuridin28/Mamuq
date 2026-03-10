import { motion } from 'framer-motion';
import { useAnalytics } from '../../hooks/useAnalytics';

const variants = {
  primary: {
    background: '#FF6B00',
    color: '#FFFFFF',
    border: 'none',
    hoverBg: '#E05E00',
  },
  secondary: {
    background: '#2A2A2A',
    color: '#E0E0E0',
    border: '1px solid #3A3A3A',
    hoverBg: '#333333',
  },
  outline: {
    background: 'transparent',
    color: '#FF6B00',
    border: '2px solid #FF6B00',
    hoverBg: 'rgba(255, 107, 0, 0.1)',
  },
  danger: {
    background: '#EF4444',
    color: '#FFFFFF',
    border: 'none',
    hoverBg: '#DC2626',
  },
};

const sizes = {
  sm: { padding: '8px 16px', fontSize: '0.85rem' },
  md: { padding: '12px 24px', fontSize: '1rem' },
  lg: { padding: '16px 32px', fontSize: '1.1rem' },
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon: Icon,
  onClick,
  trackName,
  type = 'button',
  style: customStyle,
  fullWidth = false,
  ariaLabel,
  ...props
}) {
  const { trackButtonClick } = useAnalytics();
  const v = variants[variant] || variants.primary;
  const s = sizes[size] || sizes.md;

  const handleClick = (e) => {
    if (trackName) {
      trackButtonClick(trackName);
    }
    if (onClick) {
      onClick(e);
    }
  };

  const baseStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: s.padding,
    fontSize: s.fontSize,
    fontWeight: 600,
    fontFamily: "'Inter', sans-serif",
    borderRadius: '10px',
    border: v.border,
    background: v.background,
    color: v.color,
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    opacity: disabled || loading ? 0.6 : 1,
    transition: 'all 0.2s ease',
    width: fullWidth ? '100%' : 'auto',
    outline: 'none',
    textDecoration: 'none',
    lineHeight: 1.4,
    ...customStyle,
  };

  return (
    <motion.button
      type={type}
      style={baseStyle}
      onClick={handleClick}
      disabled={disabled || loading}
      aria-label={ariaLabel}
      aria-busy={loading}
      whileHover={!disabled && !loading ? { scale: 1.03, background: v.hoverBg } : {}}
      whileTap={!disabled && !loading ? { scale: 0.97 } : {}}
      {...props}
    >
      {loading ? (
        <motion.span
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
          style={{ display: 'inline-block', width: '18px', height: '18px', border: '2px solid transparent', borderTopColor: 'currentColor', borderRadius: '50%' }}
        />
      ) : Icon ? (
        <Icon size={size === 'sm' ? 16 : size === 'lg' ? 22 : 18} />
      ) : null}
      {children}
    </motion.button>
  );
}
