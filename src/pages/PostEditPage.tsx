import { useNavigate, useParams } from 'react-router-dom';
import { CURRENT_USER_ID, getPostById, updatePost, type PostInput } from '../mocks/posts';
import { PostForm } from '../components/PostForm';
import { InfoScreen } from '../components/InfoScreen';

export const PostEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const post = id ? getPostById(Number(id)) : undefined;

  if (!post) {
    return (
      <InfoScreen
        title="존재하지 않는 게시글입니다"
        description="수정하려는 게시글을 찾을 수 없어요."
        actionLabel="목록으로"
        actionTo="/"
      />
    );
  }

  if (post.authorId !== CURRENT_USER_ID) {
    return (
      <InfoScreen
        title="수정 권한이 없습니다"
        description="본인이 작성한 게시글만 수정할 수 있어요."
        actionLabel="게시글로 돌아가기"
        actionTo={`/posts/${post.id}`}
      />
    );
  }

  const handleSubmit = (values: PostInput) => {
    updatePost(post.id, values);
    navigate(`/posts/${post.id}`);
  };

  return (
    <div>
      <h2 style={{ marginBottom: '20px' }}>게시글 수정</h2>
      <PostForm
        initialValues={{ title: post.title, category: post.category, content: post.content }}
        submitLabel="수정 완료"
        onSubmit={handleSubmit}
        onCancel={() => navigate(`/posts/${post.id}`)}
      />
    </div>
  );
};
