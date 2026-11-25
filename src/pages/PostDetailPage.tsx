import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { api, dateTime, errorMessage } from '../api';
import { CommentSection } from '../components/CommentSection';
import { InfoScreen } from '../components/InfoScreen';
import { MarkdownContent } from '../components/MarkdownContent';
import { Loading, RequestError } from '../components/ResourceState';
import { useAuth } from '../context/useAuth';
import { useResource } from '../hooks/useResource';
import { getExcerpt, type Post } from '../posts';
import { cardStyle, colors, secondaryButtonStyle, shadow } from '../styles/theme';

export function PostDetailPage() {
  const { id } = useParams();
  const location = useLocation();
  const { result, reload } = useResource<Post>(`/posts/${id}`);
  if (result.status === 'loading') return <Loading />;
  if (result.status === 'error') {
    if (result.statusCode === 404) return <InfoScreen title="게시글을 찾을 수 없습니다"
      description="게시글 주소를 확인해 주세요." actionLabel="목록으로" actionTo="/" />;
    return <RequestError message={result.message} retry={reload} />;
  }
  return <PostView key={location.key} post={result.value} />;
}

function PostView({ post }: { post: Post }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const postPath = `/posts/${post.id}`;
  const [views, setViews] = useState(post.views);
  const viewRequest = useRef<Promise<number> | null>(null);
  const [like, setLike] = useState({ likes: post.likes, likedByMe: post.likedByMe });
  const [commentCount, setCommentCount] = useState(post.comments);
  const [showExcerpt, setShowExcerpt] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const loginPath = `/login?next=${encodeURIComponent(postPath)}`;

  useEffect(() => {
    let mounted = true;
    viewRequest.current ??= api<number>(`${postPath}/views`, { method: 'POST' });
    void viewRequest.current.then((count) => { if (mounted) setViews(count); }).catch(() => {});
    return () => { mounted = false; };
  }, [postPath]);

  const change = async (action: () => Promise<void>) => {
    if (busy) return;
    setError('');
    setBusy(true);
    try { await action(); }
    catch (failure) { setError(errorMessage(failure)); }
    finally { setBusy(false); }
  };

  const remove = () => {
    if (!window.confirm('게시글을 삭제하시겠어요?')) return;
    void change(async () => {
      await api(postPath, { method: 'DELETE' });
      navigate('/', { replace: true });
    });
  };

  const toggleLike = () => {
    if (!user.isLoggedIn) return navigate(loginPath);
    void change(async () => {
      setLike(await api<typeof like>(`${postPath}/like`, { method: like.likedByMe ? 'DELETE' : 'PUT' }));
    });
  };

  return <div>
    <article style={{ ...cardStyle, boxShadow: shadow, marginBottom: 20 }}>
      <div className="mvp-toolbar" style={{ justifyContent: 'space-between' }}>
        <div>
          <span style={{ color: colors.accent, fontWeight: 700 }}>{post.category}</span>
          <h1 style={{ fontSize: 24, margin: '8px 0' }}>{post.title}</h1>
        </div>
        {post.authorId === user.userId && <div className="mvp-toolbar">
          <Link to={`${postPath}/edit`} style={secondaryButtonStyle}>수정</Link>
          <button type="button" onClick={remove} disabled={busy} style={secondaryButtonStyle}>삭제</button>
        </div>}
      </div>
      <p className="mvp-toolbar" style={{ color: colors.text, fontSize: 13, marginBottom: 16 }}>
        <span>{post.author}</span><time dateTime={post.createdAt}>{dateTime(post.createdAt)}</time>
        <span>조회 {views}</span><span>추천 {like.likes}</span><span>댓글 {commentCount}</span>
      </p>
      <div className="mvp-toolbar">
        <button type="button" aria-pressed={like.likedByMe} disabled={busy} onClick={toggleLike}
          style={secondaryButtonStyle}>{like.likedByMe ? '추천 취소' : '추천하기'}</button>
        <button type="button" aria-expanded={showExcerpt} onClick={() => setShowExcerpt(!showExcerpt)}
          style={secondaryButtonStyle}>{showExcerpt ? '발췌 접기' : '본문 발췌'}</button>
      </div>
      {error && <p role="alert" style={{ color: colors.danger }}>{error}</p>}
      {showExcerpt && <p style={{ marginTop: 16 }}>{getExcerpt(post.content, 260) || '본문에 발췌할 텍스트가 없습니다.'}</p>}
      <div style={{ paddingTop: 20 }}><MarkdownContent content={post.content} /></div>
    </article>
    <div style={{ ...cardStyle, marginBottom: 20 }}>
      <CommentSection postId={post.id} initialCount={post.comments} onCountChange={setCommentCount} />
    </div>
    <Link to="/">← 목록으로</Link>
  </div>;
}
