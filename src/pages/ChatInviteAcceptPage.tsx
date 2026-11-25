import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api, errorMessage } from '../api';
import type { ChatRoom } from '../chat';
import { LoginRequired } from '../components/ResourceState';
import { useAuth } from '../context/useAuth';
import { cardStyle, colors, primaryButtonStyle } from '../styles/theme';

export function ChatInviteAcceptPage() {
  const { token } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  if (!user.isLoggedIn) return <LoginRequired />;

  const accept = async () => {
    if (busy) return;
    setBusy(true);
    setError('');
    try {
      const room = await api<ChatRoom>(`/chat/invites/${encodeURIComponent(token ?? '')}/accept`, { method: 'POST' });
      navigate(`/chat/${room.id}`, { replace: true });
    } catch (failure) {
      setError(errorMessage(failure));
    } finally {
      setBusy(false);
    }
  };

  return <section style={{ ...cardStyle, maxWidth: 440, margin: '30px auto' }}>
    <h1 style={{ fontSize: 22, marginBottom: 12 }}>비공개 채팅방 초대</h1>
    <div className="mvp-toolbar">
      <button type="button" disabled={busy} onClick={accept} style={primaryButtonStyle}>초대 수락</button>
      <Link to="/chat">채팅방 목록</Link>
    </div>
    {error && <p role="alert" style={{ color: colors.danger, marginTop: 12 }}>{error}</p>}
  </section>;
}
