import { CURRENT_USER_ID, CURRENT_USER_NICKNAME } from './posts';

export const CHAT_CATEGORIES = ['프론트엔드', '백엔드', 'AI', '취업/포트폴리오', '사이드프로젝트', '자유'] as const;

export type ChatCategory = (typeof CHAT_CATEGORIES)[number];

export type ChatRoom = {
  id: number;
  title: string;
  description: string;
  category: ChatCategory;
  isPrivate: boolean;
  allowGuest: boolean;
  participants: number;
  ownerId: string;
  ownerNickname: string;
  invitedUserIds: string[];
};

const rooms: ChatRoom[] = [
  {
    id: 1,
    title: 'React 19 마이그레이션 잡담방',
    description: 'React 19로 올리면서 겪은 이슈나 팁을 편하게 나누는 공간이에요.',
    category: '프론트엔드',
    isPrivate: false,
    allowGuest: true,
    participants: 24,
    ownerId: 'user-sumin',
    ownerNickname: 'sumin.dev',
    invitedUserIds: [],
  },
  {
    id: 2,
    title: 'TypeScript 타입 설계 고민 상담소',
    description: '제네릭, 유틸리티 타입 설계가 막힐 때 같이 고민해요.',
    category: '프론트엔드',
    isPrivate: false,
    allowGuest: true,
    participants: 9,
    ownerId: 'user-kimcoding',
    ownerNickname: 'kimcoding',
    invitedUserIds: [],
  },
  {
    id: 3,
    title: '스프링 배치 & 대용량 데이터 스터디',
    description: '매주 화요일 스프링 배치 실전 사례를 리뷰하는 비공개 스터디방입니다.',
    category: '백엔드',
    isPrivate: true,
    allowGuest: false,
    participants: 6,
    ownerId: 'user-hoon',
    ownerNickname: 'backend_hoon',
    invitedUserIds: [CURRENT_USER_ID],
  },
  {
    id: 4,
    title: 'LLM 프로덕트 만들기',
    description: 'RAG, 에이전트, 프롬프트 엔지니어링 관련 실전 경험을 공유합니다.',
    category: 'AI',
    isPrivate: false,
    allowGuest: true,
    participants: 41,
    ownerId: 'user-juyeon',
    ownerNickname: 'ai_juyeon',
    invitedUserIds: [],
  },
  {
    id: 5,
    title: '신입 개발자 이력서 첨삭방',
    description: '서류 통과율을 높이기 위한 이력서/포트폴리오 상호 피드백방이에요.',
    category: '취업/포트폴리오',
    isPrivate: true,
    allowGuest: true,
    participants: 15,
    ownerId: 'user-yeonj',
    ownerNickname: 'yeon_j',
    invitedUserIds: [],
  },
  {
    id: 6,
    title: '코드 리뷰 봇 사이드 프로젝트 팀빌딩',
    description: 'Claude API 기반 코드 리뷰 봇을 함께 만들 팀원을 찾고 있어요.',
    category: '사이드프로젝트',
    isPrivate: false,
    allowGuest: true,
    participants: 5,
    ownerId: CURRENT_USER_ID,
    ownerNickname: CURRENT_USER_NICKNAME,
    invitedUserIds: [],
  },
  {
    id: 7,
    title: '알고리즘 스터디 (평일 아침 인증)',
    description: '매일 아침 7시 문제 풀이 인증하는 비공개 스터디방입니다.',
    category: '사이드프로젝트',
    isPrivate: true,
    allowGuest: false,
    participants: 5,
    ownerId: CURRENT_USER_ID,
    ownerNickname: CURRENT_USER_NICKNAME,
    invitedUserIds: [],
  },
  {
    id: 8,
    title: '오늘 하루 어땠나요',
    description: '개발 얘기가 아니어도 괜찮아요, 편하게 쉬어가는 자유 채팅방.',
    category: '자유',
    isPrivate: false,
    allowGuest: true,
    participants: 33,
    ownerId: 'user-study',
    ownerNickname: 'study_master',
    invitedUserIds: [],
  },
];

let nextId = rooms.length + 1;

export const getRooms = (): ChatRoom[] => rooms;

export const getRoomById = (id: number): ChatRoom | undefined => rooms.find((room) => room.id === id);

export type RoomInput = {
  title: string;
  description: string;
  category: ChatCategory;
  isPrivate: boolean;
  allowGuest: boolean;
};

export const createRoom = (input: RoomInput): ChatRoom => {
  const newRoom: ChatRoom = {
    id: nextId++,
    title: input.title,
    description: input.description,
    category: input.category,
    isPrivate: input.isPrivate,
    allowGuest: input.allowGuest,
    participants: 1,
    ownerId: CURRENT_USER_ID,
    ownerNickname: CURRENT_USER_NICKNAME,
    invitedUserIds: [],
  };
  rooms.unshift(newRoom);
  return newRoom;
};

export const canAccessRoom = (room: ChatRoom, userId: string): boolean =>
  !room.isPrivate || room.ownerId === userId || room.invitedUserIds.includes(userId);

export const addInvitedUser = (roomId: number, userId: string): void => {
  const room = rooms.find((r) => r.id === roomId);
  if (!room) return;
  if (!room.invitedUserIds.includes(userId)) room.invitedUserIds.push(userId);
};
