import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { colors } from '../styles/theme';

export const Layout = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100svh', background: colors.bgSubtle }}>
      <Header />
      <main style={{ flex: 1, width: '100%', maxWidth: '960px', margin: '0 auto', padding: '32px 24px' }}>
        <Outlet />
      </main>
    </div>
  );
};
