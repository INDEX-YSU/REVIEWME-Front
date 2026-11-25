import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import { PostForm } from '../components/PostForm';
import { LoginRequired } from '../components/ResourceState';
import { useAuth } from '../context/useAuth';
import type { PostInput } from '../posts';

export function PostCreatePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  if (!user.isLoggedIn) return <LoginRequired />;

  const submit = async (body: PostInput) => {
    const { postId } = await api<{ postId: number }>('/posts', { method: 'POST', body });
    navigate(`/posts/${postId}`, { replace: true });
  };

  return <>
    <h2 style={{ marginBottom: '20px' }}>새 게시글 작성</h2>
    <PostForm submitLabel="게시하기" onSubmit={submit} onCancel={() => navigate('/')} />
  </>;
}
