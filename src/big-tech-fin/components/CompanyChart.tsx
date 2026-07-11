import { CompositeChart } from '@mantine/charts';
import { Stack, Text, Title } from '@mantine/core';
import type { ChartRow, CompanyConfig, QuarterOut } from '../types';

type Props = {
  config: CompanyConfig;
  quarters: QuarterOut[];
};

// HEXカラーを指定不透明度のrgba文字列に変換する(棒を薄く塗る用)
const hexToRgba = (hex: string, alpha: number): string => {
  const n = Number.parseInt(hex.slice(1), 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

// 四半期末の日付文字列(YYYY-MM-DD)。Q1(3月末)のときだけ西暦を返し、それ以外は空にする
// -> X軸ラベルが年に1回だけ表示されて見やすくなる
const yearTick = (value: string): string => (value.slice(5, 7) === '03' ? value.slice(0, 4) : '');

export const CompanyChart = ({ config, quarters }: Props) => {
  // TTMが3系列とも揃った四半期のみ採用し、USD bn(10億ドル)に換算する
  const rows: ChartRow[] = [];
  for (const q of quarters) {
    if (q.ocfTTM == null || q.fcfTTM == null || q.capexTTM == null) continue;
    rows.push({
      quarterEnd: q.quarterEnd,
      ocf: q.ocfTTM / 1e9,
      fcf: q.fcfTTM / 1e9,
      capex: q.capexTTM / 1e9
    });
  }

  return (
    <Stack gap='xs'>
      <Title order={3} fz='lg'>
        {config.name}
      </Title>
      <CompositeChart
        h={260}
        data={rows}
        dataKey='quarterEnd'
        curveType='monotone'
        withDots={false}
        strokeWidth={2.5}
        gridAxis='y'
        yAxisLabel='USD bn'
        withLegend
        legendProps={{ verticalAlign: 'top', height: 30 }}
        valueFormatter={(value) => value.toFixed(1)}
        yAxisProps={{ width: 44 }}
        xAxisProps={{ interval: 0, minTickGap: 0, tickFormatter: yearTick }}
        series={[
          { name: 'capex', label: 'Capex (TTM)', color: hexToRgba(config.color, 0.3), type: 'bar' },
          { name: 'fcf', label: 'FCF (TTM)', color: hexToRgba(config.color, 0.55), type: 'area' },
          { name: 'ocf', label: 'OCF', color: '#1a1a1a', type: 'line' }
        ]}
      />
      <Text size='xs' c='dimmed'>
        {config.ticker}
      </Text>
    </Stack>
  );
};
