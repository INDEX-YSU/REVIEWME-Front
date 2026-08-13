import { useMemo, useState } from 'react';
import { colors, radius, cardStyle, inputStyle } from '../styles/theme';

type Post = {
  id: number;
  title: string;
  excerpt: string;
  author: string;
  createdAt: string;
  likes: number;
  comments: number;
  views: number;
  hasAiSummary: boolean;
};

const MOCK_POSTS: Post[] = [
  {
    id: 1,
    title: 'React 19 useOptimistic 훅으로 낙관적 업데이트 깔끔하게 처리하기',
    excerpt: '서버 응답을 기다리지 않고 UI를 먼저 업데이트하는 패턴을 useOptimistic으로 리팩터링한 경험을 공유합니다.',
    author: 'sumin.dev',
    createdAt: '2026-08-12',
    likes: 42,
    comments: 11,
    views: 512,
    hasAiSummary: true,
  },
  {
    id: 2,
    title: '신입 프론트엔드 개발자 포트폴리오, 이렇게 정리했습니다',
    excerpt: 'GitHub 잔디보다 중요한 건 문제 해결 과정 기록이었습니다. 면접에서 실제로 받았던 질문들도 함께 정리했어요.',
    author: 'yeon_j',
    createdAt: '2026-08-11',
    likes: 128,
    comments: 34,
    views: 2310,
    hasAiSummary: true,
  },
  {
    id: 3,
    title: 'TypeScript verbatimModuleSyntax, 켜야 할까 말아야 할까',
    excerpt: '타입과 값을 명시적으로 분리해야 하는 이 옵션이 번들 크기와 빌드 속도에 실제로 미치는 영향을 측정해봤습니다.',
    author: 'kimcoding',
    createdAt: '2026-08-10',
    likes: 76,
    comments: 19,
    views: 980,
    hasAiSummary: false,
  },
  {
    id: 4,
    title: '스프링 배치로 대용량 정산 데이터 처리하며 겪은 삽질기',
    excerpt: 'Chunk 크기와 격리 수준을 잘못 잡아서 데드락이 났던 사건부터 해결 과정까지 기록했습니다.',
    author: 'backend_hoon',
    createdAt: '2026-08-09',
    likes: 55,
    comments: 8,
    views: 641,
    hasAiSummary: false,
  },
  {
    id: 5,
    title: 'LLM 기반 코드 리뷰 봇 사이드 프로젝트, 3개월 회고',
    excerpt: 'Claude API로 PR 리뷰를 자동화하면서 프롬프트 설계보다 컨텍스트 관리가 더 중요하다는 걸 깨달았습니다.',
    author: 'ai_juyeon',
    createdAt: '2026-08-08',
    likes: 203,
    comments: 47,
    views: 4120,
    hasAiSummary: true,
  },
  {
    id: 6,
    title: '오픈채팅으로 스터디 모집해서 6주간 알고리즘 스터디 운영한 후기',
    excerpt: '커뮤니티에서 만난 5명과 매일 아침 인증하며 진행한 스터디, 어떻게 굴러갔는지 공유합니다.',
    author: 'study_master',
    createdAt: '2026-08-05',
    likes: 31,
    comments: 6,
    views: 305,
    hasAiSummary: false,
  },
];

const SORT_OPTIONS = [
  { key: 'latest', label: '최신순' },
  { key: 'likes', label: '추천순' },
  { key: 'views', label: '조회순' },
] as const;

type SortKey = (typeof SORT_OPTIONS)[number]['key'];

export const MainPage = () => {
  const [keyword, setKeyword] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('latest');

  const posts = useMemo(() => {
    const filtered = MOCK_POSTS.filter(
      (post) => post.title.includes(keyword) || post.excerpt.includes(keyword) || post.author.includes(keyword),
    );

    return [...filtered].sort((a, b) => {
      if (sortKey === 'likes') return b.likes - a.likes;
      if (sortKey === 'views') return b.views - a.views;
      return b.createdAt.localeCompare(a.createdAt);
    });
  }, [keyword, sortKey]);

  return (
    <div>
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="제목, 내용, 작성자로 검색"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          style={{ ...inputStyle, flex: 1 }}
        />
        <div style={{ display: 'flex', gap: '6px' }}>
          {SORT_OPTIONS.map((option) => (
            <button
              key={option.key}
              type="button"
              onClick={() => setSortKey(option.key)}
              style={{
                padding: '10px 14px',
                borderRadius: radius.md,
                border: `1px solid ${sortKey === option.key ? colors.accentBorder : colors.border}`,
                background: sortKey === option.key ? colors.accentBg : colors.bg,
                color: sortKey === option.key ? colors.accent : colors.text,
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {posts.map((post) => (
          <article key={post.id} style={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <h3 style={{ fontSize: '17px' }}>{post.title}</h3>
              {post.hasAiSummary && (
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    color: colors.accent,
                    background: colors.accentBg,
                    border: `1px solid ${colors.accentBorder}`,
                    borderRadius: radius.pill,
                    padding: '2px 8px',
                    whiteSpace: 'nowrap',
                  }}
                >
                  AI 요약
                </span>
              )}
            </div>
            <p style={{ color: colors.text, fontSize: '14px', marginBottom: '14px' }}>{post.excerpt}</p>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '12px',
                color: colors.text,
              }}
            >
              <span>
                {post.author} · {post.createdAt}
              </span>
              <span style={{ display: 'flex', gap: '12px' }}>
                <span>추천 {post.likes}</span>
                <span>댓글 {post.comments}</span>
                <span>조회 {post.views.toLocaleString()}</span>
              </span>
            </div>
          </article>
        ))}

        {posts.length === 0 && (
          <p style={{ textAlign: 'center', color: colors.text, padding: '40px 0' }}>검색 결과가 없습니다.</p>
        )}
      </div>
    </div>
  );
};
