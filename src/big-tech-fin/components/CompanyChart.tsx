import { CompositeChart } from '@mantine/charts';
import { Stack, Title } from '@mantine/core';
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

// ツールチップのラベルを「YYYY年M月」形式に整形
const monthLabel = (value: unknown): string => {
  if (typeof value !== 'string') return '';
  return `${value.slice(0, 4)}年${Number(value.slice(5, 7))}月`;
};

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

  // 各四半期が「年内で最初の四半期」か判定する。前行と西暦が変わる行だけtrue
  // -> 決算期が3月末でないOracle等でもX軸ラベルを年1回だけ表示できる
  const isFirstOfYear = rows.map((row, i) => row.quarterEnd.slice(0, 4) !== rows[i - 1]?.quarterEnd.slice(0, 4));

  // 年内最初の四半期のときだけ西暦を返し、それ以外は空にする
  const yearTick = (value: unknown, index: number): string =>
    isFirstOfYear[index] && typeof value === 'string' ? value.slice(0, 4) : '';

  // Capex(TTM)の前年同期比伸び率を、年内最初の四半期にだけ「+38%」形式で持たせる。
  // TTM同士の比較なので4四半期前(=1年前)の行と比べる。1年前が無い最初期はnull。
  const capexYoYLabels = rows.map((row, i) => {
    if (!isFirstOfYear[i]) return null;
    const prev = rows[i - 4];
    if (prev == null || prev.capex === 0) return null;
    const rate = row.capex / prev.capex - 1;
    return `${rate >= 0 ? '+' : ''}${Math.round(rate * 100)}%`;
  });

  // recharts Barのlabelに渡す描画関数。棒の中央上に伸び率ラベルをSVGで置く。
  // ラベルが無いindexでは何も描かない。x/y/widthは数値でない場合があるためNumber()で正規化。
  const renderCapexLabel = (props: {
    x?: number | string;
    y?: number | string;
    width?: number | string;
    index?: number;
  }) => {
    const { x, y, width, index } = props;
    if (index == null) return null;
    const text = capexYoYLabels[index];
    if (text == null) return null;
    return (
      <text
        x={Number(x) + Number(width) / 2}
        y={Number(y) - 6}
        textAnchor='middle'
        fontSize={9}
        fontWeight='bold'
        fill={config.color}
      >
        {text}
      </text>
    );
  };

  return (
    <Stack gap='xs'>
      <Title order={3} ta={'center'}>
        {config.name}
      </Title>
      <CompositeChart
        h={300}
        data={rows}
        dataKey='quarterEnd'
        curveType='monotone'
        withDots={false}
        strokeWidth={2.5}
        gridAxis='y'
        yAxisLabel='USD bn'
        withLegend
        legendProps={{ verticalAlign: 'top', height: 30 }}
        tooltipProps={{ labelFormatter: monthLabel }}
        valueFormatter={(value) => value.toFixed(1)}
        yAxisProps={{ width: 44 }}
        xAxisProps={{ interval: 0, minTickGap: 0, tickFormatter: yearTick }}
        barProps={(series) => (series.name === 'capex' ? { label: renderCapexLabel } : {})}
        series={[
          { name: 'capex', label: 'Capex(設備投資)', color: hexToRgba(config.color, 0.3), type: 'bar' },
          { name: 'fcf', label: 'FCF', color: hexToRgba(config.color, 0.55), type: 'area' },
          { name: 'ocf', label: 'OCF(営業CF)', color: '#8A8C8E', type: 'line' }
        ]}
      />
    </Stack>
  );
};
