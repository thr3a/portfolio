import { useEffect, useState } from 'react';
import type { CashflowData } from '../types';

// public/USBigtechCashflow.json を読み込むフック
export const useCashflowData = () => {
  const [data, setData] = useState<CashflowData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/USBigtechCashflow.json')
      .then((res) => {
        if (!res.ok) throw new Error(`データの読み込みに失敗しました (${res.status})`);
        return res.json();
      })
      .then((json: CashflowData) => setData(json))
      .catch((err: Error) => setError(err.message));
  }, []);

  return { data, error };
};
