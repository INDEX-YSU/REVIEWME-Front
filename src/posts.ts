export const POST_CATEGORIES = ['프론트엔드', '백엔드', 'AI', '취업/포트폴리오', '사이드프로젝트', '자유'] as const;
export type PostCategory = (typeof POST_CATEGORIES)[number];
export type PostInput = { title: string; category: PostCategory; content: string };
export type Post = PostInput & {
  id: number;
  author: string;
  authorId: string;
  createdAt: string;
  likes: number;
  comments: number;
  views: number;
  likedByMe: boolean;
};
export type Comment = Pick<Post, 'id' | 'author' | 'authorId' | 'createdAt' | 'content'> & { postId: number };

export function getExcerpt(content: string, maxLength = 90) {
  const plain = content
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[`#>*_|]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  return plain.length > maxLength ? `${plain.slice(0, maxLength)}…` : plain;
}
