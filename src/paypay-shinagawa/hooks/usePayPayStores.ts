import { useDisclosure, useListState } from '@mantine/hooks';
import { useEffect, useState } from 'react';
import type { PayPayStore, PayPayStoreResponse } from '../types';

const DATA_PATH = '/shinagawa_paypay/result_uniq.json';

export function usePayPayStores() {
  const [stores, { setState: replaceStores }] = useListState<PayPayStore>([]);
  const [loading, { close: finishLoading }] = useDisclosure(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const abortController = new AbortController();

    const load = async () => {
      try {
        const response = await fetch(DATA_PATH, {
          signal: abortController.signal
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const json = (await response.json()) as PayPayStoreResponse;
        const fetchedStores = json.stores;
        replaceStores(Array.isArray(fetchedStores) ? fetchedStores : []);
      } catch (caughtError) {
        if (!abortController.signal.aborted) {
          setError(caughtError instanceof Error ? caughtError.message : '未知のエラー');
        }
      } finally {
        finishLoading();
      }
    };

    load();

    return () => {
      abortController.abort();
    };
  }, [finishLoading, replaceStores]);

  return {
    stores,
    loading,
    error
  };
}
