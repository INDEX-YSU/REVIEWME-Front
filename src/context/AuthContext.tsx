import { useCallback, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { AuthContext } from './authContextInstance';
import type { AuthUser, OAuthProvider, ProfilePatch, UserRole } from './authTypes';

const GUEST_USER: AuthUser = {
  isLoggedIn: false,
  nickname: '게스트',
  email: '',
  profileImage: '',
  bio: '',
  affiliation: '',
  techStack: [],
  githubConnected: false,
  githubUsername: null,
  googleConnected: false,
  googleEmail: null,
};

const STORAGE_KEY = 'reviewme_auth_user';
const TOKEN_KEY = 'reviewme_auth_token';

const MOCK_OAUTH_PROFILES: Record<OAuthProvider, { nickname: string; email: string; bio: string }> = {
  github: {
    nickname: '리뷰미',
    email: 'ysmin0530@gmail.com',
    bio: 'AI 기반 개발자 커뮤니티 INDEX를 만들고 있어요.',
  },
  google: {
    nickname: '리뷰미',
    email: 'ysmin0530@gmail.com',
    bio: '',
  },
};

const readStoredUser = (): AuthUser => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return GUEST_USER;
    return { ...GUEST_USER, ...(JSON.parse(raw) as Partial<AuthUser>) };
  } catch {
    return GUEST_USER;
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser>(() => readStoredUser());

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  }, [user]);

  const loginWithOAuth = useCallback((provider: OAuthProvider) => {
    const profile = MOCK_OAUTH_PROFILES[provider];
    localStorage.setItem(TOKEN_KEY, `mock-${provider}-token-${Date.now()}`);

    setUser((prev) => ({
      ...prev,
      isLoggedIn: true,
      nickname: prev.isLoggedIn ? prev.nickname : profile.nickname,
      email: prev.isLoggedIn ? prev.email : profile.email,
      bio: prev.isLoggedIn ? prev.bio : profile.bio,
      ...(provider === 'github'
        ? { githubConnected: true, githubUsername: 'reviewme-dev' }
        : { googleConnected: true, googleEmail: profile.email }),
    }));
  }, []);

  const disconnectProvider = useCallback((provider: OAuthProvider) => {
    setUser((prev) => ({
      ...prev,
      ...(provider === 'github'
        ? { githubConnected: false, githubUsername: null }
        : { googleConnected: false, googleEmail: null }),
    }));
  }, []);

  const updateProfile = useCallback((patch: ProfilePatch) => {
    setUser((prev) => ({ ...prev, ...patch }));
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(GUEST_USER);
  }, []);

  const role: UserRole = user.isLoggedIn && user.githubConnected ? 'USER' : 'GUEST';

  return (
    <AuthContext.Provider value={{ user, role, loginWithOAuth, disconnectProvider, updateProfile, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
