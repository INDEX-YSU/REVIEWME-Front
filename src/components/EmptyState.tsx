import { colors } from '../styles/theme';

type EmptyStateProps = {
  icon?: string;
  title: string;
  description?: string;
};

export const EmptyState = ({ icon = '🗂️', title, description }: EmptyStateProps) => (
  <div style={{ textAlign: 'center', padding: '48px 20px' }}>
    <p style={{ fontSize: '32px', marginBottom: '10px' }}>{icon}</p>
    <p style={{ fontSize: '14px', fontWeight: 600, color: colors.textHeading, marginBottom: description ? '6px' : 0 }}>
      {title}
    </p>
    {description && <p style={{ fontSize: '13px', color: colors.text }}>{description}</p>}
  </div>
);
