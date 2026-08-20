import { CURRENT_USER_ID, CURRENT_USER_NICKNAME } from './posts';

export type Comment = {
  id: number;
  postId: number;
  author: string;
  authorId: string;
  content: string;
  createdAt: string;
};

const comments: Comment[] = [
  {
    id: 1,
    postId: 1,
    author: 'yeon_j',
    authorId: 'user-yeonj',
    content: '저도 낙관적 업데이트 도입하려다 롤백 처리가 막막했는데 큰 도움이 됐어요!',
    createdAt: '2026-08-12 14:22',
  },
  {
    id: 2,
    postId: 1,
    author: '리뷰미',
    authorId: CURRENT_USER_ID,
    content: '실패 케이스 롤백 코드도 다음 글에서 다뤄주시면 좋을 것 같아요 :)',
    createdAt: '2026-08-12 15:03',
  },
  {
    id: 3,
    postId: 1,
    author: 'kimcoding',
    authorId: 'user-kimcoding',
    content: 'useOptimistic이랑 react-query의 optimistic update랑 차이가 궁금하네요.',
    createdAt: '2026-08-12 18:47',
  },
  {
    id: 4,
    postId: 2,
    author: 'backend_hoon',
    authorId: 'user-hoon',
    content: '면접 질문 정리 정말 유용합니다. 감사해요!',
    createdAt: '2026-08-11 20:10',
  },
  {
    id: 5,
    postId: 5,
    author: 'sumin.dev',
    authorId: 'user-sumin',
    content: '컨텍스트 관리 부분 완전 공감합니다. 저희 팀도 같은 고민 중이에요.',
    createdAt: '2026-08-08 11:05',
  },
];

let nextId = comments.length + 1;

export const getCommentsByPostId = (postId: number): Comment[] => comments.filter((comment) => comment.postId === postId);

export const addComment = (postId: number, content: string): Comment => {
  const newComment: Comment = {
    id: nextId++,
    postId,
    author: CURRENT_USER_NICKNAME,
    authorId: CURRENT_USER_ID,
    content,
    createdAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
  };
  comments.push(newComment);
  return newComment;
};

export const updateComment = (id: number, content: string): Comment | undefined => {
  const target = comments.find((comment) => comment.id === id);
  if (!target) return undefined;
  target.content = content;
  return target;
};

export const deleteComment = (id: number): void => {
  const index = comments.findIndex((comment) => comment.id === id);
  if (index !== -1) comments.splice(index, 1);
};
