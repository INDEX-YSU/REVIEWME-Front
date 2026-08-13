import type { OAuthProvider } from './authTypes';

// 실제로는 각 provider의 authorize 화면으로 리다이렉트되지만,
// 백엔드가 없는 단계이므로 code 파라미터를 붙여 콜백 경로로 바로 이동시킨다.
export const getMockAuthorizeUrl = (provider: OAuthProvider): string =>
  `/auth/callback/${provider}?code=mock_${provider}_code_${Date.now()}`;
