import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { api, ApiError, refreshSession, setAccessToken } from '../api';
import { AuthContext } from './authContextInstance';
import type { AuthUser, ProfilePatch } from './authTypes';

type Profile = Omit<AuthUser, 'isLoggedIn'>;
const sessionMarker = 'reviewme-session-present';

const guest: AuthUser = {
  isLoggedIn: false, userId: '', nickname: '게스트', email: '', profileImage: '',
  bio: '', affiliation: '', techStack: [],
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState(guest);
  const [ready, setReady] = useState(() => localStorage.getItem(sessionMarker) !== '1');

  useEffect(() => {
    let mounted = true;
    const expire = () => {
      localStorage.removeItem(sessionMarker);
      setUser(guest);
    };
    window.addEventListener('reviewme-session-expired', expire);
    if (localStorage.getItem(sessionMarker) === '1') void refreshSession()
      .then(() => api<Profile>('/profile'))
      .then((profile) => { if (mounted) setUser({ ...profile, isLoggedIn: true }); })
      .catch((error: unknown) => {
        if (!mounted) return;
        setAccessToken();
        if (error instanceof ApiError && error.status === 401) expire();
      })
      .finally(() => { if (mounted) setReady(true); });
    return () => {
      mounted = false;
      window.removeEventListener('reviewme-session-expired', expire);
    };
  }, []);

  const login = async (email: string, password: string) => {
    const { accessToken } = await api<{ accessToken: string }>('/auth/login', {
      method: 'POST', body: { email, password },
    });
    setAccessToken(accessToken);
    localStorage.setItem(sessionMarker, '1');
    const profile = await api<Profile>('/profile');
    setUser({ ...profile, isLoggedIn: true });
  };

  const updateProfile = async (body: ProfilePatch) => {
    const profile = await api<Profile>('/profile', { method: 'PUT', body });
    setUser({ ...profile, isLoggedIn: true });
  };

  const logout = async () => {
    await api('/auth/logout', { method: 'POST' });
    setAccessToken();
    localStorage.removeItem(sessionMarker);
    setUser(guest);
  };

  return (
    <AuthContext.Provider value={{ user, ready, login, updateProfile, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
