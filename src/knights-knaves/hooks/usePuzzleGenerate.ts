import { useState } from 'react';
import type { PuzzleGenerateRequest, PuzzleResponse } from '../types';

const API_BASE_URL = 'https://misc-api-py.turai.work';

type UsePuzzleGenerateReturn = {
  generate: (request: PuzzleGenerateRequest) => Promise<PuzzleResponse | null>;
  loading: boolean;
  error: string | null;
};

export const usePuzzleGenerate = (): UsePuzzleGenerateReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = async (request: PuzzleGenerateRequest): Promise<PuzzleResponse | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/puzzle/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request)
      });
      if (!response.ok) {
        const errorData = await response.json();
        setError((errorData as { detail?: string }).detail ?? 'パズルの生成に失敗しました');
        return null;
      }
      const data = (await response.json()) as PuzzleResponse;
      return data;
    } catch {
      setError('ネットワークエラーが発生しました');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { generate, loading, error };
};
