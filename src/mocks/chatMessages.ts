import { CURRENT_USER_ID } from './posts';

export type ChatMessage = {
  id: number;
  roomId: number;
  senderId: string;
  senderNickname: string;
  text: string;
  createdAt: string;
  isDeleted: boolean;
};

const formatTime = (date: Date): string => date.toTimeString().slice(0, 5);

const messages: ChatMessage[] = [
  { id: 1, roomId: 1, senderId: 'user-sumin', senderNickname: 'sumin.dev', text: 'React 19로 올리신 분 계신가요?', createdAt: '13:02', isDeleted: false },
  { id: 2, roomId: 1, senderId: 'user-kimcoding', senderNickname: 'kimcoding', text: '저 지난주에 올렸어요, useOptimistic 진짜 편하더라구요', createdAt: '13:05', isDeleted: false },
  { id: 3, roomId: 1, senderId: CURRENT_USER_ID, senderNickname: '리뷰미', text: '마이그레이션 가이드 링크 좀 공유해주실 수 있나요?', createdAt: '13:07', isDeleted: false },
  { id: 4, roomId: 1, senderId: 'user-sumin', senderNickname: 'sumin.dev', text: '네! 조금 이따 공유드릴게요', createdAt: '13:08', isDeleted: false },
  { id: 5, roomId: 3, senderId: 'user-hoon', senderNickname: 'backend_hoon', text: '이번 주 스터디 자료 업로드했습니다', createdAt: '09:12', isDeleted: false },
  { id: 6, roomId: 3, senderId: CURRENT_USER_ID, senderNickname: '리뷰미', text: '확인했습니다, 감사해요!', createdAt: '09:20', isDeleted: false },
  { id: 7, roomId: 6, senderId: CURRENT_USER_ID, senderNickname: '리뷰미', text: '팀빌딩 관심 있으신 분은 댓글 남겨주세요', createdAt: '10:00', isDeleted: false },
];

let nextId = 1000;

const olderMessagesPool: Record<number, ChatMessage[]> = {
  1: [
    { id: -1, roomId: 1, senderId: 'user-sumin', senderNickname: 'sumin.dev', text: '다들 안녕하세요! React 19 잡담방입니다', createdAt: '어제 21:40', isDeleted: false },
    { id: -2, roomId: 1, senderId: 'user-kimcoding', senderNickname: 'kimcoding', text: '반갑습니다 :)', createdAt: '어제 21:41', isDeleted: false },
    { id: -3, roomId: 1, senderId: 'user-yeonj', senderNickname: 'yeon_j', text: '저도 참여합니다!', createdAt: '어제 21:45', isDeleted: false },
  ],
};

const incomingPool: Record<number, { senderId: string; senderNickname: string; lines: string[] }> = {
  1: {
    senderId: 'user-yeonj',
    senderNickname: 'yeon_j',
    lines: ['오 저도 궁금했던 내용이에요', 'Suspense 관련 이슈는 없으셨나요?', '링크 감사합니다!'],
  },
  4: {
    senderId: 'user-juyeon',
    senderNickname: 'ai_juyeon',
    lines: ['방금 올라온 논문도 관련 있어 보이네요', '컨텍스트 길이 제한은 어떻게 해결하셨어요?'],
  },
  8: {
    senderId: 'user-study',
    senderNickname: 'study_master',
    lines: ['오늘 다들 고생 많으셨어요 ☕', '주말엔 뭐 하시나요?'],
  },
};

export const getMessagesByRoomId = (roomId: number): ChatMessage[] =>
  messages.filter((message) => message.roomId === roomId);

export const hasOlderMessages = (roomId: number): boolean => (olderMessagesPool[roomId]?.length ?? 0) > 0;

export const loadOlderMessages = (roomId: number): Promise<ChatMessage[]> =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < 0.25) {
        reject(new Error('이전 메시지를 불러오지 못했습니다.'));
        return;
      }
      const pool = olderMessagesPool[roomId] ?? [];
      const batch = pool.splice(0, pool.length);
      messages.unshift(...batch);
      resolve(batch);
    }, 800);
  });

export const sendMessage = (roomId: number, senderId: string, senderNickname: string, text: string): ChatMessage => {
  const message: ChatMessage = {
    id: nextId++,
    roomId,
    senderId,
    senderNickname,
    text,
    createdAt: formatTime(new Date()),
    isDeleted: false,
  };
  messages.push(message);
  return message;
};

export const softDeleteMessage = (id: number): void => {
  const target = messages.find((message) => message.id === id);
  if (target) target.isDeleted = true;
};

export const injectIncomingMessage = (roomId: number): ChatMessage | null => {
  const pool = incomingPool[roomId];
  if (!pool) return null;
  const text = pool.lines[Math.floor(Math.random() * pool.lines.length)];
  const message: ChatMessage = {
    id: nextId++,
    roomId,
    senderId: pool.senderId,
    senderNickname: pool.senderNickname,
    text,
    createdAt: formatTime(new Date()),
    isDeleted: false,
  };
  messages.push(message);
  return message;
};
