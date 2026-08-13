import { createBrowserRouter } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { MainPage } from '../pages/MainPage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { ProfilePage } from '../pages/ProfilePage';
import { ChatPage } from '../pages/ChatPage';

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
    ],
  },
]);