import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CURRENT_USER_ID, CURRENT_USER_NICKNAME } from '../mocks/posts';
import { canAccessRoom, getRoomById } from '../mocks/chatRooms';
import {
  getMessagesByRoomId,
  hasOlderMessages,
  loadOlderMessages,
  sendMessage,
  softDeleteMessage,
  injectIncomingMessage,
} from '../mocks/chatMessages';
import type { ChatMessage } from '../mocks/chatMessages';
import { colors, radius, shadow, cardStyle, inputStyle, primaryButtonStyle, secondaryButtonStyle } from '../styles/theme';
import { InfoScreen } from '../components/InfoScreen';
import { EmptyState } from '../components/EmptyState';
import { ErrorState } from '../components/ErrorState';
import { Spinner } from '../components/Spinner';
import { PrivateInviteModal } from '../components/PrivateInviteModal';

const INCOMING_INTERVAL_MS = 9000;

export const ChatRoomPage = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const room = roomId ? getRoomById(Number(roomId)) : undefined;
  const hasAccess = room ? canAccessRoom(room, CURRENT_USER_ID) : false;

  const [messages, setMessages] = useState<ChatMessage[]>(() => (room ? getMessagesByRoomId(room.id) : []));
  const [messageText, setMessageText] = useState('');
  const [olderStatus, setOlderStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [canLoadOlder, setCanLoadOlder] = useState(() => (room ? hasOlderMessages(room.id) : false));
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages]);

  useEffect(() => {
    if (!room || !hasAccess) return;
    const interval = setInterval(() => {
      const incoming = injectIncomingMessage(room.id);
      if (incoming) setMessages((prev) => [...prev, incoming]);
    }, INCOMING_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [room, hasAccess]);

  if (!room) {
    return (
      <InfoScreen
        title="존재하지 않는 채팅방입니다"
        description="요청하신 채팅방을 찾을 수 없어요. 주소를 다시 확인해주세요."
        actionLabel="목록으로"
        actionTo="/chat"
      />
    );
  }

  if (!hasAccess) {
    return (
      <InfoScreen
        title="비공개 채팅방입니다"
        description="초대받은 사용자만 입장할 수 있어요. 방장에게 초대 링크를 요청해보세요."
        actionLabel="목록으로"
        actionTo="/chat"
      />
    );
  }

  const isOwner = room.ownerId === CURRENT_USER_ID;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    const message = sendMessage(room.id, CURRENT_USER_ID, CURRENT_USER_NICKNAME, messageText.trim());
    setMessages((prev) => [...prev, message]);
    setMessageText('');
  };

  const handleDeleteMessage = (id: number) => {
    if (!window.confirm('메시지를 삭제하시겠어요?')) return;
    softDeleteMessage(id);
    setMessages((prev) => prev.map((message) => (message.id === id ? { ...message, isDeleted: true } : message)));
  };

  const handleLoadOlder = async () => {
    setOlderStatus('loading');
    try {
      const older = await loadOlderMessages(room.id);
      setMessages((prev) => [...older, ...prev]);
      setCanLoadOlder(hasOlderMessages(room.id));
      setOlderStatus('idle');
    } catch {
      setOlderStatus('error');
    }
  };

  return (
    <div>
      <div style={{ ...cardStyle, boxShadow: shadow, marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: radius.pill,
                  color: room.isPrivate ? colors.text : colors.accent,
                  background: room.isPrivate ? colors.bgSubtle : colors.accentBg,
                  border: `1px solid ${room.isPrivate ? colors.border : colors.accentBorder}`,
                }}
              >
                {room.isPrivate ? 'Private' : 'Public'}
              </span>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: radius.pill,
                  color: room.allowGuest ? colors.success : colors.text,
                  background: room.allowGuest ? colors.successBg : colors.bgSubtle,
                  border: `1px solid ${room.allowGuest ? colors.success : colors.border}`,
                }}
              >
                {room.allowGuest ? 'Guest 입장 가능' : 'Guest 입장 불가'}
              </span>
            </div>
            <h1 style={{ fontSize: '20px', marginBottom: '4px' }}>{room.title}</h1>
            <p style={{ fontSize: '13px', color: colors.text }}>{room.description}</p>
          </div>

          {room.isPrivate && isOwner && (
            <button type="button" onClick={() => setIsInviteOpen(true)} style={secondaryButtonStyle}>
              초대하기
            </button>
          )}
        </div>

        <div style={{ marginTop: '12px', fontSize: '12px', color: colors.text }}>
          {room.category} · 방장 {room.ownerNickname} · 현재 접속자 {room.participants}명
        </div>
      </div>

      <div style={{ ...cardStyle, padding: 0, display: 'flex', flexDirection: 'column', height: '480px' }}>
        <div ref={listRef} style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {canLoadOlder && (
            <div style={{ textAlign: 'center', marginBottom: '8px' }}>
              {olderStatus === 'loading' ? (
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: colors.text }}>
                  <Spinner size={14} />
                  이전 메시지 불러오는 중...
                </div>
              ) : olderStatus === 'error' ? (
                <ErrorState
                  title="이전 메시지를 불러오지 못했어요"
                  description="네트워크 오류가 발생했어요."
                  retryLabel="다시 시도"
                  onRetry={handleLoadOlder}
                />
              ) : (
                <button type="button" onClick={handleLoadOlder} style={{ ...secondaryButtonStyle, fontSize: '12px', padding: '6px 12px' }}>
                  이전 메시지 불러오기
                </button>
              )}
            </div>
          )}

          {messages.length === 0 && <EmptyState icon="💬" title="아직 대화가 없어요" description="첫 메시지를 보내보세요." />}

          {messages.map((message) => {
            const isMine = message.senderId === CURRENT_USER_ID;
            return (
              <div key={message.id} style={{ display: 'flex', flexDirection: 'column', alignItems: isMine ? 'flex-end' : 'flex-start' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                  {!isMine && <span style={{ fontSize: '12px', fontWeight: 600, color: colors.textHeading }}>{message.senderNickname}</span>}
                  <span style={{ fontSize: '11px', color: colors.text }}>{message.createdAt}</span>
                </div>
                <div
                  style={{
                    maxWidth: '70%',
                    padding: '8px 12px',
                    borderRadius: radius.md,
                    fontSize: '13px',
                    lineHeight: 1.5,
                    background: message.isDeleted ? colors.bgSubtle : isMine ? colors.accentBg : colors.bg,
                    border: `1px solid ${message.isDeleted ? colors.border : isMine ? colors.accentBorder : colors.border}`,
                    color: message.isDeleted ? colors.text : colors.textHeading,
                    fontStyle: message.isDeleted ? 'italic' : 'normal',
                  }}
                >
                  {message.isDeleted ? '삭제된 메시지입니다' : message.text}
                </div>
                {isMine && !message.isDeleted && (
                  <button
                    type="button"
                    onClick={() => handleDeleteMessage(message.id)}
                    style={{ background: 'none', border: 'none', color: colors.text, fontSize: '11px', cursor: 'pointer', padding: '2px 0' }}
                  >
                    삭제
                  </button>
                )}
              </div>
            );
          })}
        </div>

        <form onSubmit={handleSend} style={{ display: 'flex', gap: '8px', padding: '12px', borderTop: `1px solid ${colors.borderSubtle}` }}>
          <input
            type="text"
            placeholder="메시지를 입력해주세요"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            style={{ ...inputStyle, flex: 1 }}
          />
          <button type="submit" style={primaryButtonStyle}>
            전송
          </button>
        </form>
      </div>

      <Link to="/chat" style={{ display: 'inline-block', marginTop: '16px', color: colors.accent, fontSize: '14px', textDecoration: 'none' }}>
        ← 채팅방 목록으로
      </Link>

      {isInviteOpen && <PrivateInviteModal roomId={room.id} onClose={() => setIsInviteOpen(false)} />}
    </div>
  );
};
