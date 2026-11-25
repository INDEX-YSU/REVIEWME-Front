import { useEffect, useState } from 'react';
import { api, ApiError, errorMessage } from '../api';

type Result<T> =
  | { status: 'loading' }
  | { status: 'ready'; value: T }
  | { status: 'error'; statusCode: number; message: string };

export function useResource<T>(path: string) {
  const [state, setState] = useState<{ path: string; result: Result<T> }>();
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    api<T>(path, { signal: controller.signal }).then(
      (value) => {
        if (!controller.signal.aborted) setState({ path, result: { status: 'ready', value } });
      },
      (error: unknown) => {
        if (!controller.signal.aborted) {
          setState({ path, result: { status: 'error', statusCode: error instanceof ApiError ? error.status : 0,
            message: errorMessage(error) } });
        }
      },
    );
    return () => controller.abort();
  }, [path, revision]);
  const result: Result<T> = state?.path === path ? state.result : { status: 'loading' };
  return { result, reload: () => setRevision((value) => value + 1) };
}
