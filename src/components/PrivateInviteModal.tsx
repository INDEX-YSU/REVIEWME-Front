import { useState } from 'react';
import { api, dateTime, errorMessage } from '../api';
import { colors, inputStyle, primaryButtonStyle } from '../styles/theme';
import { Modal } from './Modal';

export function PrivateInviteModal({ roomId, onClose }: { roomId: number; onClose: () => void }) {
  const [minutes, setMinutes] = useState(60);
  const [invite, setInvite] = useState<{ token: string; expiresAt: string }>();
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState('');
  const url = invite ? `${window.location.origin}/chat/invite/${invite.token}` : '';

  const generate = async () => {
    if (busy) return;
    setBusy(true);
    setFeedback('');
    try {
      setInvite(await api(`/chat/rooms/${roomId}/invites`, { method: 'POST', body: { minutes } }));
    } catch (error) {
      setFeedback(errorMessage(error));
    } finally {
      setBusy(false);
    }
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setFeedback('초대 링크를 복사했습니다.');
    } catch {
      setFeedback('링크 입력란에서 주소를 직접 복사해 주세요.');
    }
  };

  return <Modal title="채팅방에 초대" onClose={onClose}>
    <p style={{ color: colors.text, marginBottom: 12 }}>초대 링크 하나로 새 참가자 한 명이 입장할 수 있어요.</p>
    <div className="mvp-toolbar">
      <select aria-label="초대 유효 시간" style={{ ...inputStyle, width: 'auto' }} value={minutes}
        onChange={(event) => setMinutes(Number(event.target.value))}>
        <option value={60}>1시간</option><option value={1440}>24시간</option><option value={10080}>7일</option>
      </select>
      <button type="button" disabled={busy} onClick={generate} style={primaryButtonStyle}>초대 링크 발급</button>
    </div>
    {invite && <div style={{ marginTop: 14 }}>
      <p>만료 {dateTime(invite.expiresAt)}</p>
      <input aria-label="초대 링크" style={inputStyle} value={url} readOnly onFocus={(event) => event.target.select()} />
      <button type="button" onClick={copy} style={primaryButtonStyle}>링크 복사</button>
    </div>}
    {feedback && <p role="status" style={{ marginTop: 12 }}>{feedback}</p>}
  </Modal>;
}
