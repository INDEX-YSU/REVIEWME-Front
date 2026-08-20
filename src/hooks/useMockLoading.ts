import { useEffect, useState } from 'react';

export const useMockLoading = (delayMs = 500): boolean => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), delayMs);
    return () => clearTimeout(timer);
  }, [delayMs]);

  return isLoading;
};
