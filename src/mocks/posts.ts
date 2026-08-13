export const POST_CATEGORIES = ['프론트엔드', '백엔드', 'AI', '취업/포트폴리오', '사이드프로젝트', '자유'] as const;

export type PostCategory = (typeof POST_CATEGORIES)[number];

export type Post = {
  id: number;
  title: string;
  category: PostCategory;
  content: string;
  author: string;
  authorId: string;
  createdAt: string;
  likes: number;
  comments: number;
  views: number;
  hasAiSummary: boolean;
};

// Mock: 백엔드 연동 전이므로 현재 로그인 사용자를 고정값으로 가정
export const CURRENT_USER_ID = 'user-me';
export const CURRENT_USER_NICKNAME = '리뷰미';

const posts: Post[] = [
  {
    id: 1,
    title: 'React 19 useOptimistic 훅으로 낙관적 업데이트 깔끔하게 처리하기',
    category: '프론트엔드',
    content: `서버 응답을 기다리지 않고 UI를 먼저 업데이트하는 패턴을 \`useOptimistic\`으로 리팩터링한 경험을 공유합니다.

## 문제 상황

댓글을 작성할 때마다 서버 응답이 올 때까지 로딩 스피너가 보였고, 사용자 입장에서는 느리다는 피드백이 많았습니다.

## 적용 코드

\`\`\`tsx
const [optimisticComments, addOptimisticComment] = useOptimistic(
  comments,
  (state, newComment) => [...state, newComment],
);
\`\`\`

- 낙관적 업데이트 후 실패 시 롤백 처리도 함께 구현했습니다.
- 실제 체감 속도가 크게 개선되었습니다.

> 다음 글에서는 낙관적 업데이트 실패 케이스를 어떻게 다뤘는지 다뤄볼게요.`,
    author: 'sumin.dev',
    authorId: 'user-sumin',
    createdAt: '2026-08-12',
    likes: 42,
    comments: 11,
    views: 512,
    hasAiSummary: true,
  },
  {
    id: 2,
    title: '신입 프론트엔드 개발자 포트폴리오, 이렇게 정리했습니다',
    category: '취업/포트폴리오',
    content: `GitHub 잔디보다 중요한 건 **문제 해결 과정 기록**이었습니다.

1. 왜 이 프로젝트를 시작했는지
2. 어떤 문제를 겪었고 어떻게 풀었는지
3. 결과와 회고

면접에서 실제로 받았던 질문들도 함께 정리했어요.

| 질문 유형 | 예시 |
| --- | --- |
| 기술 선택 이유 | "왜 Redux 대신 Zustand를 쓰셨나요?" |
| 트러블슈팅 | "가장 어려웠던 버그는 무엇이었나요?" |`,
    author: 'yeon_j',
    authorId: 'user-yeonj',
    createdAt: '2026-08-11',
    likes: 128,
    comments: 34,
    views: 2310,
    hasAiSummary: true,
  },
  {
    id: 3,
    title: 'TypeScript verbatimModuleSyntax, 켜야 할까 말아야 할까',
    category: '프론트엔드',
    content: `타입과 값을 명시적으로 분리해야 하는 이 옵션이 번들 크기와 빌드 속도에 실제로 미치는 영향을 측정해봤습니다.

- \`import type\`을 강제해서 트리쉐이킹이 명확해집니다.
- 마이그레이션 초반에는 타입 import 에러가 많이 발생했습니다.

결론적으로 신규 프로젝트라면 켜는 걸 추천합니다.`,
    author: 'kimcoding',
    authorId: 'user-kimcoding',
    createdAt: '2026-08-10',
    likes: 76,
    comments: 19,
    views: 980,
    hasAiSummary: false,
  },
  {
    id: 4,
    title: '스프링 배치로 대용량 정산 데이터 처리하며 겪은 삽질기',
    category: '백엔드',
    content: `Chunk 크기와 격리 수준을 잘못 잡아서 데드락이 났던 사건부터 해결 과정까지 기록했습니다.

\`\`\`java
@Bean
public Step settlementStep() {
    return stepBuilderFactory.get("settlementStep")
        .<Order, Settlement>chunk(500)
        .reader(orderReader())
        .processor(settlementProcessor())
        .writer(settlementWriter())
        .build();
}
\`\`\`

Chunk 크기를 500에서 100으로 줄이고 나서야 데드락이 사라졌습니다.`,
    author: 'backend_hoon',
    authorId: 'user-hoon',
    createdAt: '2026-08-09',
    likes: 55,
    comments: 8,
    views: 641,
    hasAiSummary: false,
  },
  {
    id: 5,
    title: 'LLM 기반 코드 리뷰 봇 사이드 프로젝트, 3개월 회고',
    category: 'AI',
    content: `Claude API로 PR 리뷰를 자동화하면서 프롬프트 설계보다 **컨텍스트 관리**가 더 중요하다는 걸 깨달았습니다.

## 배운 점

- diff만 넘기는 것보다 관련 파일 전체 맥락을 넘길 때 리뷰 품질이 확연히 좋아졌습니다.
- 토큰 비용을 아끼려고 캐싱을 적극적으로 활용했습니다.

다음 목표는 리뷰 결과를 GitHub 코멘트로 자동 등록하는 것입니다.`,
    author: 'ai_juyeon',
    authorId: 'user-juyeon',
    createdAt: '2026-08-08',
    likes: 203,
    comments: 47,
    views: 4120,
    hasAiSummary: true,
  },
  {
    id: 6,
    title: '오픈채팅으로 스터디 모집해서 6주간 알고리즘 스터디 운영한 후기',
    category: '사이드프로젝트',
    content: `커뮤니티에서 만난 5명과 매일 아침 인증하며 진행한 스터디, 어떻게 굴러갔는지 공유합니다.

- 매일 아침 7시 문제 풀이 인증
- 주 1회 화상으로 모여서 어려웠던 문제 리뷰
- 6주 완주율 100%

다음 기수도 모집할 예정이에요!`,
    author: 'study_master',
    authorId: 'user-study',
    createdAt: '2026-08-05',
    likes: 31,
    comments: 6,
    views: 305,
    hasAiSummary: false,
  },
  {
    id: 7,
    title: 'INDEX 프로젝트 1주차 회고: 라우터 구조 잡기',
    category: '사이드프로젝트',
    content: `React Router v7의 \`createBrowserRouter\`로 초기 라우팅 구조를 잡은 과정을 기록합니다.

Header + Layout 조합으로 공통 레이아웃을 구성하고, 페이지별 컴포넌트를 children으로 연결했습니다.`,
    author: '리뷰미',
    authorId: CURRENT_USER_ID,
    createdAt: '2026-08-04',
    likes: 18,
    comments: 3,
    views: 210,
    hasAiSummary: false,
  },
  {
    id: 8,
    title: 'Velog vs 자체 개발 블로그, 무엇을 선택해야 할까',
    category: '자유',
    content: `개발 커뮤니티에 글을 쓸 때 플랫폼을 자체 개발할지, 기존 서비스를 쓸지 고민한 기록입니다.

결론적으로 초기에는 기존 플랫폼을 활용하고, 트래픽이 늘어나면 자체 플랫폼으로 이전하는 전략을 추천합니다.`,
    author: 'kimcoding',
    authorId: 'user-kimcoding',
    createdAt: '2026-08-03',
    likes: 22,
    comments: 5,
    views: 401,
    hasAiSummary: false,
  },
  {
    id: 9,
    title: 'CSS Container Query 실전 활용기',
    category: '프론트엔드',
    content: `뷰포트가 아닌 부모 컨테이너 크기 기준으로 반응형을 구성할 수 있는 Container Query를 카드 컴포넌트에 적용해봤습니다.

\`\`\`css
.card-wrapper {
  container-type: inline-size;
}

@container (min-width: 400px) {
  .card {
    flex-direction: row;
  }
}
\`\`\``,
    author: 'sumin.dev',
    authorId: 'user-sumin',
    createdAt: '2026-08-02',
    likes: 39,
    comments: 4,
    views: 288,
    hasAiSummary: false,
  },
];

