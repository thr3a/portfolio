import { Box, Group, Paper, Progress, Stack, Text, Title } from '@mantine/core';
import { IconCheck, IconScale, IconTrendingDown, IconTrendingUp } from '@tabler/icons-react';
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

/**
 * 判定結果の型定義
 */
type VerdictResult = {
  label: string;
  color: string;
  comment: string;
  icon: React.ReactNode;
};

/**
 * 判定ロジック
 * @param userRatio - ユーザー商品の比率
 * @param bigMacRatio - ビッグマックの比率
 * @returns 判定結果
 */
const getVerdict = (userRatio: number, bigMacRatio: number): VerdictResult => {
  const ratioDiff = userRatio / bigMacRatio;

  if (ratioDiff > 1.5) {
    return {
      label: '激高！！',
      color: 'red',
      comment:
        '残念ながら、モノの値段の上がり幅をはるかに超えています。「昔はよかった」と言いたくなるのも無理はありません。',
      icon: <IconTrendingUp size={32} />
    };
  }

  if (ratioDiff > 1.1) {
    return {
      label: 'ちょい高',
      color: 'orange',
      comment: 'ビッグマックの上昇率を上回っています。少し割高感を感じているあなたの感覚は鋭いです。',
      icon: <IconTrendingUp size={32} />
    };
  }

  if (ratioDiff > 0.9) {
    return {
      label: '妥当なライン',
      color: 'blue',
      comment:
        'お見事！ビッグマック指数（物価基準）とほぼ同じ値上がり率です。社会全体のインフレと完全に連動しています。',
      icon: <IconScale size={32} />
    };
  }

  if (ratioDiff > 0.6) {
    return {
      label: 'お買い得',
      color: 'green',
      comment: '物価の上昇に比べて、価格の上昇が抑えられています。企業努力の賜物か、当時が高すぎたのかも？',
      icon: <IconCheck size={32} />
    };
  }

  return {
    label: '奇跡の安さ',
    color: 'teal',
    comment:
      'どうやっているんですか！？物価が上がっているのに、価格が変わらない（あるいは下がっている）なんて奇跡です。',
    icon: <IconTrendingDown size={32} />
  };
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

  // 判定結果を取得
  const verdict = getVerdict(result.userItemRatio, result.bigMacRatio);

  return (
    <Paper withBorder p='md'>
      <Stack>
        {/* 判定ヘッダーセクション */}
        <Box p='md' bg='gray.0'>
          <Stack>
            <Title order={3} ta={'center'}>
              診断結果
            </Title>
            <Group justify='center'>
              <Box bg={verdict.color} c='white' px='lg' py='sm' style={{ borderRadius: '24px' }}>
                <Group gap='xs'>
                  {verdict.icon}
                  <Text size='xl' fw='bold'>
                    {verdict.label}
                  </Text>
                </Group>
              </Box>
            </Group>
            <Text size='sm' ta='center'>
              {verdict.comment}
            </Text>
          </Stack>
        </Box>

        {/* ユーザー商品のバー */}
        <Box mb={'lg'}>
          <Group justify='space-between' mb={'sm'}>
            <Text fz={'lg'} fw={'bold'}>
              あなたの商品
            </Text>
            <Text fz={'lg'} fw={'bold'}>
              {result.userItemRatio.toFixed(2)}倍
            </Text>
          </Group>
          <Progress size='xl' radius='xl' value={userWidth} color={verdict.color} />
          <Text size='sm' ta={'right'}>
            {result.userItemPastPrice}円→{result.userItemCurrentPrice}円
          </Text>
        </Box>

        {/* ビッグマックのバー */}
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

        {/* 最低賃金のバー */}
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
      </Stack>
    </Paper>
  );
}
