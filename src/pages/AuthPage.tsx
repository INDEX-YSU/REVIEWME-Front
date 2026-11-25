import { useState } from 'react';
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { api, errorMessage } from '../api';
import { useAuth } from '../context/useAuth';
import { cardStyle, colors, inputStyle, primaryButtonStyle, shadow } from '../styles/theme';

export function AuthPage({ register = false }: { register?: boolean }) {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { login, user } = useAuth();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const target = params.get('next') ?? '/';
  const next = /^\/(?![/\\])/.test(target) ? target : '/';
  const query = next === '/' ? '' : `?next=${encodeURIComponent(next)}`;

  if (user.isLoggedIn) return <Navigate to={next} replace />;

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (busy) return;
    const fields = new FormData(event.currentTarget);
    const email = String(fields.get('email')).trim();
    const password = String(fields.get('password'));
    setBusy(true);
    setError('');
    try {
      if (register) {
        await api('/auth/signup', {
          method: 'POST', body: { email, password, nickname: String(fields.get('nickname')).trim() },
        });
      }
      await login(email, password);
      navigate(next, { replace: true });
    } catch (failure) {
      setError(errorMessage(failure));
    } finally {
      setBusy(false);
    }
  };

  const title = register ? '회원가입' : '로그인';
  return (
    <div style={{ ...cardStyle, boxShadow: shadow, maxWidth: '380px', margin: '40px auto' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '24px' }}>{title}</h2>
      <form onSubmit={submit} style={{ display: 'grid', gap: '12px' }}>
        {register && <label>닉네임
          <input name="nickname" autoComplete="nickname" required maxLength={100} style={inputStyle} />
        </label>}
        <label>이메일
          <input name="email" type="email" autoComplete="email" required maxLength={255} style={inputStyle} />
        </label>
        <label>비밀번호
          <input name="password" type="password" autoComplete={register ? 'new-password' : 'current-password'}
            required minLength={register ? 8 : undefined} maxLength={64} style={inputStyle} />
        </label>
        {register && <small style={{ color: colors.text }}>영문, 숫자, 특수문자를 포함해 8~64자로 입력하세요.</small>}
        {error && <p role="alert" style={{ color: colors.danger }}>{error}</p>}
        <button type="submit" style={primaryButtonStyle} disabled={busy}>{busy ? '처리 중…' : title}</button>
      </form>
      <p style={{ marginTop: '20px', textAlign: 'center' }}>
        <Link to={(register ? '/login' : '/register') + query}>{register ? '이미 계정이 있습니다' : '새 계정 만들기'}</Link>
      </p>
    </div>
  );
}
