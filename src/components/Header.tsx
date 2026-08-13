import { NavLink, Link } from 'react-router-dom';
import { colors, badgeStyle } from '../styles/theme';

type NavItem = {
  label: string;
  to: string;
};

const NAV_ITEMS: NavItem[] = [
  { label: '게시글', to: '/' },
  { label: '오픈채팅', to: '/chat' },
  { label: '프로필', to: '/profile' },
];

// Mock: 백엔드 연동 전이므로 비로그인(GUEST) 상태를 고정값으로 표시
const isLoggedIn = false;
const mockUser = { nickname: '리뷰미', role: 'USER' as const };

export const Header = () => {
  const role: 'GUEST' | 'USER' = isLoggedIn ? mockUser.role : 'GUEST';

  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        height: '60px',
        borderBottom: `1px solid ${colors.border}`,
        background: colors.bg,
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
        <Link
          to="/"
          style={{
            textDecoration: 'none',
            color: colors.textHeading,
            fontSize: '20px',
            fontWeight: 700,
            letterSpacing: '-0.02em',
          }}
        >
          INDEX
        </Link>
        <nav style={{ display: 'flex', gap: '20px' }}>
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              style={({ isActive }) => ({
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: isActive ? 700 : 500,
                color: isActive ? colors.accent : colors.text,
              })}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={badgeStyle(role === 'USER' ? 'user' : 'guest')}>{role}</span>
        {isLoggedIn ? (
          <span style={{ fontSize: '14px', color: colors.textHeading, fontWeight: 600 }}>
            {mockUser.nickname}
          </span>
        ) : (
          <>
            <Link
              to="/login"
              style={{ textDecoration: 'none', fontSize: '14px', color: colors.text, fontWeight: 500 }}
            >
              로그인
            </Link>
            <Link
              to="/register"
              style={{
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: 600,
                color: '#fff',
                background: colors.accent,
                padding: '8px 14px',
                borderRadius: '6px',
              }}
            >
              회원가입
            </Link>
          </>
        )}
      </div>
    </header>
  );
};
