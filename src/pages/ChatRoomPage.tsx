import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api, dateTime, errorMessage } from '../api';
import type { ChatMessage, ChatRoom } from '../chat';
import { InfoScreen } from '../components/InfoScreen';
import { PrivateInviteModal } from '../components/PrivateInviteModal';
import { Loading, LoginRequired, RequestError } from '../components/ResourceState';
import { useAuth } from '../context/useAuth';
import { useResource } from '../hooks/useResource';
import { cardStyle, colors, inputStyle, primaryButtonStyle, secondaryButtonStyle } from '../styles/theme';

export function ChatRoomPage() {
  const { roomId } = useParams();
  const { result, reload } = useResource<ChatRoom>(`/chat/rooms/${roomId}`);
  if (result.status === 'loading') return <Loading />;
  if (result.status === 'error') {
    if (result.statusCode === 401) return <LoginRequired />;
    if (result.statusCode === 403 || result.statusCode === 404) {
      return <InfoScreen title="채팅방에 입장할 수 없습니다" description={result.message} actionLabel="채팅방 목록" actionTo="/chat" />;
    }
    return <RequestError message={result.message} retry={reload} />;
  }
  return <RoomView key={result.value.id} room={result.value} />;
}

function mergeMessages(previous: ChatMessage[], incoming: ChatMessage[]) {
  const entries = new Map(previous.map((message) => [message.id, message]));
  for (const message of incoming) {
    if (!entries.get(message.id)?.isDeleted) entries.set(message.id, message);
  }
  return [...entries.values()].sort((a, b) => a.id - b.id);
}

function RoomView({ room }: { room: ChatRoom }) {
  const { user } = useAuth();
  const path = `/chat/rooms/${room.id}/messages`;
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [more, setMore] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [draft, setDraft] = useState('');
  const [busy, setBusy] = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [actionError, setActionError] = useState('');
  const list = useRef<HTMLDivElement>(null);
  const stickToBottom = useRef(true);

  useEffect(() => {
    const controller = new AbortController();
    let initial = true;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const poll = async () => {
      try {
        const batch = await api<ChatMessage[]>(path, { signal: controller.signal });
        if (controller.signal.aborted) return;
        if (initial) setMore(batch.length === 50);
        setMessages((previous) => mergeMessages(previous, batch));
        setLoaded(true);
        setLoadError('');
        initial = false;
      } catch (error) {
        if (!controller.signal.aborted) setLoadError(errorMessage(error));
      } finally {
        if (!controller.signal.aborted) timer = setTimeout(poll, 2500);
      }
    };
    void poll();
    return () => { controller.abort(); clearTimeout(timer); };
  }, [path]);

  useEffect(() => {
    const element = list.current;
    if (element && stickToBottom.current) element.scrollTop = element.scrollHeight;
  }, [messages]);

  const perform = async (action: () => Promise<void>) => {
    if (busy) return;
    setBusy(true);
    setActionError('');
    try { await action(); }
    catch (error) { setActionError(errorMessage(error)); }
    finally { setBusy(false); }
  };

  const older = () => void perform(async () => {
    const oldest = messages[0];
    if (!oldest) return;
    const batch = await api<ChatMessage[]>(`${path}?before=${oldest.id}`);
    stickToBottom.current = false;
    setMessages((previous) => mergeMessages(previous, batch));
    setMore(batch.length === 50);
  });

  const send = (event: React.FormEvent) => {
    event.preventDefault();
    if (!draft.trim()) return;
    void perform(async () => {
      const message = await api<ChatMessage>(path, { method: 'POST', body: { content: draft } });
      stickToBottom.current = true;
      setMessages((previous) => mergeMessages(previous, [message]));
      setDraft('');
    });
  };

  const remove = (message: ChatMessage) => {
    if (!window.confirm('메시지를 삭제하시겠어요?')) return;
    void perform(async () => {
      await api(`${path}/${message.id}`, { method: 'DELETE' });
      setMessages((previous) => mergeMessages(previous, [{ ...message, content: '', isDeleted: true }]));
    });
  };

  return <>
    <section style={{ ...cardStyle, marginBottom: 12 }}>
      <p style={{ color: colors.accent }}>{room.category} · {room.isPrivate ? '비공개' : '공개'}</p>
      <div className="mvp-toolbar" style={{ justifyContent: 'space-between' }}>
        <h1 style={{ fontSize: 23 }}>{room.title}</h1>
        {room.isPrivate && room.ownerId === user.userId &&
          <button type="button" style={secondaryButtonStyle} onClick={() => setShowInvite(true)}>초대 링크</button>}
      </div>
      {room.description && <p>{room.description}</p>}
    </section>
    <section style={cardStyle} aria-label="대화">
      {more && <button type="button" disabled={busy} onClick={older} style={secondaryButtonStyle}>이전 메시지 불러오기</button>}
      <div ref={list} style={{ minHeight: 170, maxHeight: '50vh', overflowY: 'auto', margin: '12px 0' }}
        onScroll={() => {
          const element = list.current;
          if (element) stickToBottom.current = element.scrollHeight - element.clientHeight - element.scrollTop < 50;
        }}>
        {!loaded && !loadError && <Loading />}
        {loaded && !messages.length && <p style={{ color: colors.text }}>아직 메시지가 없어요.</p>}
        {messages.map((message) => <article key={message.id}
          style={{ ...cardStyle, marginBottom: 8, background: message.senderId === user.userId ? colors.accentBg : colors.bg }}>
          <div className="mvp-toolbar">
            <strong>{message.senderNickname}</strong>
            <time dateTime={message.createdAt} style={{ fontSize: 12, color: colors.text }}>{dateTime(message.createdAt)}</time>
            {!message.isDeleted && message.senderId === user.userId &&
              <button type="button" disabled={busy} style={secondaryButtonStyle} onClick={() => remove(message)}>메시지 삭제</button>}
          </div>
          <p style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>
            {message.isDeleted ? '삭제된 메시지입니다.' : message.content}
          </p>
        </article>)}
      </div>
      {loadError && <p role="status" style={{ color: colors.danger }}>{loadError} 다시 연결하는 중입니다.</p>}
      {actionError && <p role="alert" style={{ color: colors.danger }}>{actionError}</p>}
      {user.isLoggedIn ? <form className="mvp-toolbar" onSubmit={send}>
        <input style={{ ...inputStyle, flex: 1 }} aria-label="메시지" placeholder="메시지를 입력하세요"
          maxLength={2000} value={draft} onChange={(event) => setDraft(event.target.value)} />
        <button type="submit" disabled={busy || !draft.trim()} style={primaryButtonStyle}>전송</button>
      </form> : <Link to={`/login?next=${encodeURIComponent(`/chat/${room.id}`)}`}>로그인하고 대화 참여</Link>}
    </section>
    {showInvite && <PrivateInviteModal roomId={room.id} onClose={() => setShowInvite(false)} />}
  </>;
}
