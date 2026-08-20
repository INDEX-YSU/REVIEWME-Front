import { useEffect, useState } from 'react';
import { CURRENT_USER_ID } from '../mocks/posts';
import { addComment, deleteComment, getCommentsByPostId, updateComment } from '../mocks/comments';
import type { Comment } from '../mocks/comments';
import { colors, cardStyle, inputStyle, primaryButtonStyle, secondaryButtonStyle } from '../styles/theme';
import { EmptyState } from './EmptyState';
import { SkeletonLine } from './Skeleton';
import { useMockLoading } from '../hooks/useMockLoading';

type CommentSectionProps = {
  postId: number;
  onCountChange?: (count: number) => void;
};

export const CommentSection = ({ postId, onCountChange }: CommentSectionProps) => {
  const isLoading = useMockLoading(450);
  const [comments, setComments] = useState<Comment[]>(() => getCommentsByPostId(postId));
  const [newContent, setNewContent] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState('');

  useEffect(() => {
    onCountChange?.(comments.length);
  }, [comments.length, onCountChange]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim()) return;
    const comment = addComment(postId, newContent.trim());
    setComments((prev) => [...prev, comment]);
    setNewContent('');
  };

  const handleStartEdit = (comment: Comment) => {
    setEditingId(comment.id);
    setEditContent(comment.content);
  };

  const handleSaveEdit = (id: number) => {
    if (!editContent.trim()) return;
    const updated = updateComment(id, editContent.trim());
    if (updated) {
      setComments((prev) => prev.map((comment) => (comment.id === id ? updated : comment)));
    }
    setEditingId(null);
  };

  const handleDelete = (id: number) => {
    if (!window.confirm('댓글을 삭제하시겠어요?')) return;
    deleteComment(id);
    setComments((prev) => prev.filter((comment) => comment.id !== id));
  };

  return (
    <div>
      <h3 style={{ fontSize: '15px', marginBottom: '14px' }}>댓글 {comments.length}</h3>

      {isLoading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
          <SkeletonLine width="60%" />
          <SkeletonLine width="90%" />
          <SkeletonLine width="40%" />
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
          {comments.map((comment) => (
            <div key={comment.id} style={cardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: colors.textHeading }}>{comment.author}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '12px', color: colors.text }}>{comment.createdAt}</span>
                  {comment.authorId === CURRENT_USER_ID && editingId !== comment.id && (
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        type="button"
                        onClick={() => handleStartEdit(comment)}
                        style={{ background: 'none', border: 'none', color: colors.accent, fontSize: '12px', cursor: 'pointer', padding: 0 }}
                      >
                        수정
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(comment.id)}
                        style={{ background: 'none', border: 'none', color: colors.danger, fontSize: '12px', cursor: 'pointer', padding: 0 }}
                      >
                        삭제
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {editingId === comment.id ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    style={{ ...inputStyle, minHeight: '60px', resize: 'vertical' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
                    <button type="button" onClick={() => setEditingId(null)} style={secondaryButtonStyle}>
                      취소
                    </button>
                    <button type="button" onClick={() => handleSaveEdit(comment.id)} style={primaryButtonStyle}>
                      저장
                    </button>
                  </div>
                </div>
              ) : (
                <p style={{ fontSize: '14px', color: colors.textHeading, lineHeight: 1.6 }}>{comment.content}</p>
              )}
            </div>
          ))}

          {comments.length === 0 && (
            <EmptyState icon="💬" title="아직 댓글이 없어요" description="가장 먼저 댓글을 남겨보세요." />
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px' }}>
        <input
          type="text"
          placeholder="댓글을 입력해주세요"
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
          style={{ ...inputStyle, flex: 1 }}
        />
        <button type="submit" style={primaryButtonStyle}>
          작성
        </button>
      </form>
    </div>
  );
};
