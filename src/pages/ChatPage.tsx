import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CURRENT_USER_ID } from '../mocks/posts';
import { CHAT_CATEGORIES, createRoom, getRooms } from '../mocks/chatRooms';
import type { ChatCategory, RoomInput } from '../mocks/chatRooms';
import { colors, radius, cardStyle, inputStyle, primaryButtonStyle } from '../styles/theme';
import { EmptyState } from '../components/EmptyState';
import { SkeletonLine } from '../components/Skeleton';
import { useMockLoading } from '../hooks/useMockLoading';
import { CreateRoomModal } from '../components/CreateRoomModal';

type CategoryFilter = ChatCategory | '전체';

const CATEGORY_FILTERS: CategoryFilter[] = ['전체', ...CHAT_CATEGORIES];

// Mock: 백엔드 연동 전이므로 현재 세션을 Guest로 가정
const isGuest = true;

export const ChatPage = () => {
  const navigate = useNavigate();
  const isLoading = useMockLoading(500);
  const [category, setCategory] = useState<CategoryFilter>('전체');
  const [keyword, setKeyword] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [rooms, setRooms] = useState(() => getRooms());

  const filteredRooms = useMemo(
    () =>
      rooms.filter(
        (room) =>
          (category === '전체' || room.category === category) &&
          (room.title.includes(keyword) || room.description.includes(keyword)),
      ),
    [rooms, category, keyword],
  );

  const handleCreateRoom = (input: RoomInput) => {
    const room = createRoom(input);
    setRooms(getRooms());
    setIsCreateOpen(false);
    navigate(`/chat/${room.id}`);
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <input
          type="text"
          placeholder="채팅방 제목, 설명으로 검색"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          style={{ ...inputStyle, flex: 1 }}
        />
        <button type="button" onClick={() => setIsCreateOpen(true)} style={{ ...primaryButtonStyle, whiteSpace: 'nowrap' }}>
          방 만들기
        </button>
      </div>

      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
        {CATEGORY_FILTERS.map((item) => (
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
        {isLoading &&
          Array.from({ length: 3 }, (_, i) => (
            <div key={i} style={cardStyle}>
              <SkeletonLine width="50%" />
              <div style={{ height: '10px' }} />
              <SkeletonLine width="85%" />
            </div>
          ))}

        {!isLoading &&
          filteredRooms.map((room) => {
            const entryBlocked = isGuest && room.isPrivate && !room.allowGuest && room.ownerId !== CURRENT_USER_ID;

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
                  onClick={() => navigate(`/chat/${room.id}`)}
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

        {!isLoading && filteredRooms.length === 0 && (
          <EmptyState
            icon="💭"
            title="채팅방이 없어요"
            description={keyword ? `'${keyword}'에 대한 채팅방을 찾을 수 없어요.` : '해당 카테고리의 채팅방이 아직 없어요.'}
          />
        )}
      </div>

      {isCreateOpen && <CreateRoomModal onClose={() => setIsCreateOpen(false)} onSubmit={handleCreateRoom} />}
    </div>
  );
};
