import { useLocation } from 'react-router-dom';
import { ErrorState } from './ErrorState';
import { InfoScreen } from './InfoScreen';
import { Spinner } from './Spinner';

export function Loading() {
  return <div role="status" aria-label="불러오는 중" style={{ display: 'grid', placeItems: 'center', minHeight: 180 }}><Spinner /></div>;
}

export function LoginRequired() {
  const { pathname, search } = useLocation();
  return <InfoScreen title="로그인이 필요합니다" description="이 기능을 사용하려면 로그인해 주세요."
    actionLabel="로그인" actionTo={`/login?next=${encodeURIComponent(pathname + search)}`} />;
}

export function RequestError({ message, retry }: { message: string; retry: () => void }) {
  return <ErrorState description={message} onRetry={retry} />;
}
