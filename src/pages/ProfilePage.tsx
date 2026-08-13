import { useState } from 'react';
import { colors, radius, shadow, cardStyle, primaryButtonStyle, secondaryButtonStyle, badgeStyle } from '../styles/theme';
import { GithubIcon } from '../components/OAuthIcons';

type Repo = {
  id: number;
  name: string;
  description: string;
  language: string;
  stars: number;
  url: string;
};

const MOCK_PROFILE = {
  nickname: '리뷰미',
  email: 'ysmin0530@gmail.com',
  role: 'USER' as const,
  githubUsername: 'reviewme-dev',
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

export const ProfilePage = () => {
  const [isGithubConnected, setIsGithubConnected] = useState(true);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <section style={{ ...cardStyle, boxShadow: shadow, display: 'flex', gap: '20px', alignItems: 'center' }}>
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
          {MOCK_PROFILE.nickname.charAt(0)}
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
            <h2 style={{ fontSize: '20px' }}>{MOCK_PROFILE.nickname}</h2>
            <span style={badgeStyle(MOCK_PROFILE.role === 'USER' ? 'user' : 'guest')}>{MOCK_PROFILE.role}</span>
          </div>
          <p style={{ color: colors.text, fontSize: '14px' }}>{MOCK_PROFILE.email}</p>
        </div>

        <button
          type="button"
          onClick={() => setIsGithubConnected((prev) => !prev)}
          style={isGithubConnected ? secondaryButtonStyle : primaryButtonStyle}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <GithubIcon />
            {isGithubConnected ? 'GitHub 연동 해제' : 'GitHub 연동하기'}
          </span>
        </button>
      </section>

      <section>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <h3 style={{ fontSize: '16px' }}>GitHub 연동 상태</h3>
          <span
            style={{
              fontSize: '12px',
              fontWeight: 600,
              color: isGithubConnected ? colors.success : colors.text,
              background: isGithubConnected ? colors.successBg : colors.bgSubtle,
              border: `1px solid ${isGithubConnected ? colors.success : colors.border}`,
              borderRadius: radius.pill,
              padding: '2px 10px',
            }}
          >
            {isGithubConnected ? `연동됨 · @${MOCK_PROFILE.githubUsername}` : '미연동'}
          </span>
        </div>

        {isGithubConnected ? (
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
            GitHub 계정을 연동하면 Public Repository 목록을 확인할 수 있어요.
          </div>
        )}
      </section>
    </div>
  );
};
