import {
  Box,
  Button,
  Container,
  Group,
  MantineProvider,
  NumberInput,
  Paper,
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
              <Group align='flex-end'>
                <Box style={{ flex: 1 }}>
                  <Text size='sm' fw={500} mb={4}>
                    過去
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

              <Button onClick={calculate} fullWidth size='lg'>
                計算！
              </Button>
            </Stack>
          </Paper>

          {result && (
            <Paper withBorder p='md' bg='blue.0'>
              <Stack>
                <Title order={3} ta='center'>
                  計算結果
                </Title>

                <Box>
                  <Text fw={500} mb={8}>
                    あなたの商品
                  </Text>
                  <Group justify='space-between'>
                    <Text size='sm'>
                      {result.pastYear}年: {result.userItemPastPrice}円
                    </Text>
                    <Text size='sm'>
                      {result.currentYear}年: {result.userItemCurrentPrice}円
                    </Text>
                  </Group>
                  <Text size='xl' fw={700} ta='center' mt={8} c='blue.6'>
                    {result.userItemRatio.toFixed(2)}倍
                  </Text>
                </Box>

                <Box>
                  <Text fw={500} mb={8}>
                    ビッグマック
                  </Text>
                  <Group justify='space-between'>
                    <Text size='sm'>
                      {result.pastYear}年: {result.bigMacPastPrice}円
                    </Text>
                    <Text size='sm'>
                      {result.currentYear}年: {result.bigMacCurrentPrice}円
                    </Text>
                  </Group>
                  <Text size='xl' fw={700} ta='center' mt={8} c='gray.6'>
                    {result.bigMacRatio.toFixed(2)}倍
                  </Text>
                </Box>

                <Box>
                  <Text fw={500} mb={8}>
                    最低賃金（東京）
                  </Text>
                  <Group justify='space-between'>
                    <Text size='sm'>
                      {result.pastYear}年: {result.minimumWagePastPrice}円
                    </Text>
                    <Text size='sm'>
                      {result.currentYear}年: {result.minimumWageCurrentPrice}円
                    </Text>
                  </Group>
                  <Text size='xl' fw={700} ta='center' mt={8} c='gray.6'>
                    {result.minimumWageRatio.toFixed(2)}倍
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
          )}
        </Stack>
      </Container>
    </MantineProvider>
  );
}
