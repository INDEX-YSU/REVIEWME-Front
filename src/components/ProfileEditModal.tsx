import { useState } from 'react';
import type { ReactNode } from 'react';
import { Modal } from './Modal';
import { colors, inputStyle, primaryButtonStyle, secondaryButtonStyle } from '../styles/theme';
import type { AuthUser, ProfilePatch } from '../context/authTypes';

type ProfileEditModalProps = {
  user: AuthUser;
  onClose: () => void;
  onSave: (patch: ProfilePatch) => void;
};

const Field = ({ label, children }: { label: string; children: ReactNode }) => (
  <label style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px', fontWeight: 600, color: colors.textHeading }}>
    {label}
    {children}
  </label>
);

export const ProfileEditModal = ({ user, onClose, onSave }: ProfileEditModalProps) => {
  const [nickname, setNickname] = useState(user.nickname);
  const [bio, setBio] = useState(user.bio);
  const [affiliation, setAffiliation] = useState(user.affiliation);
  const [techStackText, setTechStackText] = useState(user.techStack.join(', '));
  const [profileImage, setProfileImage] = useState(user.profileImage);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname.trim()) {
      setError('닉네임을 입력해주세요.');
      return;
    }
    onSave({
      nickname: nickname.trim(),
      bio: bio.trim(),
      affiliation: affiliation.trim(),
      techStack: techStackText
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
      profileImage: profileImage.trim(),
    });
    onClose();
  };

  return (
    <Modal title="프로필 수정" onClose={onClose}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <Field label="닉네임">
          <input value={nickname} onChange={(e) => setNickname(e.target.value)} style={inputStyle} />
        </Field>
        <Field label="자기소개">
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
            placeholder="한 줄 소개를 입력해주세요"
          />
        </Field>
        <Field label="소속">
          <input
            value={affiliation}
            onChange={(e) => setAffiliation(e.target.value)}
            style={inputStyle}
            placeholder="예) INDEX 팀 · 프리랜서"
          />
        </Field>
        <Field label="사용 언어 (콤마로 구분)">
          <input
            value={techStackText}
            onChange={(e) => setTechStackText(e.target.value)}
            style={inputStyle}
            placeholder="예) TypeScript, React, Node.js"
          />
        </Field>
        <Field label="프로필 이미지 URL (선택)">
          <input
            value={profileImage}
            onChange={(e) => setProfileImage(e.target.value)}
            style={inputStyle}
            placeholder="https://..."
          />
        </Field>

        {error && <p style={{ color: colors.danger, fontSize: '12px' }}>{error}</p>}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '4px' }}>
          <button type="button" onClick={onClose} style={secondaryButtonStyle}>
            취소
          </button>
          <button type="submit" style={primaryButtonStyle}>
            저장
          </button>
        </div>
      </form>
    </Modal>
  );
};
