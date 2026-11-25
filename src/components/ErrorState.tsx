import { colors, cardStyle, secondaryButtonStyle } from '../styles/theme';

type ErrorStateProps = {
  title?: string;
  description?: string;
  retryLabel?: string;
  onRetry: () => void;
};

export const ErrorState = ({
  title = '문제가 발생했어요',
  description = '잠시 후 다시 시도해주세요.',
  retryLabel = '다시 시도',
  onRetry,
}: ErrorStateProps) => (
  <div style={{ ...cardStyle, textAlign: 'center', padding: '32px 20px' }}>
    <p style={{ fontSize: '28px', marginBottom: '8px' }}>⚠️</p>
    <p style={{ fontSize: '14px', fontWeight: 600, color: colors.textHeading, marginBottom: '6px' }}>{title}</p>
    <p style={{ fontSize: '13px', color: colors.text, marginBottom: '16px' }}>{description}</p>
    <button type="button" onClick={onRetry} style={secondaryButtonStyle}>
      {retryLabel}
    </button>
  </div>
);
