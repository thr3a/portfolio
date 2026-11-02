import { BarChart } from '@mantine/charts';
import { Paper, Stack, Text } from '@mantine/core';
import dayjs from 'dayjs';
import { formatGrowthPct, type GrowthRow } from '../utils/capexGrowth';

type Props = {
  rows: GrowthRow[];
  color: string;
  h: number;
};

// 各四半期が「年内で最初の四半期」か判定する。前行と西暦が変わる行だけtrue。
// 先頭行はその年の四半期が1つしか無いと次の年のラベルと重なるため、次行も同じ年のときだけtrueにする
export const yearStartFlags = (quarterEnds: string[]): boolean[] =>
  quarterEnds.map((quarterEnd, i) => {
    const year = dayjs(quarterEnd).year();
    if (i === 0) return quarterEnds[1] == null || dayjs(quarterEnds[1]).year() === year;
    return year !== dayjs(quarterEnds[i - 1]).year();
  });

// 前四半期の伸び率との差(pt)。どちらかが無ければnull
export const growthDelta = (row: GrowthRow): number | null => {
  if (row.growth == null || row.prevGrowth == null) return null;
  return row.growth - row.prevGrowth;
};

type GrowthTooltipProps = {
  label?: string | number;
  rows: GrowthRow[];
};

// 伸び率と、前四半期から加速したか減速したかを表示するツールチップ
const GrowthTooltip = ({ label, rows }: GrowthTooltipProps) => {
  const row = rows.find((r) => r.quarterEnd === label);
  if (!row) return null;
  const delta = growthDelta(row);

  return (
    <Paper px='md' py='sm' withBorder shadow='md'>
      <Stack gap={4}>
        <Text fz='sm' fw='bold'>
          {dayjs(row.quarterEnd).format('YYYY年M月')}期
        </Text>
        <Text fz='sm'>
          Capex 前年同期比{' '}
          <Text span fz='sm' fw='bold'>
            {formatGrowthPct(row.growth)}
          </Text>
        </Text>
        {delta != null && (
          <Text fz='xs' c={delta < 0 ? 'red.6' : 'teal.6'}>
            前四半期({formatGrowthPct(row.prevGrowth)})から {Math.abs(Math.round(delta))}pt{' '}
            {delta < 0 ? '減速' : '加速'}
          </Text>
        )}
      </Stack>
    </Paper>
  );
};

// 単一四半期Capexの前年同期比を、決算ごとに1本ずつ並べる棒グラフ
export const CapexGrowthBars = ({ rows, color, h }: Props) => {
  // 年内最初の四半期にだけ西暦ラベルを出す(CompanyChartと同じ考え方)
  const isFirstOfYear = yearStartFlags(rows.map((row) => row.quarterEnd));
  const yearTick = (value: unknown, index: number): string =>
    isFirstOfYear[index] && typeof value === 'string' ? dayjs(value).format('YYYY') : '';

  // 最新の四半期の棒にだけ伸び率ラベルを置く。x/y/widthは数値でない場合があるためNumber()で正規化
  const lastIndex = rows.length - 1;
  const renderLatestLabel = (props: {
    x?: number | string;
    y?: number | string;
    width?: number | string;
    height?: number | string;
    index?: number;
  }) => {
    const { x, y, width, height, index } = props;
    if (index !== lastIndex) return null;
    const growth = rows[lastIndex]?.growth ?? null;
    if (growth == null) return null;
    // 負の棒は下向きに伸びるので、ラベルを棒の下端に置く。heightは負の場合があるため上下端を求め直す
    const top = Math.min(Number(y), Number(y) + Number(height));
    const bottom = Math.max(Number(y), Number(y) + Number(height));
    const labelY = growth < 0 ? bottom + 12 : top - 6;
    return (
      <text
        x={Number(x) + Number(width) / 2}
        y={labelY}
        textAnchor='middle'
        fontSize={11}
        fontWeight='bold'
        fill='var(--mantine-color-text)'
      >
        {formatGrowthPct(growth)}
      </text>
    );
  };

  return (
    <BarChart
      h={h}
      data={rows}
      dataKey='quarterEnd'
      series={[{ name: 'growth', label: 'Capex 前年同期比', color }]}
      gridAxis='x'
      yAxisProps={{ width: 44, tickFormatter: (value: number) => `${value}%` }}
      xAxisProps={{ interval: 0, minTickGap: 0, tickFormatter: yearTick }}
      barProps={{ label: renderLatestLabel }}
      referenceLines={[{ y: 0, color: 'gray.5' }]}
      tooltipProps={{
        content: ({ label }) => <GrowthTooltip label={label} rows={rows} />
      }}
    />
  );
};
