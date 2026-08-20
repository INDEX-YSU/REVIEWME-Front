import { useState } from 'react';
import { Modal } from './Modal';
import { CHAT_CATEGORIES } from '../mocks/chatRooms';
import type { ChatCategory, RoomInput } from '../mocks/chatRooms';
import { colors, inputStyle, primaryButtonStyle, secondaryButtonStyle } from '../styles/theme';

type CreateRoomModalProps = {
  onClose: () => void;
  onSubmit: (input: RoomInput) => void;
};

export const CreateRoomModal = ({ onClose, onSubmit }: CreateRoomModalProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ChatCategory | ''>('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [allowGuest, setAllowGuest] = useState(true);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !category) {
      setError('제목과 카테고리를 모두 입력해주세요.');
      return;
    }
    onSubmit({ title: title.trim(), description: description.trim(), category, isPrivate, allowGuest });
  };

  return (
    <Modal title="채팅방 만들기" onClose={onClose}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <input
          type="text"
          placeholder="방 제목"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={inputStyle}
        />
        <textarea
          placeholder="방 설명"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ ...inputStyle, minHeight: '70px', resize: 'vertical' }}
        />
        <select value={category} onChange={(e) => setCategory(e.target.value as ChatCategory)} style={inputStyle}>
          <option value="">카테고리 선택</option>
          {CHAT_CATEGORIES.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '13px', color: colors.textHeading }}>
          Private 방으로 만들기
          <input type="checkbox" checked={isPrivate} onChange={(e) => setIsPrivate(e.target.checked)} />
        </label>

        <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '13px', color: colors.textHeading }}>
          Guest 참가 허용
          <input type="checkbox" checked={allowGuest} onChange={(e) => setAllowGuest(e.target.checked)} />
        </label>

        {error && <p style={{ color: colors.danger, fontSize: '12px' }}>{error}</p>}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '4px' }}>
          <button type="button" onClick={onClose} style={secondaryButtonStyle}>
            취소
          </button>
          <button type="submit" style={primaryButtonStyle}>
            만들기
          </button>
        </div>
      </form>
    </Modal>
  );
};
