import { Container, MantineProvider, Stack, Text, Title } from '@mantine/core';
import { useDocumentTitle } from '@mantine/hooks';
import { useState } from 'react';
import { theme } from '../theme';
import { DiagnosisResult } from './components/DiagnosisResult';
import { ErrorState } from './components/ErrorState';
import { LoadingState } from './components/LoadingState';
import { PriceInputForm } from './components/PriceInputForm';
import { useInflationData } from './hooks/useInflationData';
import type { InflationResult } from './types';

export default function InflationLab() {
  useDocumentTitle('インフレーションラボ');

  const { bigMacData, minimumWageData, loading, error } = useInflationData();

  const [pastYear, setPastYear] = useState<number | null>(2000);
  const [currentYear, setCurrentYear] = useState<number | null>(2025);
  const [pastPrice, setPastPrice] = useState<number | null>(50);
  const [currentPrice, setCurrentPrice] = useState<number | null>(85);
  const [result, setResult] = useState<InflationResult | null>(null);

  const calculate = () => {
    if (pastYear === null || currentYear === null || pastPrice === null || currentPrice === null) {
      return;
    }

    // ビッグマックの価格を取得
    const bigMacPast = bigMacData.find((d) => d.year === pastYear);
    const bigMacCurrent = bigMacData.find((d) => d.year === currentYear);

    // 最低賃金を取得（東京のみ）
    const minimumWagePast = minimumWageData.find((d) => d.prefecture === '東京' && d.year === pastYear);
    const minimumWageCurrent = minimumWageData.find((d) => d.prefecture === '東京' && d.year === currentYear);

    if (!bigMacPast || !bigMacCurrent || !minimumWagePast || !minimumWageCurrent) {
      return;
    }

    const userItemRatio = currentPrice / pastPrice;
    const bigMacRatio = bigMacCurrent.big_mac_price_jpy / bigMacPast.big_mac_price_jpy;
    const minimumWageRatio = minimumWageCurrent.minimum_wage / minimumWagePast.minimum_wage;

    setResult({
      userItemRatio,
      bigMacRatio,
      minimumWageRatio,
      userItemPastPrice: pastPrice,
      userItemCurrentPrice: currentPrice,
      bigMacPastPrice: bigMacPast.big_mac_price_jpy,
      bigMacCurrentPrice: bigMacCurrent.big_mac_price_jpy,
      minimumWagePastPrice: minimumWagePast.minimum_wage,
      minimumWageCurrentPrice: minimumWageCurrent.minimum_wage,
      pastYear,
      currentYear
    });
  };

  if (loading) {
    return (
      <MantineProvider theme={theme}>
        <LoadingState />
      </MantineProvider>
    );
  }

  if (error) {
    return (
      <MantineProvider theme={theme}>
        <ErrorState error={error} />
      </MantineProvider>
    );
  }

  return (
    <MantineProvider theme={theme}>
      <Container size='sm'>
        <Stack gap={4} py='md'>
          <Title order={2}>インフレーションラボ</Title>
          <Text size='sm' c='dimmed'>
            経済感覚の「答え合わせ」と「再発見」
          </Text>
        </Stack>

        <Stack>
          <PriceInputForm
            pastYear={pastYear}
            setPastYear={setPastYear}
            currentYear={currentYear}
            setCurrentYear={setCurrentYear}
            pastPrice={pastPrice}
            setPastPrice={setPastPrice}
            currentPrice={currentPrice}
            setCurrentPrice={setCurrentPrice}
            onCalculate={calculate}
          />

          {result && <DiagnosisResult result={result} />}
        </Stack>
      </Container>
    </MantineProvider>
  );
}
