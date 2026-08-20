import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { colors, cardStyle, shadow } from '../styles/theme';

type ModalProps = {
  title: string;
  onClose: () => void;
  children: ReactNode;
};

export const Modal = ({ title, onClose, children }: ModalProps) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        zIndex: 100,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          ...cardStyle,
          boxShadow: shadow,
          width: '100%',
          maxWidth: '440px',
          maxHeight: '85vh',
          overflowY: 'auto',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '18px' }}>{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            style={{
              background: 'none',
              border: 'none',
              fontSize: '18px',
              color: colors.text,
              cursor: 'pointer',
              lineHeight: 1,
              padding: '4px',
            }}
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};
