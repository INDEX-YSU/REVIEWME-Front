import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { getMockAuthorizeUrl } from '../context/oauth';
import { colors, radius, shadow, cardStyle, primaryButtonStyle, secondaryButtonStyle, badgeStyle } from '../styles/theme';
import { GithubIcon, GoogleIcon } from '../components/OAuthIcons';
import { InfoScreen } from '../components/InfoScreen';
import { ProfileEditModal } from '../components/ProfileEditModal';

type Repo = {
  id: number;
  name: string;
  description: string;
  language: string;
  stars: number;
  url: string;
};

const MOCK_REPOS: Repo[] = [
  {
    id: 1,
    name: 'index-frontend',
    description: 'AI 기반 개발자 커뮤니티 INDEX의 프론트엔드 레포지토리 (React + TypeScript)',
    language: 'TypeScript',
    stars: 48,
    url: 'https://github.com/reviewme-dev/index-frontend',
  },
  {
    id: 2,
    name: 'algo-study-log',
    description: '6주간 진행한 알고리즘 스터디 풀이 및 회고 기록',
    language: 'Python',
    stars: 12,
    url: 'https://github.com/reviewme-dev/algo-study-log',
  },
  {
    id: 3,
    name: 'code-review-bot',
    description: 'Claude API를 활용해 PR을 자동으로 리뷰하는 사이드 프로젝트',
    language: 'TypeScript',
    stars: 96,
    url: 'https://github.com/reviewme-dev/code-review-bot',
  },
  {
    id: 4,
    name: 'design-system',
    description: '모노톤 + 블루 포인트 컬러의 사내 디자인 시스템 컴포넌트 모음',
    language: 'CSS',
    stars: 21,
    url: 'https://github.com/reviewme-dev/design-system',
  },
];

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  Python: '#3572A5',
  CSS: '#563d7c',
  JavaScript: '#f1e05a',
};

const connectionBadgeStyle = (connected: boolean): React.CSSProperties => ({
  fontSize: '12px',
  fontWeight: 600,
  color: connected ? colors.success : colors.text,
  background: connected ? colors.successBg : colors.bgSubtle,
  border: `1px solid ${connected ? colors.success : colors.border}`,
  borderRadius: radius.pill,
  padding: '2px 10px',
});

