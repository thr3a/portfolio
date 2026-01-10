import { Box, Group, Paper, Progress, Stack, Text, Title } from '@mantine/core';
import type { InflationResult } from '../types';

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

type DiagnosisResultProps = {
  result: InflationResult;
};

export function DiagnosisResult({ result }: DiagnosisResultProps) {
  // 最大比率を計算
  // 最大値のバーが100%になると他のバーとの比較が見づらくなるため、最大値のバーが約90%程度になるように1.1倍の余裕を持たせています
  const maxRatio = Math.max(result.userItemRatio, result.bigMacRatio, result.minimumWageRatio) * 1.1;

  const userWidth = calculateProgressWidth(result.userItemRatio, maxRatio);
  const bigMacWidth = calculateProgressWidth(result.bigMacRatio, maxRatio);
  const wageWidth = calculateProgressWidth(result.minimumWageRatio, maxRatio);

  return (
    <Paper withBorder p='md'>
      <Stack>
        <Title order={3} ta='center'>
          診断結果
        </Title>

        <Box mb={'lg'}>
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

        <Box mb={'lg'}>
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
          <Text ta='center' mb={8}>
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
}
