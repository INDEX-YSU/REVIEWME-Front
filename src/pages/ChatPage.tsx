import { useMemo, useState } from 'react';
import { colors, radius, cardStyle, primaryButtonStyle } from '../styles/theme';

type Category = '전체' | '프론트엔드' | '백엔드' | 'AI' | '취업/포트폴리오' | '사이드프로젝트' | '자유';

type ChatRoom = {
  id: number;
  title: string;
  description: string;
  category: Exclude<Category, '전체'>;
  isPrivate: boolean;
  allowGuest: boolean;
  participants: number;
};

const CATEGORIES: Category[] = ['전체', '프론트엔드', '백엔드', 'AI', '취업/포트폴리오', '사이드프로젝트', '자유'];

const MOCK_ROOMS: ChatRoom[] = [
  {
    id: 1,
    title: 'React 19 마이그레이션 잡담방',
    description: 'React 19로 올리면서 겪은 이슈나 팁을 편하게 나누는 공간이에요.',
    category: '프론트엔드',
    isPrivate: false,
    allowGuest: true,
    participants: 24,
  },
  {
    id: 2,
    title: 'TypeScript 타입 설계 고민 상담소',
    description: '제네릭, 유틸리티 타입 설계가 막힐 때 같이 고민해요.',
    category: '프론트엔드',
    isPrivate: false,
    allowGuest: true,
    participants: 9,
  },
  {
    id: 3,
    title: '스프링 배치 & 대용량 데이터 스터디',
    description: '매주 화요일 스프링 배치 실전 사례를 리뷰하는 비공개 스터디방입니다.',
    category: '백엔드',
    isPrivate: true,
    allowGuest: false,
    participants: 6,
  },
  {
    id: 4,
    title: 'LLM 프로덕트 만들기',
    description: 'RAG, 에이전트, 프롬프트 엔지니어링 관련 실전 경험을 공유합니다.',
    category: 'AI',
    isPrivate: false,
    allowGuest: true,
    participants: 41,
  },
  {
    id: 5,
    title: '신입 개발자 이력서 첨삭방',
    description: '서류 통과율을 높이기 위한 이력서/포트폴리오 상호 피드백방이에요.',
    category: '취업/포트폴리오',
    isPrivate: true,
    allowGuest: true,
    participants: 15,
  },
  {
    id: 6,
    title: '코드 리뷰 봇 사이드 프로젝트 팀빌딩',
    description: 'Claude API 기반 코드 리뷰 봇을 함께 만들 팀원을 찾고 있어요.',
    category: '사이드프로젝트',
    isPrivate: false,
    allowGuest: true,
    participants: 5,
  },
  {
    id: 7,
    title: '알고리즘 스터디 (평일 아침 인증)',
    description: '매일 아침 7시 문제 풀이 인증하는 비공개 스터디방입니다.',
    category: '사이드프로젝트',
    isPrivate: true,
    allowGuest: false,
    participants: 5,
  },
  {
    id: 8,
    title: '오늘 하루 어땠나요',
    description: '개발 얘기가 아니어도 괜찮아요, 편하게 쉬어가는 자유 채팅방.',
    category: '자유',
    isPrivate: false,
    allowGuest: true,
    participants: 33,
  },
];

// Mock: 백엔드 연동 전이므로 현재 세션을 Guest로 가정
const isGuest = true;

export const ChatPage = () => {
  const [category, setCategory] = useState<Category>('전체');

  const rooms = useMemo(
    () => (category === '전체' ? MOCK_ROOMS : MOCK_ROOMS.filter((room) => room.category === category)),
    [category],
  );

  return (
    <div>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
        {CATEGORIES.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setCategory(item)}
            style={{
              padding: '8px 14px',
              borderRadius: radius.pill,
              border: `1px solid ${category === item ? colors.accentBorder : colors.border}`,
              background: category === item ? colors.accentBg : colors.bg,
              color: category === item ? colors.accent : colors.text,
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            {item}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {rooms.map((room) => {
          const entryBlocked = isGuest && room.isPrivate && !room.allowGuest;

          return (
            <div key={room.id} style={{ ...cardStyle, display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <h3 style={{ fontSize: '15px' }}>{room.title}</h3>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: radius.pill,
                      color: room.isPrivate ? colors.text : colors.accent,
                      background: room.isPrivate ? colors.bgSubtle : colors.accentBg,
                      border: `1px solid ${room.isPrivate ? colors.border : colors.accentBorder}`,
                    }}
                  >
                    {room.isPrivate ? 'Private' : 'Public'}
                  </span>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: radius.pill,
                      color: room.allowGuest ? colors.success : colors.text,
                      background: room.allowGuest ? colors.successBg : colors.bgSubtle,
                      border: `1px solid ${room.allowGuest ? colors.success : colors.border}`,
                    }}
                  >
                    {room.allowGuest ? 'Guest 입장 가능' : 'Guest 입장 불가'}
                  </span>
                </div>
                <p style={{ color: colors.text, fontSize: '13px', marginBottom: '8px' }}>{room.description}</p>
                <span style={{ fontSize: '12px', color: colors.text }}>
                  {room.category} · 현재 접속자 {room.participants}명
                </span>
              </div>

              <button
                type="button"
                disabled={entryBlocked}
                title={entryBlocked ? 'Guest는 입장할 수 없는 방입니다' : undefined}
                style={{
                  ...primaryButtonStyle,
                  opacity: entryBlocked ? 0.5 : 1,
                  cursor: entryBlocked ? 'not-allowed' : 'pointer',
                  flexShrink: 0,
                }}
              >
                {entryBlocked ? '입장 제한' : '입장하기'}
              </button>
            </div>
          );
        })}

        {rooms.length === 0 && (
          <p style={{ textAlign: 'center', color: colors.text, padding: '40px 0' }}>
            해당 카테고리의 채팅방이 없습니다.
          </p>
        )}
      </div>
    </div>
  );
};
