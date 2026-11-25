import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, dateTime, errorMessage } from '../api';
import { useAuth } from '../context/useAuth';
import { useResource } from '../hooks/useResource';
import type { Comment } from '../posts';
import { cardStyle, colors, inputStyle, primaryButtonStyle, secondaryButtonStyle } from '../styles/theme';
import { Loading, RequestError } from './ResourceState';

type Props = { postId: number; initialCount: number; onCountChange: (count: number) => void };

export function CommentSection({ postId, initialCount, onCountChange }: Props) {
  const path = `/posts/${postId}/comments`;
  const { result, reload } = useResource<Comment[]>(path);
  const count = result.status === 'ready' ? result.value.length : initialCount;
  useEffect(() => { onCountChange(count); }, [count, onCountChange]);
  if (result.status === 'loading') return <Loading />;
  if (result.status === 'error') return <RequestError message={result.message} retry={reload} />;
  return <Comments path={path} items={result.value} reload={reload} />;
}

function Comments({ path, items, reload }: { path: string; items: Comment[]; reload: () => void }) {
  const { user } = useAuth();
  const [draft, setDraft] = useState('');
  const [edit, setEdit] = useState<{ id: number; content: string }>();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const change = async (method: string, id?: number, content?: string) => {
    if (busy) return;
    setBusy(true);
    setError('');
    try {
      await api(id === undefined ? path : `${path}/${id}`, {
        method, body: content === undefined ? undefined : { content },
      });
      if (method === 'POST') setDraft('');
      if (id === edit?.id) setEdit(undefined);
      reload();
    } catch (failure) {
      setError(errorMessage(failure));
    } finally {
      setBusy(false);
    }
  };

  return <>
    <h3 style={{ marginBottom: 12 }}>댓글 {items.length}</h3>
    <div style={{ display: 'grid', gap: 10, marginBottom: 16 }}>
      {items.length === 0 && <p style={{ color: colors.text }}>아직 댓글이 없어요.</p>}
      {items.map((comment) => <article key={comment.id} style={cardStyle}>
        <div className="mvp-toolbar" style={{ marginBottom: 6 }}>
          <strong>{comment.author}</strong>
          <time dateTime={comment.createdAt} style={{ color: colors.text }}>{dateTime(comment.createdAt)}</time>
          {comment.authorId === user.userId && edit?.id !== comment.id && <>
            <button type="button" onClick={() => setEdit(comment)} style={secondaryButtonStyle}>댓글 수정</button>
            <button type="button" disabled={busy} style={secondaryButtonStyle}
              onClick={() => { if (window.confirm('댓글을 삭제하시겠어요?')) void change('DELETE', comment.id); }}>댓글 삭제</button>
          </>}
        </div>
        {edit?.id === comment.id ? <form onSubmit={(event) => { event.preventDefault(); void change('PUT', edit.id, edit.content); }}>
          <textarea aria-label="댓글 수정" value={edit.content} maxLength={2000} required style={inputStyle}
            onChange={(event) => setEdit({ ...edit, content: event.target.value })} />
          <div className="mvp-toolbar">
            <button type="submit" disabled={busy || !edit.content.trim()} style={primaryButtonStyle}>저장</button>
            <button type="button" onClick={() => setEdit(undefined)} style={secondaryButtonStyle}>취소</button>
          </div>
        </form> : <p style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>{comment.content}</p>}
      </article>)}
    </div>
    {error && <p role="alert" style={{ color: colors.danger }}>{error}</p>}
    {user.isLoggedIn ? <form className="mvp-toolbar" onSubmit={(event) => {
      event.preventDefault();
      if (draft.trim()) void change('POST', undefined, draft);
    }}>
      <input aria-label="댓글" placeholder="댓글을 입력해주세요" value={draft} maxLength={2000}
        style={{ ...inputStyle, flex: 1 }} onChange={(event) => setDraft(event.target.value)} required />
      <button type="submit" disabled={busy || !draft.trim()} style={primaryButtonStyle}>댓글 작성</button>
    </form> : <Link to={`/login?next=${encodeURIComponent(`/posts/${items[0]?.postId ?? path.split('/')[2]}`)}`}>로그인하고 댓글 작성</Link>}
  </>;
}
