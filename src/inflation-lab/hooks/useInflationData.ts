import { useEffect, useState } from 'react';
import type { BigMacData, MinimumWageData } from '../types';

export const useInflationData = () => {
  const [bigMacData, setBigMacData] = useState<BigMacData[]>([]);
  const [minimumWageData, setMinimumWageData] = useState<MinimumWageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bigMacResponse, minimumWageResponse] = await Promise.all([
          fetch('/data/bigmac_price.csv'),
          fetch('/data/minimum_wage.csv')
        ]);

        if (!bigMacResponse.ok || !minimumWageResponse.ok) {
          throw new Error('データの取得に失敗しました');
        }

        const bigMacText = await bigMacResponse.text();
        const minimumWageText = await minimumWageResponse.text();

        // CSVをパース
        const parseBigMac = (text: string): BigMacData[] => {
          const lines = text.trim().split('\n');
          return lines.slice(1).map((line) => {
            const values = line.split(',');
            return {
              year: Number.parseInt(values[0], 10),
              big_mac_price_jpy: Number.parseInt(values[1], 10)
            };
          });
        };

        const parseMinimumWage = (text: string): MinimumWageData[] => {
          const lines = text.trim().split('\n');
          return lines.slice(1).map((line) => {
            const values = line.split(',');
            return {
              prefecture: values[0],
              prefecture_en: values[1],
              year: Number.parseInt(values[2], 10),
              minimum_wage: Number.parseInt(values[3], 10)
            };
          });
        };

        setBigMacData(parseBigMac(bigMacText));
        setMinimumWageData(parseMinimumWage(minimumWageText));
      } catch (err) {
        setError(err instanceof Error ? err.message : '不明なエラー');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { bigMacData, minimumWageData, loading, error };
};
