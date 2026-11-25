import { useState } from 'react';
import { colors, radius, shadow, cardStyle, secondaryButtonStyle } from '../styles/theme';
import { useAuth } from '../context/useAuth';
import { ProfileEditModal } from '../components/ProfileEditModal';
import { LoginRequired } from '../components/ResourceState';

export const ProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const [isEditOpen, setIsEditOpen] = useState(false);
  if (!user.isLoggedIn) return <LoginRequired />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <section style={{ ...cardStyle, boxShadow: shadow, display: 'flex', gap: '20px', alignItems: 'center' }}>
        {user.profileImage ? (
          <img
            src={user.profileImage}
            alt={user.nickname}
            style={{ width: '72px', height: '72px', borderRadius: radius.lg, objectFit: 'cover', flexShrink: 0 }}
          />
        ) : (
          <div
            style={{
              width: '72px',
              height: '72px',
              borderRadius: radius.lg,
              background: colors.accentBg,
              color: colors.accent,
              border: `1px solid ${colors.accentBorder}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '28px',
              fontWeight: 700,
              flexShrink: 0,
            }}
          >
            {user.nickname.charAt(0)}
          </div>
        )}

        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
            <h2 style={{ fontSize: '20px' }}>{user.nickname}</h2>
          </div>
          <p style={{ color: colors.text, fontSize: '14px' }}>{user.email}</p>
        </div>

        <button type="button" onClick={() => setIsEditOpen(true)} style={secondaryButtonStyle}>
          프로필 수정
        </button>
      </section>

      <section style={{ ...cardStyle, display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div>
          <p style={{ fontSize: '12px', fontWeight: 600, color: colors.text, marginBottom: '6px' }}>자기소개</p>
          <p style={{ fontSize: '14px', color: colors.textHeading, lineHeight: 1.6 }}>
            {user.bio || '아직 작성된 자기소개가 없어요.'}
          </p>
        </div>
        <div>
          <p style={{ fontSize: '12px', fontWeight: 600, color: colors.text, marginBottom: '6px' }}>소속</p>
          <p style={{ fontSize: '14px', color: colors.textHeading }}>{user.affiliation || '미입력'}</p>
        </div>
        <div>
          <p style={{ fontSize: '12px', fontWeight: 600, color: colors.text, marginBottom: '6px' }}>사용 언어</p>
          {user.techStack.length > 0 ? (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {user.techStack.map((tech) => (
                <span
                  key={tech}
                  style={{
                    fontSize: '12px',
                    fontWeight: 600,
                    color: colors.accent,
                    background: colors.accentBg,
                    border: `1px solid ${colors.accentBorder}`,
                    borderRadius: radius.pill,
                    padding: '2px 10px',
                  }}
                >
                  {tech}
                </span>
              ))}
            </div>
          ) : (
            <p style={{ fontSize: '14px', color: colors.textHeading }}>미입력</p>
          )}
        </div>
      </section>

      {isEditOpen && (
        <ProfileEditModal user={user} onClose={() => setIsEditOpen(false)} onSave={updateProfile} />
      )}
    </div>
  );
};
