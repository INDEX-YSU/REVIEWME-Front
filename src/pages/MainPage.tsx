import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getExcerpt, getPosts } from '../mocks/posts';
import { colors, radius, cardStyle, inputStyle, primaryButtonStyle } from '../styles/theme';

const SORT_OPTIONS = [
  { key: 'latest', label: '최신순' },
  { key: 'likes', label: '추천순' },
  { key: 'views', label: '조회순' },
] as const;

type SortKey = (typeof SORT_OPTIONS)[number]['key'];

const PAGE_SIZE = 5;

export const MainPage = () => {
  const [keyword, setKeyword] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('latest');
  const [page, setPage] = useState(1);

  // 검색어/정렬이 바뀌면 1페이지로 리셋 (렌더 중 상태 조정 패턴)
  const [prevKeyword, setPrevKeyword] = useState(keyword);
  const [prevSortKey, setPrevSortKey] = useState(sortKey);
  if (keyword !== prevKeyword || sortKey !== prevSortKey) {
    setPrevKeyword(keyword);
    setPrevSortKey(sortKey);
    setPage(1);
  }

  const posts = useMemo(() => {
    const filtered = getPosts().filter(
      (post) => post.title.includes(keyword) || post.content.includes(keyword) || post.author.includes(keyword),
    );

    return [...filtered].sort((a, b) => {
      if (sortKey === 'likes') return b.likes - a.likes;
      if (sortKey === 'views') return b.views - a.views;
      return b.createdAt.localeCompare(a.createdAt);
    });
  }, [keyword, sortKey]);

  const totalPages = Math.max(1, Math.ceil(posts.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pagedPosts = posts.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

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
        <Link to="/posts/create" style={{ ...primaryButtonStyle, textDecoration: 'none', whiteSpace: 'nowrap' }}>
          글쓰기
        </Link>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {pagedPosts.map((post) => (
          <Link key={post.id} to={`/posts/${post.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <article style={cardStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    color: colors.text,
                    background: colors.bgSubtle,
                    border: `1px solid ${colors.border}`,
                    borderRadius: radius.pill,
                    padding: '2px 8px',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {post.category}
                </span>
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
              <p style={{ color: colors.text, fontSize: '14px', marginBottom: '14px' }}>{getExcerpt(post.content)}</p>
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
          </Link>
        ))}

        {pagedPosts.length === 0 && (
          <p style={{ textAlign: 'center', color: colors.text, padding: '40px 0' }}>검색 결과가 없습니다.</p>
        )}
      </div>

      {posts.length > 0 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px', marginTop: '28px' }}>
          <button
            type="button"
            disabled={safePage === 1}
            onClick={() => setPage(Math.max(1, safePage - 1))}
            style={{
              padding: '8px 12px',
              borderRadius: radius.md,
              border: `1px solid ${colors.border}`,
              background: colors.bg,
              color: colors.text,
              fontSize: '13px',
              fontWeight: 600,
              cursor: safePage === 1 ? 'not-allowed' : 'pointer',
              opacity: safePage === 1 ? 0.5 : 1,
            }}
          >
            이전
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
            <button
              key={pageNumber}
              type="button"
              onClick={() => setPage(pageNumber)}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: radius.md,
                border: `1px solid ${safePage === pageNumber ? colors.accentBorder : colors.border}`,
                background: safePage === pageNumber ? colors.accentBg : colors.bg,
                color: safePage === pageNumber ? colors.accent : colors.text,
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {pageNumber}
            </button>
          ))}

          <button
            type="button"
            disabled={safePage === totalPages}
            onClick={() => setPage(Math.min(totalPages, safePage + 1))}
            style={{
              padding: '8px 12px',
              borderRadius: radius.md,
              border: `1px solid ${colors.border}`,
              background: colors.bg,
              color: colors.text,
              fontSize: '13px',
              fontWeight: 600,
              cursor: safePage === totalPages ? 'not-allowed' : 'pointer',
              opacity: safePage === totalPages ? 0.5 : 1,
            }}
          >
            다음
          </button>
        </div>
      )}
    </div>
  );
};
