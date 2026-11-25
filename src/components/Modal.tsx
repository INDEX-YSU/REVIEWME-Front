import { useEffect, useId, useRef } from 'react';
import type { ReactNode } from 'react';
import { cardStyle, secondaryButtonStyle } from '../styles/theme';

type ModalProps = {
  title: string;
  onClose: () => void;
  children: ReactNode;
};

export function Modal({ title, onClose, children }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    dialog?.showModal();
    return () => dialog?.close();
  }, []);

  return <dialog ref={dialogRef} className="review-dialog" aria-labelledby={titleId}
    onCancel={(event) => { event.preventDefault(); onClose(); }}
    onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <div style={cardStyle}>
      <div className="mvp-toolbar" style={{ justifyContent: 'space-between', marginBottom: 16 }}>
        <h2 id={titleId} style={{ fontSize: 18 }}>{title}</h2>
        <button type="button" onClick={onClose} aria-label="닫기" style={secondaryButtonStyle}>×</button>
      </div>
      {children}
    </div>
  </dialog>;
}
