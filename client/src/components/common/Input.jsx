import { useState } from 'react';

export default function Input({
  label,
  error,
  icon: Icon,
  type = 'text',
  id,
  required,
  style: customStyle,
  containerStyle,
  ...props
}) {
  const [focused, setFocused] = useState(false);

  const wrapperStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    width: '100%',
    ...containerStyle,
  };

  const labelStyle = {
    fontSize: '0.9rem',
    fontWeight: 500,
    color: '#E0E0E0',
  };

  const inputWrapperStyle = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  };

  const inputStyle = {
    width: '100%',
    padding: Icon ? '12px 16px 12px 44px' : '12px 16px',
    fontSize: '1rem',
    fontFamily: "'Inter', sans-serif",
    background: '#1A1A1A',
    border: `2px solid ${error ? '#EF4444' : focused ? '#FF6B00' : '#3A3A3A'}`,
    borderRadius: '10px',
    color: '#E0E0E0',
    outline: 'none',
    transition: 'border-color 0.2s ease',
    ...customStyle,
  };

  const iconStyle = {
    position: 'absolute',
    left: '14px',
    color: focused ? '#FF6B00' : '#A0A0A0',
    pointerEvents: 'none',
    transition: 'color 0.2s ease',
  };

  const errorStyle = {
    fontSize: '0.8rem',
    color: '#EF4444',
    marginTop: '2px',
  };

  return (
    <div style={wrapperStyle}>
      {label && (
        <label htmlFor={id} style={labelStyle}>
          {label}
          {required && <span style={{ color: '#FF6B00', marginLeft: '4px' }}>*</span>}
        </label>
      )}
      <div style={inputWrapperStyle}>
        {Icon && <Icon size={18} style={iconStyle} />}
        <input
          id={id}
          type={type}
          style={inputStyle}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          required={required}
          {...props}
        />
      </div>
      {error && (
        <span id={`${id}-error`} style={errorStyle} role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
