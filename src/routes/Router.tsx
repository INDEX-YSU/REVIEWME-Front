import { createBrowserRouter } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { MainPage } from '../pages/MainPage';
import { AuthPage } from '../pages/AuthPage';
import { ProfilePage } from '../pages/ProfilePage';
import { ChatPage } from '../pages/ChatPage';
import { PostDetailPage } from '../pages/PostDetailPage';
import { PostCreatePage } from '../pages/PostCreatePage';
import { PostEditPage } from '../pages/PostEditPage';
import { ChatRoomPage } from '../pages/ChatRoomPage';
import { ChatInviteAcceptPage } from '../pages/ChatInviteAcceptPage';
import { NotFoundPage } from '../pages/NotFoundPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { path: '', element: <MainPage /> },
      { path: 'login', element: <AuthPage key="login" /> },
      { path: 'register', element: <AuthPage key="register" register /> },
      { path: 'profile', element: <ProfilePage /> },
      { path: 'chat', element: <ChatPage /> },
      { path: 'chat/invite/:token', element: <ChatInviteAcceptPage /> },
      { path: 'chat/:roomId', element: <ChatRoomPage /> },
      { path: 'posts/create', element: <PostCreatePage /> },
      { path: 'posts/:id', element: <PostDetailPage /> },
      { path: 'posts/:id/edit', element: <PostEditPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
