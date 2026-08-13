import type { CSSProperties } from 'react';

export const colors = {
  bg: 'var(--bg)',
  bgSubtle: 'var(--bg-subtle)',
  border: 'var(--border)',
  borderSubtle: 'var(--border-subtle)',
  text: 'var(--text)',
  textHeading: 'var(--text-h)',
  accent: 'var(--accent)',
  accentHover: 'var(--accent-hover)',
  accentBg: 'var(--accent-bg)',
  accentBorder: 'var(--accent-border)',
  success: 'var(--success)',
  successBg: 'var(--success-bg)',
  danger: 'var(--danger)',
} as const;

export const radius = {
  sm: '6px',
  md: '8px',
  lg: '12px',
  pill: '999px',
} as const;

export const shadow = 'var(--shadow)';

export const fontMono = 'var(--mono)';

export const badgeStyle = (variant: 'guest' | 'user'): CSSProperties => ({
  display: 'inline-flex',
  alignItems: 'center',
  padding: '2px 10px',
  borderRadius: radius.pill,
  fontSize: '12px',
  fontWeight: 600,
  letterSpacing: '0.02em',
  border: `1px solid ${variant === 'user' ? colors.accentBorder : colors.border}`,
  color: variant === 'user' ? colors.accent : colors.text,
  background: variant === 'user' ? colors.accentBg : colors.bgSubtle,
});

export const cardStyle: CSSProperties = {
  background: colors.bg,
  border: `1px solid ${colors.border}`,
  borderRadius: radius.lg,
  padding: '20px',
};

export const primaryButtonStyle: CSSProperties = {
  background: colors.accent,
  color: '#fff',
  border: '1px solid transparent',
  borderRadius: radius.md,
  padding: '10px 16px',
  fontSize: '14px',
  fontWeight: 600,
  cursor: 'pointer',
};

export const secondaryButtonStyle: CSSProperties = {
  background: colors.bg,
  color: colors.textHeading,
  border: `1px solid ${colors.border}`,
  borderRadius: radius.md,
  padding: '10px 16px',
  fontSize: '14px',
  fontWeight: 600,
  cursor: 'pointer',
};

export const inputStyle: CSSProperties = {
  width: '100%',
  padding: '10px 12px',
  borderRadius: radius.md,
  border: `1px solid ${colors.border}`,
  background: colors.bg,
  color: colors.textHeading,
  fontSize: '14px',
};
