// ==========================================
// React Hooks for API Calls
// ==========================================

import { useState, useCallback } from "react";
import type { ApiError } from "./types";

/**
 * Hook để quản lý state cho API calls
 */
export function useApiState<T>() {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const reset = useCallback(() => {
    setData(null);
    setLoading(false);
    setError(null);
  }, []);

  return { data, setData, loading, setLoading, error, setError, reset };
}

/**
 * Hook để thực hiện API call với loading và error handling
 * @example
 * const { execute, data, loading, error } = useApiCall(servicesApi.getAll);
 *
 * // Gọi API
 * execute({ active: true });
 */
export function useApiCall<TParams extends unknown[], TResult>(
  apiFunction: (...args: TParams) => Promise<TResult>,
) {
  const { data, setData, loading, setLoading, error, setError, reset } =
    useApiState<TResult>();

  const execute = useCallback(
    async (...args: TParams): Promise<TResult | null> => {
      setLoading(true);
      setError(null);

      try {
        const result = await apiFunction(...args);
        setData(result);
        return result;
      } catch (err) {
        const apiError = err as ApiError;
        setError(apiError);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [apiFunction, setData, setError, setLoading],
  );

  return { execute, data, loading, error, reset };
}

/**
 * Hook để fetch data khi component mount
 * @example
 * const { data, loading, error, refetch } = useFetch(() => servicesApi.getAll());
 */
export function useFetch<T>(
  fetchFn: () => Promise<T>,
  deps: React.DependencyList = [],
) {
  const { data, setData, loading, setLoading, error, setError } =
    useApiState<T>();

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await fetchFn();
      setData(result);
    } catch (err) {
      setError(err as ApiError);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchFn, ...deps]);

  // Auto fetch on mount - caller should use useEffect
  const refetch = useCallback(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, refetch, fetch };
}
