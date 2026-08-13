import { Link, useNavigate, useParams } from 'react-router-dom';
import { CURRENT_USER_ID, deletePost, getPostById } from '../mocks/posts';
import { colors, radius, shadow, cardStyle, secondaryButtonStyle } from '../styles/theme';
import { MarkdownContent } from '../components/MarkdownContent';
import { InfoScreen } from '../components/InfoScreen';

export const PostDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const post = id ? getPostById(Number(id)) : undefined;

  if (!post) {
    return (
      <InfoScreen
        title="존재하지 않는 게시글입니다"
        description="요청하신 게시글을 찾을 수 없어요. 주소를 다시 확인해주세요."
        actionLabel="목록으로"
        actionTo="/"
      />
    );
  }

  const isOwner = post.authorId === CURRENT_USER_ID;

  const handleDelete = () => {
    if (!window.confirm('정말 삭제하시겠어요? 삭제 후에는 되돌릴 수 없습니다.')) return;
    deletePost(post.id);
    navigate('/');
  };

  return (
    <div>
      <div style={{ ...cardStyle, boxShadow: shadow, marginBottom: '20px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: '12px',
            marginBottom: '12px',
          }}
        >
          <div>
            <span
              style={{
                fontSize: '12px',
                fontWeight: 700,
                color: colors.accent,
                background: colors.accentBg,
                border: `1px solid ${colors.accentBorder}`,
                borderRadius: radius.pill,
                padding: '2px 10px',
              }}
            >
              {post.category}
            </span>
            <h1 style={{ fontSize: '24px', marginTop: '10px' }}>{post.title}</h1>
          </div>

          {isOwner && (
            <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
              <Link to={`/posts/${post.id}/edit`} style={{ ...secondaryButtonStyle, textDecoration: 'none' }}>
                수정
              </Link>
              <button
                type="button"
                onClick={handleDelete}
                style={{ ...secondaryButtonStyle, color: colors.danger, borderColor: colors.danger }}
              >
                삭제
              </button>
            </div>
          )}
        </div>

        <div
          style={{
            display: 'flex',
            gap: '14px',
            fontSize: '13px',
            color: colors.text,
            paddingBottom: '16px',
            borderBottom: `1px solid ${colors.borderSubtle}`,
          }}
        >
          <span>{post.author}</span>
          <span>{post.createdAt}</span>
          <span>조회 {post.views.toLocaleString()}</span>
          <span>추천 {post.likes}</span>
          <span>댓글 {post.comments}</span>
        </div>

        <div style={{ paddingTop: '20px' }}>
          <MarkdownContent content={post.content} />
        </div>
      </div>

      <Link to="/" style={{ color: colors.accent, fontSize: '14px', textDecoration: 'none' }}>
        ← 목록으로
      </Link>
    </div>
  );
};
