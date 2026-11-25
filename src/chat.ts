import type { PostCategory } from './posts';

export type RoomInput = {
  title: string;
  description: string;
  category: PostCategory;
  isPrivate: boolean;
  allowGuest: boolean;
};

export type ChatRoom = RoomInput & {
  id: number;
  participants: number;
  ownerId: string;
  ownerNickname: string;
};

export type ChatMessage = {
  id: number;
  senderId: string;
  senderNickname: string;
  content: string;
  createdAt: string;
  isDeleted: boolean;
};
