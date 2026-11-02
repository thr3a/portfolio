import { ChartLegend, ChartTooltip, CompositeChart, type CompositeChartSeries } from '@mantine/charts';
import { Stack, Text, Title, useMantineTheme } from '@mantine/core';
import { useId } from '@mantine/hooks';
import dayjs from 'dayjs';
import type { ChartRow, CompanyConfig, QuarterOut } from '../types';
import { buildQuarterlyCapexGrowth, type GrowthRow } from '../utils/capexGrowth';
import { CapexGrowthBars, yearStartFlags } from './CapexGrowthBars';

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
  return dayjs(value).format('YYYY年M月');
};

const formatValue = (value: number): string => value.toFixed(1);

// 通常時のドットは隠し、ホバー中の四半期だけ系列色のドットを表示する
const hoverDotProps = (stroke: string) => ({
  fill: 'var(--mantine-color-body)',
  r: 4,
  stroke,
  strokeWidth: 2
});

// OCF=稼いだ現金(本文色の線) / Capex=出ていくお金(ブランド色) / FCF=残るお金(緑、マイナスは赤)
const OCF_COLOR = 'var(--mantine-color-text)';

export const CompanyChart = ({ config, quarters }: Props) => {
  const theme = useMantineTheme();
  const fcfGradientId = useId();
  const fcfPositive = theme.colors.teal[6];
  const fcfNegative = theme.colors.red[6];
  // Capexは会社のブランド色。そのまま塗るとFCFの面が埋もれるため少し透かす
  const capexColor = hexToRgba(config.color, 0.6);

  const series: CompositeChartSeries[] = [
    { name: 'capex', label: 'Capex(設備投資)', color: capexColor, type: 'bar' },
    { name: 'fcf', label: 'FCF', color: fcfPositive, type: 'area' },
    { name: 'ocf', label: 'OCF(営業CF)', color: OCF_COLOR, type: 'line' }
  ];

  // FCFは描画色が url(#グラデーション) になり凡例とツールチップの色チップが塗れないため、
  // payload のFCF項目だけ色を差し替える。値がマイナスなら赤にする
  const withFcfColor = <T extends { dataKey?: unknown; color?: string; value?: unknown }>(items: readonly T[]): T[] =>
    items.map((item) => {
      if (item.dataKey !== 'fcf') return item;
      const negative = typeof item.value === 'number' && item.value < 0;
      return { ...item, color: negative ? fcfNegative : fcfPositive };
    });

  // TTMが3系列とも揃った四半期のみ採用し、USD bn(10億ドル)に換算する
  const allRows: ChartRow[] = [];
  for (const q of quarters) {
    if (q.ocfTTM == null || q.fcfTTM == null || q.capexTTM == null) continue;
    allRows.push({
      quarterEnd: q.quarterEnd,
      ocf: q.ocfTTM / 1e9,
      fcf: q.fcfTTM / 1e9,
      capex: q.capexTTM / 1e9
    });
  }

  // 直近X年分のみ表示し、それより古いデータは切り捨てる。
  // 基準は最新四半期の年月とし、そのX年前より前の四半期を除外する。
  const latest = allRows.at(-1)?.quarterEnd;
  const cutoff = latest ? dayjs(latest).subtract(6, 'year') : null;
  const rows = cutoff ? allRows.filter((row) => dayjs(row.quarterEnd).isAfter(cutoff)) : allRows;

  // 各四半期が「年内で最初の四半期」か判定する。前行と西暦が変わる行だけtrue
  // -> 決算期が3月末でないOracle等でもX軸ラベルを年1回だけ表示できる
  const isFirstOfYear = yearStartFlags(rows.map((row) => row.quarterEnd));

  // 年内最初の四半期のときだけ西暦を返し、それ以外は空にする
  const yearTick = (value: unknown, index: number): string =>
    isFirstOfYear[index] && typeof value === 'string' ? dayjs(value).format('YYYY') : '';

  // 単一四半期Capexの前年同期比。上のグラフと同じ四半期を並べてX軸をそろえる
  const growthByQuarterEnd = new Map(buildQuarterlyCapexGrowth(quarters).map((row) => [row.quarterEnd, row]));
  const growthRows: GrowthRow[] = rows.map(
    (row) => growthByQuarterEnd.get(row.quarterEnd) ?? { quarterEnd: row.quarterEnd, growth: null, prevGrowth: null }
  );

  // FCFの面と線を0を境に緑/赤で塗り分けるため、グラデーションの切り替え位置を求める。
  // 面の外接矩形は上端=FCF最大値、下端=FCF最小値(0をまたぐ場合)なので、上から max/(max-min) の位置が0になる
  const fcfMax = Math.max(...rows.map((row) => row.fcf));
  const fcfMin = Math.min(...rows.map((row) => row.fcf));
  const zeroOffset = fcfMax <= 0 ? 0 : fcfMin >= 0 ? 1 : fcfMax / (fcfMax - fcfMin);

  // ホバー中のFCFドットも正負に合わせて色を変える
  const renderFcfActiveDot = (props: { cx?: number; cy?: number; index: number }) => {
    const fcf = rows[props.index]?.fcf ?? 0;
    const dot = hoverDotProps(fcf < 0 ? fcfNegative : fcfPositive);
    return <circle cx={props.cx} cy={props.cy} {...dot} />;
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
        gridAxis='x'
        yAxisLabel='USD bn'
        withLegend
        legendProps={{
          verticalAlign: 'top',
          height: 30,
          // 独自描画にしたため凡例ホバーでの系列強調は無効
          content: ({ payload }) => (
            <ChartLegend
              payload={payload ? withFcfColor(payload) : undefined}
              series={series}
              legendPosition='top'
              onHighlight={() => {}}
            />
          )
        }}
        tooltipProps={{
          cursor: {
            fill: hexToRgba(config.color, 0.08),
            stroke: hexToRgba(config.color, 0.45),
            strokeWidth: 1
          },
          content: ({ label, payload }) => (
            <ChartTooltip
              label={monthLabel(label)}
              payload={payload ? withFcfColor(payload) : undefined}
              series={series}
              valueFormatter={formatValue}
            />
          )
        }}
        valueFormatter={formatValue}
        yAxisProps={{ width: 44 }}
        xAxisProps={{ interval: 0, minTickGap: 0, tickFormatter: yearTick }}
        referenceLines={[{ y: 0, color: 'gray.5' }]}
        lineProps={{ activeDot: hoverDotProps(OCF_COLOR) }}
        // FCFの面と線だけ、0を境に緑/赤へ切り替わるグラデーションで塗る
        areaProps={{ fill: `url(#${fcfGradientId})`, stroke: `url(#${fcfGradientId})`, activeDot: renderFcfActiveDot }}
        series={series}
      >
        <defs>
          <linearGradient id={fcfGradientId} x1='0' y1='0' x2='0' y2='1'>
            <stop offset={zeroOffset} stopColor={fcfPositive} />
            <stop offset={zeroOffset} stopColor={fcfNegative} />
          </linearGradient>
        </defs>
      </CompositeChart>
      <Text size='xs' c='dimmed' ta='center'>
        Capexの前年同期比
      </Text>
      <CapexGrowthBars rows={growthRows} color={capexColor} h={140} />
    </Stack>
  );
};
