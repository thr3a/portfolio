import {
  Box,
  Button,
  Container,
  Group,
  MantineProvider,
  NumberInput,
  Paper,
  Progress,
  Select,
  Stack,
  Text,
  Title
} from '@mantine/core';
import { useDocumentTitle } from '@mantine/hooks';
import { useState } from 'react';
import { theme } from '../theme';
import { useInflationData } from './hooks/useInflationData';
import type { InflationResult } from './types';

const YEARS = Array.from({ length: 26 }, (_, i) => 2000 + i);

/**
 * プログレスバーの幅を計算する関数
 * @param ratio - 計算対象の比率（例: 1.70倍）
 * @param maxRatio - 最大比率（3つの比率の最大値 × 1.1）
 * @returns 0-100の範囲のパーセンテージ値（小数点第1位まで）
 */
const calculateProgressWidth = (ratio: number, maxRatio: number): number => {
  // 比率を最大比率で割って100倍し、小数点第1位で四捨五入
  return Math.round((ratio / maxRatio) * 100 * 10) / 10;
};

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
        <Container size='sm' py='xl'>
          <Text ta='center'>データを読み込んでいます...</Text>
        </Container>
      </MantineProvider>
    );
  }

  if (error) {
    return (
      <MantineProvider theme={theme}>
        <Container size='sm' py='xl'>
          <Text c='red' ta='center'>
            {error}
          </Text>
        </Container>
      </MantineProvider>
    );
  }

  return (
    <MantineProvider theme={theme}>
      <Container size='sm' py='xl'>
        <Stack gap={4} py='md'>
          <Title order={2}>インフレーションラボ</Title>
          <Text size='sm' c='dimmed'>
            経済感覚の「答え合わせ」と「再発見」
          </Text>
        </Stack>

        <Stack>
          <Paper withBorder p='md'>
            <Stack>
              <Text size='sm'>比較したい商品の価格を入力</Text>
              <Group align='flex-end'>
                <Box style={{ flex: 1 }}>
                  <Text size='sm' fw={500} mb={4}>
                    昔
                  </Text>
                  <Group>
                    <Select
                      data={YEARS.map((y) => ({ value: y.toString(), label: `${y}年` }))}
                      value={pastYear?.toString() ?? undefined}
                      onChange={(value) =>
                        setPastYear(typeof value === 'number' ? value : Number.parseInt(value ?? '0', 10))
                      }
                      placeholder='年を選択'
                      style={{ width: 120 }}
                    />
                    <NumberInput
                      value={pastPrice ?? undefined}
                      onChange={(value) => setPastPrice(typeof value === 'number' ? value : null)}
                      placeholder='価格'
                      min={0}
                      rightSection='円'
                      style={{ flex: 1 }}
                    />
                  </Group>
                </Box>

                <Box style={{ flex: 1 }}>
                  <Text size='sm' fw={500} mb={4}>
                    現在
                  </Text>
                  <Group>
                    <Select
                      data={YEARS.map((y) => ({ value: y.toString(), label: `${y}年` }))}
                      value={currentYear?.toString() ?? undefined}
                      onChange={(value) =>
                        setCurrentYear(typeof value === 'number' ? value : Number.parseInt(value ?? '0', 10))
                      }
                      placeholder='年を選択'
                      style={{ width: 120 }}
                    />
                    <NumberInput
                      value={currentPrice ?? undefined}
                      onChange={(value) => setCurrentPrice(typeof value === 'number' ? value : null)}
                      placeholder='価格'
                      min={0}
                      rightSection='円'
                      style={{ flex: 1 }}
                    />
                  </Group>
                </Box>
              </Group>

              <Button onClick={calculate} fullWidth>
                診断する
              </Button>
            </Stack>
          </Paper>

          {result &&
            (() => {
              // 最大比率を計算
              // 最大値のバーが100%になると他のバーとの比較が見づらくなるため、最大値のバーが約90%程度になるように1.1倍の余裕を持たせています
              const maxRatio = Math.max(result.userItemRatio, result.bigMacRatio, result.minimumWageRatio) * 1.1;

              const userWidth = calculateProgressWidth(result.userItemRatio, maxRatio);
              const bigMacWidth = calculateProgressWidth(result.bigMacRatio, maxRatio);
              const wageWidth = calculateProgressWidth(result.minimumWageRatio, maxRatio);

              return (
                <Paper withBorder p='md' bg='blue.0'>
                  <Stack>
                    <Title order={3} ta='center'>
                      診断結果
                    </Title>

                    <Box>
                      <Group justify='space-between' mb={'sm'}>
                        <Text fz={'lg'} fw={'bold'}>
                          あなたの商品
                        </Text>
                        <Text fz={'lg'} fw={'bold'}>
                          {result.userItemRatio.toFixed(2)}倍
                        </Text>
                      </Group>
                      <Progress size='xl' radius='xl' value={userWidth} />
                      <Text size='sm' ta={'right'}>
                        {result.userItemPastPrice}円→{result.userItemCurrentPrice}円
                      </Text>
                    </Box>

                    <Box>
                      <Group justify='space-between' mb={'sm'}>
                        <Text fz={'lg'} fw={'bold'}>
                          ビッグマック
                        </Text>
                        <Text fz={'lg'} fw={'bold'}>
                          {result.bigMacRatio.toFixed(2)}倍
                        </Text>
                      </Group>
                      <Progress size='xl' radius='xl' value={bigMacWidth} color='gray' />
                      <Text size='sm' ta={'right'}>
                        {result.bigMacPastPrice}円→{result.bigMacCurrentPrice}円
                      </Text>
                    </Box>

                    <Box>
                      <Group justify='space-between' mb={'sm'}>
                        <Text fz={'lg'} fw={'bold'}>
                          最低賃金（東京）
                        </Text>
                        <Text fz={'lg'} fw={'bold'}>
                          {result.minimumWageRatio.toFixed(2)}倍
                        </Text>
                      </Group>
                      <Progress size='xl' radius='xl' value={wageWidth} color='gray' />
                      <Text size='sm' ta={'right'}>
                        {result.minimumWagePastPrice}円→{result.minimumWageCurrentPrice}円
                      </Text>
                    </Box>

                    <Box mt='md' p='md' bg='white' style={{ borderRadius: 8 }}>
                      <Text fw={500} ta='center' mb={8}>
                        判定
                      </Text>
                      {result.userItemRatio > result.minimumWageRatio ? (
                        <Text ta='center' c='red.6' fw={700}>
                          この商品の値上がりは、最低賃金の上昇を上回っています。
                          <br />
                          社会全体から見て「異常な値上がり」の可能性があります。
                        </Text>
                      ) : result.userItemRatio > result.bigMacRatio ? (
                        <Text ta='center' c='orange.6' fw={700}>
                          この商品の値上がりは、ビッグマックの上昇を上回っています。
                          <br />
                          社会全体から見て「やや高い」傾向にあります。
                        </Text>
                      ) : (
                        <Text ta='center' c='green.6' fw={700}>
                          この商品の値上がりは、社会全体の物価上昇と同程度です。
                          <br />
                          「妥当な範囲」内と言えます。
                        </Text>
                      )}
                    </Box>
                  </Stack>
                </Paper>
              );
            })()}
        </Stack>
      </Container>
    </MantineProvider>
  );
}
