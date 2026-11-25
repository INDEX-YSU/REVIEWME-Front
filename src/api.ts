export class ApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}
type Options = { method?: string; body?: unknown; signal?: AbortSignal };
const base = import.meta.env.VITE_API_BASE_URL ?? '/api/v1';
let accessToken: string | undefined;
let refreshRequest: Promise<string> | undefined;

export const setAccessToken = (token?: string) => { accessToken = token; };

const request = async <T>(path: string, options: Options, token?: string): Promise<T> => {
  let response: Response;
  try {
    response = await fetch(base + path, {
      method: options.method ?? 'GET',
      credentials: 'include',
      signal: options.signal,
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.body === undefined ? {} : { 'Content-Type': 'application/json' }),
      },
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
    });
  } catch (error) {
    if (options.signal?.aborted) throw error;
    throw new ApiError(0, '서버에 연결할 수 없습니다.');
  }
  if (response.status === 204) return undefined as T;
  const data = await response.json().catch(() => null);
  if (!response.ok || data?.success !== true) {
    throw new ApiError(response.status, data?.error?.message ?? '서버 요청을 처리하지 못했습니다.');
  }
  return data.data as T;
};

export const refreshSession = () => {
  const rotate = () => request<{ accessToken: string }>('/auth/refresh', { method: 'POST' });
  refreshRequest ??= (navigator.locks ? navigator.locks.request('reviewme-refresh-token', rotate) : rotate())
    .then(({ accessToken: token }) => {
      setAccessToken(token);
      return token;
    })
    .finally(() => { refreshRequest = undefined; });
  return refreshRequest;
};

export const api = async <T>(path: string, options: Options = {}): Promise<T> => {
  const token = accessToken;
  try {
    return await request<T>(path, options, token);
  } catch (error) {
    if (!(error instanceof ApiError) || error.status !== 401 || !token || path === '/auth/login') throw error;
    let updatedToken: string;
    try {
      updatedToken = accessToken && accessToken !== token ? accessToken : await refreshSession();
    } catch (refreshError) {
      if (refreshError instanceof ApiError && refreshError.status === 401) {
        setAccessToken();
        window.dispatchEvent(new Event('reviewme-session-expired'));
      }
      throw refreshError;
    }
    return request<T>(path, options, updatedToken);
  }
};

export const errorMessage = (error: unknown) =>
  error instanceof ApiError ? error.message : '요청을 처리하지 못했습니다. 다시 시도해 주세요.';

export const dateTime = (value: string) => new Intl.DateTimeFormat('ko-KR', {
  dateStyle: 'medium',
  timeStyle: 'short',
}).format(new Date(value));
