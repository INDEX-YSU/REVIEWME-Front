import { useState } from 'react';
import { Link } from 'react-router-dom';
import { dateTime } from '../api';
import { EmptyState } from '../components/EmptyState';
import { Loading, RequestError } from '../components/ResourceState';
import { useResource } from '../hooks/useResource';
import { getExcerpt, type Post } from '../posts';
import { cardStyle, colors, inputStyle, primaryButtonStyle, secondaryButtonStyle } from '../styles/theme';

const sorts = { latest: '최신순', likes: '추천순', views: '조회순' } as const;
type Sort = keyof typeof sorts;
const pageSize = 5;

export function MainPage() {
  const { result, reload } = useResource<Post[]>('/posts');
  const [keyword, setKeyword] = useState('');
  const [sort, setSort] = useState<Sort>('latest');
  const [page, setPage] = useState(1);
  if (result.status === 'loading') return <Loading />;
  if (result.status === 'error') return <RequestError message={result.message} retry={reload} />;

  const query = keyword.trim().toLocaleLowerCase();
  const posts = result.value.filter(({ title, content, author }) =>
    [title, content, author].some((value) => value.toLocaleLowerCase().includes(query)));
  posts.sort((a, b) => (sort === 'latest' ? 0 : b[sort] - a[sort]) || b.id - a.id);
  const pages = Math.max(1, Math.ceil(posts.length / pageSize));
  const current = Math.min(page, pages);
  const visiblePosts = posts.slice((current - 1) * pageSize, current * pageSize);

  return <div>
    <section className="community-intro" aria-labelledby="community-title">
      <h1 id="community-title">코드 리뷰 커뮤니티</h1>
      <p>코드를 공유하고 동료에게 피드백을 받아보세요.</p>
    </section>
    <div className="mvp-toolbar" style={{ marginBottom: 20 }}>
      <input aria-label="게시글 검색" placeholder="제목, 내용, 작성자로 검색" value={keyword}
        onChange={(event) => { setKeyword(event.target.value); setPage(1); }} style={{ ...inputStyle, flex: '1 1 240px' }} />
      <select aria-label="정렬" value={sort} onChange={(event) => { setSort(event.target.value as Sort); setPage(1); }}
        style={{ ...inputStyle, width: 'auto' }}>
        {Object.entries(sorts).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
      </select>
      <Link to="/posts/create" style={primaryButtonStyle}>글쓰기</Link>
    </div>
    <div style={{ display: 'grid', gap: 12 }}>
      {!visiblePosts.length && <EmptyState icon="📝" title={query ? '검색 결과가 없어요' : '아직 게시글이 없어요'}
        description={query ? '다른 검색어로 찾아보세요.' : '첫 게시글을 작성해 보세요.'} />}
      {visiblePosts.map((post) => <article key={post.id} className="post-list-card" style={cardStyle}>
        <span style={{ color: colors.accent, fontSize: 13, fontWeight: 700 }}>{post.category}</span>
        <h2 style={{ fontSize: 19, margin: '6px 0' }}><Link to={`/posts/${post.id}`} style={{ color: colors.textHeading }}>
          {post.title}
        </Link></h2>
        <p>{getExcerpt(post.content)}</p>
        <p className="mvp-toolbar" style={{ color: colors.text, fontSize: 13, marginTop: 10 }}>
          <span>{post.author}</span><time dateTime={post.createdAt}>{dateTime(post.createdAt)}</time>
          <span>추천 {post.likes}</span><span>댓글 {post.comments}</span><span>조회 {post.views}</span>
        </p>
      </article>)}
    </div>
    {pages > 1 && <nav aria-label="게시글 페이지" className="mvp-toolbar" style={{ marginTop: 16, justifyContent: 'center' }}>
      <button type="button" disabled={current <= 1} onClick={() => setPage(current - 1)} style={secondaryButtonStyle}>이전</button>
      <span>{current} / {pages}</span>
      <button type="button" disabled={current >= pages} onClick={() => setPage(current + 1)} style={secondaryButtonStyle}>다음</button>
    </nav>}
  </div>;
}
