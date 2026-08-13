export type OAuthProvider = 'github' | 'google';
export type UserRole = 'GUEST' | 'USER';

export type AuthUser = {
  isLoggedIn: boolean;
  nickname: string;
  email: string;
  profileImage: string;
  bio: string;
  affiliation: string;
  techStack: string[];
  githubConnected: boolean;
  githubUsername: string | null;
  googleConnected: boolean;
  googleEmail: string | null;
};

export type ProfilePatch = Partial<Pick<AuthUser, 'nickname' | 'bio' | 'affiliation' | 'techStack' | 'profileImage'>>;

export type AuthContextValue = {
  user: AuthUser;
  role: UserRole;
  loginWithOAuth: (provider: OAuthProvider) => void;
  disconnectProvider: (provider: OAuthProvider) => void;
  updateProfile: (patch: ProfilePatch) => void;
  logout: () => void;
};
