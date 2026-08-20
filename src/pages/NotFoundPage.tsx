import { InfoScreen } from '../components/InfoScreen';

export const NotFoundPage = () => (
  <InfoScreen
    title="페이지를 찾을 수 없습니다"
    description="잘못된 경로로 접근했어요. 주소를 다시 확인해주세요."
    actionLabel="홈으로"
    actionTo="/"
  />
);
