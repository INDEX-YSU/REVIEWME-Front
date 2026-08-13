import { createBrowserRouter } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { MainPage } from '../pages/MainPage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { ProfilePage } from '../pages/ProfilePage';
import { ChatPage } from '../pages/ChatPage';
import { PostDetailPage } from '../pages/PostDetailPage';
import { PostCreatePage } from '../pages/PostCreatePage';
import { PostEditPage } from '../pages/PostEditPage';
import { OAuthCallbackPage } from '../pages/OAuthCallbackPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { path: '', element: <MainPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      { path: 'profile', element: <ProfilePage /> },
      { path: 'chat', element: <ChatPage /> },
      { path: 'posts/create', element: <PostCreatePage /> },
      { path: 'posts/:id', element: <PostDetailPage /> },
      { path: 'posts/:id/edit', element: <PostEditPage /> },
      { path: 'auth/callback/github', element: <OAuthCallbackPage provider="github" /> },
      { path: 'auth/callback/google', element: <OAuthCallbackPage provider="google" /> },
    ],
  },
]);