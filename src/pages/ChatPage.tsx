import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api';
import type { ChatRoom, RoomInput } from '../chat';
import { CreateRoomModal } from '../components/CreateRoomModal';
import { EmptyState } from '../components/EmptyState';
import { Loading, RequestError } from '../components/ResourceState';
import { useAuth } from '../context/useAuth';
import { useResource } from '../hooks/useResource';
import { POST_CATEGORIES } from '../posts';
import { cardStyle, colors, inputStyle, primaryButtonStyle } from '../styles/theme';

export function ChatPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { result, reload } = useResource<ChatRoom[]>('/chat/rooms');
  const [category, setCategory] = useState('');
  const [open, setOpen] = useState(false);

  const create = async (body: RoomInput) => {
    const room = await api<ChatRoom>('/chat/rooms', { method: 'POST', body });
    navigate(`/chat/${room.id}`);
  };

  return <>
    <div className="mvp-toolbar" style={{ justifyContent: 'space-between', marginBottom: 16 }}>
      <h1 style={{ fontSize: 24 }}>오픈채팅</h1>
      {user.isLoggedIn
        ? <button type="button" style={primaryButtonStyle} onClick={() => setOpen(true)}>채팅방 만들기</button>
        : <Link to="/login?next=%2Fchat" style={primaryButtonStyle}>로그인하고 채팅방 만들기</Link>}
    </div>
    <select aria-label="채팅 카테고리" style={{ ...inputStyle, width: 'auto', marginBottom: 16 }}
      value={category} onChange={(event) => setCategory(event.target.value)}>
      <option value="">모든 카테고리</option>
      {POST_CATEGORIES.map((item) => <option key={item}>{item}</option>)}
    </select>
    {result.status === 'loading' && <Loading />}
    {result.status === 'error' && <RequestError message={result.message} retry={reload} />}
    {result.status === 'ready' && <RoomList rooms={result.value.filter((room) => !category || room.category === category)} />}
    {open && <CreateRoomModal onClose={() => setOpen(false)} onSubmit={create} />}
  </>;
}

function RoomList({ rooms }: { rooms: ChatRoom[] }) {
  if (!rooms.length) return <EmptyState icon="💬" title="표시할 채팅방이 없어요" description="새 채팅방을 만들거나 초대 링크로 참여해 보세요." />;
  return <div style={{ display: 'grid', gap: 12 }}>
    {rooms.map((room) => <article key={room.id} style={cardStyle}>
      <p style={{ color: colors.accent, fontSize: 13 }}>{room.category} · {room.isPrivate ? '비공개' : '공개'}</p>
      <h2 style={{ fontSize: 19, margin: '6px 0' }}><Link to={`/chat/${room.id}`}>{room.title}</Link></h2>
      {room.description && <p>{room.description}</p>}
      <p style={{ color: colors.text, marginTop: 8, fontSize: 13 }}>방장 {room.ownerNickname} · 참가자 {room.participants}명</p>
    </article>)}
  </div>;
}
