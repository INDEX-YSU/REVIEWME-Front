import { useNavigate } from 'react-router-dom';
import { createPost, type PostInput } from '../mocks/posts';
import { PostForm } from '../components/PostForm';

export const PostCreatePage = () => {
  const navigate = useNavigate();

  const handleSubmit = (values: PostInput) => {
    const post = createPost(values);
    navigate(`/posts/${post.id}`);
  };

  return (
    <div>
      <h2 style={{ marginBottom: '20px' }}>새 게시글 작성</h2>
      <PostForm submitLabel="게시하기" onSubmit={handleSubmit} onCancel={() => navigate(-1)} />
    </div>
  );
};
