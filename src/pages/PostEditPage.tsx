import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../api';
import { InfoScreen } from '../components/InfoScreen';
import { PostForm } from '../components/PostForm';
import { Loading, LoginRequired, RequestError } from '../components/ResourceState';
import { useAuth } from '../context/useAuth';
import { useResource } from '../hooks/useResource';
import type { Post, PostInput } from '../posts';

export function PostEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { result, reload } = useResource<Post>(`/posts/${id}`);

  if (!user.isLoggedIn) return <LoginRequired />;
  if (result.status === 'loading') return <Loading />;
  if (result.status === 'error') return <RequestError message={result.message} retry={reload} />;
  const post = result.value;
  const postPath = `/posts/${post.id}`;

  if (post.authorId !== user.userId) return <InfoScreen title="수정 권한이 없습니다"
    description="본인이 작성한 게시글만 수정할 수 있어요." actionLabel="게시글로 돌아가기" actionTo={postPath} />;

  const submit = async (body: PostInput) => {
    await api(postPath, { method: 'PUT', body });
    navigate(postPath, { replace: true });
  };

  return <>
    <h2 style={{ marginBottom: '20px' }}>게시글 수정</h2>
    <PostForm key={post.id} initialValues={post} submitLabel="수정 완료" onSubmit={submit}
      onCancel={() => navigate(postPath)} />
  </>;
}