let nextId = posts.length + 1;

export const getPosts = (): Post[] => posts;

export const getPostById = (id: number): Post | undefined => posts.find((post) => post.id === id);

export type PostInput = {
  title: string;
  category: PostCategory;
  content: string;
};

export const createPost = (input: PostInput): Post => {
  const newPost: Post = {
    id: nextId++,
    title: input.title,
    category: input.category,
    content: input.content,
    author: CURRENT_USER_NICKNAME,
    authorId: CURRENT_USER_ID,
    createdAt: new Date().toISOString().slice(0, 10),
    likes: 0,
    comments: 0,
    views: 0,
    hasAiSummary: false,
  };
  posts.unshift(newPost);
  return newPost;
};

export const updatePost = (id: number, input: PostInput): Post | undefined => {
  const target = posts.find((post) => post.id === id);
  if (!target) return undefined;
  target.title = input.title;
  target.category = input.category;
  target.content = input.content;
  return target;
};

export const deletePost = (id: number): void => {
  const index = posts.findIndex((post) => post.id === id);
  if (index !== -1) posts.splice(index, 1);
};

export const getExcerpt = (content: string, maxLength = 90): string => {
  const plain = content
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[#>*_|-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  return plain.length > maxLength ? `${plain.slice(0, maxLength)}…` : plain;
};
