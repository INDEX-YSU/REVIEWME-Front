import { useState } from 'react';
import { Modal } from './Modal';
import { INVITE_EXPIRY_OPTIONS, createInviteToken } from '../mocks/chatInvites';
import type { InviteExpiryKey } from '../mocks/chatInvites';
import { addInvitedUser } from '../mocks/chatRooms';
import { searchUsers } from '../mocks/users';
import { colors, radius, inputStyle, primaryButtonStyle, secondaryButtonStyle } from '../styles/theme';

type PrivateInviteModalProps = {
  roomId: number;
  onClose: () => void;
};

export const PrivateInviteModal = ({ roomId, onClose }: PrivateInviteModalProps) => {
  const [expiry, setExpiry] = useState<InviteExpiryKey>('24h');
  const [inviteLink, setInviteLink] = useState('');
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');

  const [searchKeyword, setSearchKeyword] = useState('');
  const [invitedIds, setInvitedIds] = useState<string[]>([]);

  const handleGenerateLink = () => {
    const token = createInviteToken(roomId, expiry);
    setInviteLink(`${window.location.origin}/chat/invite/${token}`);
    setCopyStatus('idle');
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopyStatus('copied');
      setTimeout(() => setCopyStatus('idle'), 2000);
    } catch {
      setCopyStatus('idle');
    }
  };

  const handleInviteUser = (userId: string) => {
    addInvitedUser(roomId, userId);
    setInvitedIds((prev) => [...prev, userId]);
  };

  const searchResults = searchUsers(searchKeyword);

  return (
    <Modal title="채팅방 초대하기" onClose={onClose}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <section>
          <p style={{ fontSize: '13px', fontWeight: 600, color: colors.textHeading, marginBottom: '8px' }}>초대 링크 생성</p>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
            <select value={expiry} onChange={(e) => setExpiry(e.target.value as InviteExpiryKey)} style={{ ...inputStyle, flex: 1 }}>
              {INVITE_EXPIRY_OPTIONS.map((option) => (
                <option key={option.key} value={option.key}>
                  {option.label} 후 만료
                </option>
              ))}
            </select>
            <button type="button" onClick={handleGenerateLink} style={secondaryButtonStyle}>
              링크 생성
            </button>
          </div>

          {inviteLink && (
            <div style={{ display: 'flex', gap: '8px' }}>
              <input readOnly value={inviteLink} style={{ ...inputStyle, flex: 1, fontSize: '12px', color: colors.text }} />
              <button type="button" onClick={handleCopyLink} style={primaryButtonStyle}>
                {copyStatus === 'copied' ? '복사됨!' : '복사'}
              </button>
            </div>
          )}
        </section>

        <div style={{ height: '1px', background: colors.borderSubtle }} />

        <section>
          <p style={{ fontSize: '13px', fontWeight: 600, color: colors.textHeading, marginBottom: '8px' }}>사용자 검색으로 초대</p>
          <input
            type="text"
            placeholder="닉네임으로 검색"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            style={inputStyle}
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px', maxHeight: '160px', overflowY: 'auto' }}>
            {searchResults.map((user) => {
              const invited = invitedIds.includes(user.id);
              return (
                <div
                  key={user.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '8px 10px',
                    borderRadius: radius.md,
                    border: `1px solid ${colors.border}`,
                  }}
                >
                  <span style={{ fontSize: '13px', color: colors.textHeading }}>{user.nickname}</span>
                  <button
                    type="button"
                    disabled={invited}
                    onClick={() => handleInviteUser(user.id)}
                    style={{
                      ...secondaryButtonStyle,
                      fontSize: '12px',
                      padding: '6px 10px',
                      opacity: invited ? 0.6 : 1,
                      cursor: invited ? 'default' : 'pointer',
                    }}
                  >
                    {invited ? '초대됨' : '초대'}
                  </button>
                </div>
              );
            })}

            {searchKeyword && searchResults.length === 0 && (
              <p style={{ fontSize: '12px', color: colors.text, textAlign: 'center', padding: '10px 0' }}>
                검색 결과가 없어요.
              </p>
            )}
          </div>
        </section>
      </div>
    </Modal>
  );
};
