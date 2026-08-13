import { Link } from 'react-router-dom';

export const Header = () => {
  return (
    <header style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', borderBottom: '1px solid #ccc' }}>
      <h2><Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>REVIEWME</Link></h2>
      <nav>
        <Link to="/login" style={{ marginRight: '1rem' }}>로그인</Link>
        <Link to="/register">회원가입</Link>
      </nav>
    </header>
  );
};