export const INVITE_EXPIRY_OPTIONS = [
  { key: '24h', label: '24시간', hours: 24 },
  { key: '7d', label: '7일', hours: 24 * 7 },
  { key: '30d', label: '30일', hours: 24 * 30 },
  { key: 'forever', label: '무제한', hours: null },
] as const;

export type InviteExpiryKey = (typeof INVITE_EXPIRY_OPTIONS)[number]['key'];

type InviteToken = {
  roomId: number;
  expiresAt: number | null;
};

const invites = new Map<string, InviteToken>();

const generateToken = (): string => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);

export const createInviteToken = (roomId: number, expiryKey: InviteExpiryKey): string => {
  const option = INVITE_EXPIRY_OPTIONS.find((item) => item.key === expiryKey);
  const expiresAt = option?.hours ? Date.now() + option.hours * 60 * 60 * 1000 : null;
  const token = generateToken();
  invites.set(token, { roomId, expiresAt });
  return token;
};

export type ResolveInviteResult =
  | { status: 'valid'; roomId: number }
  | { status: 'expired' }
  | { status: 'not-found' };

export const resolveInviteToken = (token: string): ResolveInviteResult => {
  const invite = invites.get(token);
  if (!invite) return { status: 'not-found' };
  if (invite.expiresAt !== null && invite.expiresAt < Date.now()) return { status: 'expired' };
  return { status: 'valid', roomId: invite.roomId };
};
