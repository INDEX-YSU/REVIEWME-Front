export type DirectoryUser = {
  id: string;
  nickname: string;
};

export const MOCK_USERS: DirectoryUser[] = [
  { id: 'user-sumin', nickname: 'sumin.dev' },
  { id: 'user-yeonj', nickname: 'yeon_j' },
  { id: 'user-kimcoding', nickname: 'kimcoding' },
  { id: 'user-hoon', nickname: 'backend_hoon' },
  { id: 'user-juyeon', nickname: 'ai_juyeon' },
  { id: 'user-study', nickname: 'study_master' },
];

export const searchUsers = (keyword: string): DirectoryUser[] => {
  const trimmed = keyword.trim();
  if (!trimmed) return [];
  return MOCK_USERS.filter((user) => user.nickname.toLowerCase().includes(trimmed.toLowerCase()));
};