export const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, role, disconnectProvider, updateProfile } = useAuth();
  const [isEditOpen, setIsEditOpen] = useState(false);

  if (!user.isLoggedIn) {
    return (
      <InfoScreen
        title="로그인이 필요합니다"
        description="프로필을 확인하려면 먼저 로그인해주세요."
        actionLabel="로그인하러 가기"
        actionTo="/login"
      />
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <section style={{ ...cardStyle, boxShadow: shadow, display: 'flex', gap: '20px', alignItems: 'center' }}>
        {user.profileImage ? (
          <img
            src={user.profileImage}
            alt={user.nickname}
            style={{ width: '72px', height: '72px', borderRadius: radius.lg, objectFit: 'cover', flexShrink: 0 }}
          />
        ) : (
          <div
            style={{
              width: '72px',
              height: '72px',
              borderRadius: radius.lg,
              background: colors.accentBg,
              color: colors.accent,
              border: `1px solid ${colors.accentBorder}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '28px',
              fontWeight: 700,
              flexShrink: 0,
            }}
          >
            {user.nickname.charAt(0)}
          </div>
        )}

        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
            <h2 style={{ fontSize: '20px' }}>{user.nickname}</h2>
            <span style={badgeStyle(role === 'USER' ? 'user' : 'guest')}>{role}</span>
          </div>
          <p style={{ color: colors.text, fontSize: '14px' }}>{user.email}</p>
        </div>

        <button type="button" onClick={() => setIsEditOpen(true)} style={secondaryButtonStyle}>
          프로필 수정
        </button>
      </section>

      <section style={{ ...cardStyle, display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div>
          <p style={{ fontSize: '12px', fontWeight: 600, color: colors.text, marginBottom: '6px' }}>자기소개</p>
          <p style={{ fontSize: '14px', color: colors.textHeading, lineHeight: 1.6 }}>
            {user.bio || '아직 작성된 자기소개가 없어요.'}
          </p>
        </div>
        <div>
          <p style={{ fontSize: '12px', fontWeight: 600, color: colors.text, marginBottom: '6px' }}>소속</p>
          <p style={{ fontSize: '14px', color: colors.textHeading }}>{user.affiliation || '미입력'}</p>
        </div>
        <div>
          <p style={{ fontSize: '12px', fontWeight: 600, color: colors.text, marginBottom: '6px' }}>사용 언어</p>
          {user.techStack.length > 0 ? (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {user.techStack.map((tech) => (
                <span
                  key={tech}
                  style={{
                    fontSize: '12px',
                    fontWeight: 600,
                    color: colors.accent,
                    background: colors.accentBg,
                    border: `1px solid ${colors.accentBorder}`,
                    borderRadius: radius.pill,
                    padding: '2px 10px',
                  }}
                >
                  {tech}
                </span>
              ))}
            </div>
          ) : (
            <p style={{ fontSize: '14px', color: colors.textHeading }}>미입력</p>
          )}
        </div>
      </section>

      <section style={{ ...cardStyle, display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h3 style={{ fontSize: '15px' }}>연동 계정</h3>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <GithubIcon />
            <div>
              <p style={{ fontSize: '14px', fontWeight: 600, color: colors.textHeading }}>GitHub</p>
              <span style={connectionBadgeStyle(user.githubConnected)}>
                {user.githubConnected ? `연동됨 · @${user.githubUsername}` : '미연동'}
              </span>
            </div>
          </div>
          {user.githubConnected ? (
            <button type="button" onClick={() => disconnectProvider('github')} style={secondaryButtonStyle}>
              연동 해제
            </button>
          ) : (
            <button
              type="button"
              onClick={() => navigate(getMockAuthorizeUrl('github'))}
              style={primaryButtonStyle}
            >
              연동하기
            </button>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <GoogleIcon />
            <div>
              <p style={{ fontSize: '14px', fontWeight: 600, color: colors.textHeading }}>Google</p>
              <span style={connectionBadgeStyle(user.googleConnected)}>
                {user.googleConnected ? `연동됨 · ${user.googleEmail}` : '미연동'}
              </span>
            </div>
          </div>
          {user.googleConnected ? (
            <button type="button" onClick={() => disconnectProvider('google')} style={secondaryButtonStyle}>
              연동 해제
            </button>
          ) : (
            <button
              type="button"
              onClick={() => navigate(getMockAuthorizeUrl('google'))}
              style={primaryButtonStyle}
            >
              연동하기
            </button>
          )}
        </div>
      </section>

      <section>
        <h3 style={{ fontSize: '16px', marginBottom: '12px' }}>GitHub Public Repository</h3>

        {user.githubConnected ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
            {MOCK_REPOS.map((repo) => (
              <a
                key={repo.id}
                href={repo.url}
                target="_blank"
                rel="noreferrer"
                style={{ ...cardStyle, textDecoration: 'none', display: 'block' }}
              >
                <h4 style={{ color: colors.accent, fontSize: '15px', marginBottom: '6px' }}>{repo.name}</h4>
                <p style={{ color: colors.text, fontSize: '13px', minHeight: '36px', marginBottom: '12px' }}>
                  {repo.description}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '12px', color: colors.text }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span
                      style={{
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        background: LANGUAGE_COLORS[repo.language] ?? colors.border,
                        display: 'inline-block',
                      }}
                    />
                    {repo.language}
                  </span>
                  <span>★ {repo.stars}</span>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div style={{ ...cardStyle, textAlign: 'center', color: colors.text, fontSize: '14px' }}>
            GitHub 계정을 연동하면 Public Repository 목록을 불러올 수 있습니다.
          </div>
        )}
      </section>

      {isEditOpen && (
        <ProfileEditModal user={user} onClose={() => setIsEditOpen(false)} onSave={updateProfile} />
      )}
    </div>
  );
};
