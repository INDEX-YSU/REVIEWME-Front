import { Link } from 'react-router-dom';
import { colors, cardStyle, secondaryButtonStyle } from '../styles/theme';

type InfoScreenProps = {
  title: string;
  description: string;
  actionLabel: string;
  actionTo: string;
};

export const InfoScreen = ({ title, description, actionLabel, actionTo }: InfoScreenProps) => (
  <div style={{ ...cardStyle, textAlign: 'center', padding: '60px 20px' }}>
    <h2 style={{ marginBottom: '8px' }}>{title}</h2>
    <p style={{ color: colors.text, marginBottom: '20px' }}>{description}</p>
    <Link to={actionTo} style={{ ...secondaryButtonStyle, textDecoration: 'none' }}>
      {actionLabel}
    </Link>
  </div>
);
