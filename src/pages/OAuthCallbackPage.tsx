import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import type { OAuthProvider } from '../context/authTypes';
import { colors, shadow, cardStyle, primaryButtonStyle } from '../styles/theme';
import { GithubIcon, GoogleIcon } from '../components/OAuthIcons';
import { Spinner } from '../components/Spinner';

type OAuthCallbackPageProps = {
  provider: OAuthProvider;
};

const PROVIDER_LABEL: Record<OAuthProvider, string> = { github: 'GitHub', google: 'Google' };

export const OAuthCallbackPage = ({ provider }: OAuthCallbackPageProps) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { loginWithOAuth } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success'>('loading');

  const code = searchParams.get('code');
  const oauthError = searchParams.get('error');
  const hasImmediateError = Boolean(oauthError) || !code;

  useEffect(() => {
    if (hasImmediateError) return;

    const timer = setTimeout(() => {
      loginWithOAuth(provider);
      setStatus('success');
    }, 1000);

    return () => clearTimeout(timer);
  }, [hasImmediateError, provider, loginWithOAuth]);

  useEffect(() => {
    if (status !== 'success') return;
    const timer = setTimeout(() => navigate('/profile'), 900);
    return () => clearTimeout(timer);
  }, [status, navigate]);

  return (
    <div style={{ maxWidth: '380px', margin: '60px auto' }}>
      <div style={{ ...cardStyle, boxShadow: shadow, textAlign: 'center', padding: '40px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px', color: colors.textHeading }}>
          {provider === 'github' ? <GithubIcon /> : <GoogleIcon />}
        </div>

        {hasImmediateError && (
          <>
            <h2 style={{ fontSize: '17px', marginBottom: '8px' }}>인증에 실패했습니다</h2>
            <p style={{ color: colors.danger, fontSize: '13px', marginBottom: '20px' }}>
              {oauthError
                ? `${PROVIDER_LABEL[provider]} 인증이 취소되었습니다.`
                : '인증 코드를 받지 못했어요. 다시 시도해주세요.'}
            </p>
            <Link to="/login" style={{ ...primaryButtonStyle, textDecoration: 'none', display: 'inline-block' }}>
              로그인으로 돌아가기
            </Link>
          </>
        )}

        {!hasImmediateError && status === 'loading' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
              <Spinner />
            </div>
            <p style={{ color: colors.text, fontSize: '14px' }}>
              {PROVIDER_LABEL[provider]} 인증 정보를 확인하고 있어요...
            </p>
          </>
        )}

        {!hasImmediateError && status === 'success' && (
          <>
            <h2 style={{ fontSize: '17px', marginBottom: '8px' }}>{PROVIDER_LABEL[provider]} 연동 완료</h2>
            <p style={{ color: colors.text, fontSize: '14px' }}>잠시 후 프로필 페이지로 이동합니다...</p>
          </>
        )}
      </div>
    </div>
  );
};
