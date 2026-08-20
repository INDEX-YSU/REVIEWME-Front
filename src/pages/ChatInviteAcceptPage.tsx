import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CURRENT_USER_ID } from '../mocks/posts';
import { resolveInviteToken } from '../mocks/chatInvites';
import type { ResolveInviteResult } from '../mocks/chatInvites';
import { addInvitedUser, getRoomById } from '../mocks/chatRooms';
import { colors, shadow, cardStyle, primaryButtonStyle } from '../styles/theme';
import { InfoScreen } from '../components/InfoScreen';
import { Spinner } from '../components/Spinner';

export const ChatInviteAcceptPage = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'checking' | 'accepted'>('checking');

  const result = useMemo<ResolveInviteResult>(
    () => (token ? resolveInviteToken(token) : { status: 'not-found' }),
    [token],
  );

  useEffect(() => {
    if (result.status !== 'valid') return;
    const timer = setTimeout(() => {
      addInvitedUser(result.roomId, CURRENT_USER_ID);
      setStatus('accepted');
    }, 800);
    return () => clearTimeout(timer);
  }, [result]);

  useEffect(() => {
    if (status !== 'accepted' || result.status !== 'valid') return;
    const timer = setTimeout(() => navigate(`/chat/${result.roomId}`), 900);
    return () => clearTimeout(timer);
  }, [status, result, navigate]);

  if (result.status === 'not-found') {
    return (
      <InfoScreen
        title="유효하지 않은 초대 링크입니다"
        description="링크를 다시 확인하시거나 방장에게 새 초대 링크를 요청해주세요."
        actionLabel="채팅 목록으로"
        actionTo="/chat"
      />
    );
  }

  if (result.status === 'expired') {
    return (
      <InfoScreen
        title="만료된 초대 링크입니다"
        description="이 초대 링크는 유효 기간이 지났어요. 방장에게 새 링크를 요청해주세요."
        actionLabel="채팅 목록으로"
        actionTo="/chat"
      />
    );
  }

  const room = getRoomById(result.roomId);

  return (
    <div style={{ maxWidth: '380px', margin: '60px auto' }}>
      <div style={{ ...cardStyle, boxShadow: shadow, textAlign: 'center', padding: '40px 24px' }}>
        {status === 'checking' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
              <Spinner />
            </div>
            <p style={{ color: colors.text, fontSize: '14px' }}>초대를 확인하고 있어요...</p>
          </>
        )}

        {status === 'accepted' && (
          <>
            <h2 style={{ fontSize: '17px', marginBottom: '8px' }}>초대를 수락했습니다</h2>
            <p style={{ color: colors.text, fontSize: '14px', marginBottom: '20px' }}>
              {room ? `'${room.title}' 방으로 이동합니다...` : '채팅방으로 이동합니다...'}
            </p>
            <button type="button" onClick={() => navigate(`/chat/${result.roomId}`)} style={primaryButtonStyle}>
              지금 이동하기
            </button>
          </>
        )}
      </div>
    </div>
  );
};
