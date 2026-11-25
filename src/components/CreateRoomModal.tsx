import { useState } from 'react';
import { Modal } from './Modal';
import { errorMessage } from '../api';
import type { RoomInput } from '../chat';
import { POST_CATEGORIES, type PostCategory } from '../posts';
import { colors, inputStyle, primaryButtonStyle, secondaryButtonStyle } from '../styles/theme';

type CreateRoomModalProps = {
  onClose: () => void;
  onSubmit: (input: RoomInput) => Promise<void>;
};

export const CreateRoomModal = ({ onClose, onSubmit }: CreateRoomModalProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<PostCategory | ''>('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [allowGuest, setAllowGuest] = useState(true);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    if (!title.trim() || !category) {
      setError('제목과 카테고리를 모두 입력해주세요.');
      return;
    }
    setError('');
    setBusy(true);
    try {
      await onSubmit({ title: title.trim(), description: description.trim(), category, isPrivate, allowGuest });
    } catch (failure) {
      setError(errorMessage(failure));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal title="채팅방 만들기" onClose={onClose}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <input
          type="text"
          aria-label="방 제목"
          maxLength={120}
          placeholder="방 제목"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={inputStyle}
        />
        <textarea
          aria-label="방 설명"
          maxLength={500}
          placeholder="방 설명"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ ...inputStyle, minHeight: '70px', resize: 'vertical' }}
        />
        <select aria-label="방 카테고리" value={category} onChange={(e) => setCategory(e.target.value as PostCategory)} style={inputStyle}>
          <option value="">카테고리 선택</option>
          {POST_CATEGORIES.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '13px', color: colors.textHeading }}>
          비공개 채팅방
          <input type="checkbox" checked={isPrivate} onChange={(e) => setIsPrivate(e.target.checked)} />
        </label>

        {!isPrivate && <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '13px', color: colors.textHeading }}>
          비회원 열람 허용
          <input type="checkbox" checked={allowGuest} onChange={(e) => setAllowGuest(e.target.checked)} />
        </label>}

        {error && <p role="alert" style={{ color: colors.danger, fontSize: '12px' }}>{error}</p>}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '4px' }}>
          <button type="button" onClick={onClose} style={secondaryButtonStyle}>
            취소
          </button>
          <button type="submit" style={primaryButtonStyle} disabled={busy}>
            만들기
          </button>
        </div>
      </form>
    </Modal>
  );
};
