import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { colors, radius, shadow, cardStyle, primaryButtonStyle, inputStyle } from '../styles/theme';
import { GithubIcon, GoogleIcon } from '../components/OAuthIcons';
import { getMockAuthorizeUrl } from '../context/oauth';

const oauthButtonStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  width: '100%',
  padding: '10px 16px',
  borderRadius: radius.md,
  border: `1px solid ${colors.border}`,
  background: colors.bg,
  color: colors.textHeading,
  fontSize: '14px',
  fontWeight: 600,
  cursor: 'pointer',
};

export const RegisterPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('회원가입 시도:', { email, password, nickname });
    // 추후 백엔드 연결 예정
  };

  return (
    <div style={{ maxWidth: '380px', margin: '40px auto' }}>
      <div style={{ ...cardStyle, boxShadow: shadow }}>
        <h2 style={{ textAlign: 'center', marginBottom: '24px' }}>회원가입</h2>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <input
            type="text"
            placeholder="닉네임"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            style={inputStyle}
            required
          />
          <input
            type="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
            required
          />
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
            required
          />
          <button type="submit" style={{ ...primaryButtonStyle, marginTop: '4px' }}>
            회원가입
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '20px 0' }}>
          <div style={{ flex: 1, height: '1px', background: colors.border }} />
          <span style={{ fontSize: '12px', color: colors.text }}>또는</span>
          <div style={{ flex: 1, height: '1px', background: colors.border }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button type="button" style={oauthButtonStyle} onClick={() => navigate(getMockAuthorizeUrl('github'))}>
            <GithubIcon />
            GitHub로 계속하기
          </button>
          <button type="button" style={oauthButtonStyle} onClick={() => navigate(getMockAuthorizeUrl('google'))}>
            <GoogleIcon />
            Google로 계속하기
          </button>
        </div>

        <p
          style={{
            marginTop: '20px',
            padding: '12px',
            borderRadius: radius.md,
            background: colors.accentBg,
            color: colors.text,
            fontSize: '12px',
            lineHeight: 1.5,
          }}
        >
          GitHub 미연동 시 <strong style={{ color: colors.textHeading }}>Guest 권한</strong>이 부여되며, 일부
          채팅방 입장이 제한될 수 있습니다.
        </p>

        <p style={{ textAlign: 'center', fontSize: '13px', color: colors.text, marginTop: '20px' }}>
          이미 계정이 있으신가요?{' '}
          <Link to="/login" style={{ color: colors.accent, fontWeight: 600, textDecoration: 'none' }}>
            로그인
          </Link>
        </p>
      </div>
    </div>
  );
};
