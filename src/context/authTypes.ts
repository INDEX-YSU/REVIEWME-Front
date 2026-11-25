export type ProfilePatch = {
  nickname: string;
  bio: string;
  affiliation: string;
  techStack: string[];
};

export type AuthUser = ProfilePatch & {
  isLoggedIn: boolean;
  userId: string;
  email: string;
  profileImage: string;
};

export type AuthContextValue = {
  user: AuthUser;
  ready: boolean;
  login: (email: string, password: string) => Promise<void>;
  updateProfile: (patch: ProfilePatch) => Promise<void>;
  logout: () => Promise<void>;
};
