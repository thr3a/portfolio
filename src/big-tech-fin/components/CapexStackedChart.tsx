import { BarChart } from '@mantine/charts';
import { Box, Divider, Group, Paper, Stack, Text, Title } from '@mantine/core';
import dayjs from 'dayjs';
import type { CompanyConfig, CompanyOut } from '../types';

type Props = {
  companies: CompanyOut[];
  configs: CompanyConfig[];
};

// スタック表示を開始する西暦(この年以降のみ表示)
const START_YEAR = 2019;

// 会社ごとに「西暦 -> その年の単一四半期Capex合計(USD bn)」のMapを作る。
// 4四半期そろっている年のみ有効とし、期の途中で欠ける年(直近の未完了年など)は除外する。
const buildYearlyCapex = (quarters: CompanyOut['quarters']): Map<number, number> => {
  const sums = new Map<number, number>();
  const counts = new Map<number, number>();
  for (const q of quarters) {
    if (q.capex == null) continue;
    const year = dayjs(q.quarterEnd).year();
    sums.set(year, (sums.get(year) ?? 0) + q.capex / 1e9);
    counts.set(year, (counts.get(year) ?? 0) + 1);
  }
  const result = new Map<number, number>();
  for (const [year, sum] of sums) {
    if (counts.get(year) === 4) result.set(year, sum);
  }
  return result;
};

// 伸び率を「+12.3%」のような文字列に整形する。前年データが無い場合は「—」。
const formatGrowth = (growth: number | null): string => {
  if (growth == null) return '—';
  return `${growth >= 0 ? '+' : ''}${growth.toFixed(1)}%`;
};

// ツールチップに渡ってくるRechartsのpayload要素(必要なフィールドのみ)
type TooltipItem = {
  name?: string | number;
  value?: number | string | readonly (string | number)[];
  color?: string;
};

type CapexTooltipProps = {
  label?: string | number;
  payload?: readonly TooltipItem[];
  // 西暦(文字列) -> 会社名 -> その年のCapex(USD bn)。前年比の算出に使う。
  valuesByYear: Map<string, Map<string, number>>;
};

// 各社の値・前年比、そして全社合計とその前年比を表示するカスタムツールチップ。
const CapexTooltip = ({ label, payload, valuesByYear }: CapexTooltipProps) => {
  if (!payload || payload.length === 0 || label == null) return null;

  const prevMap = valuesByYear.get(String(Number(label) - 1));

  const total = payload.reduce((sum, item) => sum + Number(item.value ?? 0), 0);
  const prevTotal = prevMap ? [...prevMap.values()].reduce((sum, v) => sum + v, 0) : null;
  const totalGrowth = prevTotal ? ((total - prevTotal) / prevTotal) * 100 : null;

  // 積み上げの最上段(Google)から順に表示したいので逆順にする。
  const items = [...payload].reverse();

  return (
    <Paper px='md' py='sm' withBorder shadow='md'>
      <Text fw='bold' mb='xs'>
        {label}
      </Text>
      <Stack gap={6}>
        <Group justify='space-between' gap='xl' wrap='nowrap'>
          <Text fz='sm' fw='bold'>
            合計
          </Text>
          <Text fz='sm' fw='bold'>
            {total}
            <Text span fz='xs' c={totalGrowth != null && totalGrowth < 0 ? 'red.6' : 'teal.6'} ml={6}>
              {formatGrowth(totalGrowth)}
            </Text>
          </Text>
        </Group>
        <Divider />
        {items.map((item) => {
          const name = String(item.name);
          const value = Number(item.value ?? 0);
          const prev = prevMap?.get(name) ?? null;
          const growth = prev ? ((value - prev) / prev) * 100 : null;
          return (
            <Group key={name} justify='space-between' gap='xl' wrap='nowrap'>
              <Group gap='xs' wrap='nowrap'>
                <Box w={10} h={10} bg={item.color} style={{ flexShrink: 0 }} />
                <Text fz='sm'>{name}</Text>
              </Group>
              <Text fz='sm'>
                {value}
                <Text span fz='xs' c={growth != null && growth < 0 ? 'red.6' : 'teal.6'} ml={6}>
                  {formatGrowth(growth)}
                </Text>
              </Text>
            </Group>
          );
        })}
      </Stack>
    </Paper>
  );
};

export const CapexStackedChart = ({ companies, configs }: Props) => {
  // 会社ごとの年次Capexを算出
  const yearlyByTicker = new Map<string, Map<number, number>>();
  for (const config of configs) {
    const company = companies.find((c) => c.ticker === config.ticker);
    if (!company) continue;
    yearlyByTicker.set(config.ticker, buildYearlyCapex(company.quarters));
  }

  // START_YEAR以降で「全社そろっている年」だけを対象にする
  const years: number[] = [];
  const latestYear = Math.max(...[...yearlyByTicker.values()].flatMap((m) => [...m.keys()]));
  for (let year = START_YEAR; year <= latestYear; year++) {
    const allPresent = configs.every((config) => yearlyByTicker.get(config.ticker)?.has(year));
    if (allPresent) years.push(year);
  }

  // BarChart用のデータ行を組み立てる(キーは会社名)
  const rows = years.map((year) => {
    const row: Record<string, number | string> = { year: String(year) };
    for (const config of configs) {
      row[config.name] = Math.round(yearlyByTicker.get(config.ticker)?.get(year) ?? 0);
    }
    return row;
  });

  // 西暦(文字列) -> 会社名 -> Capex のルックアップ。ツールチップの前年比算出に使う。
  const valuesByYear = new Map<string, Map<string, number>>();
  for (const row of rows) {
    const companyMap = new Map<string, number>();
    for (const config of configs) {
      companyMap.set(config.name, Number(row[config.name] ?? 0));
    }
    valuesByYear.set(String(row.year), companyMap);
  }

  // 積み上げは配列の先頭が最下段。上からGoogle→Amazon→MS→Meta→Oracleにしたいので逆順にする。
  const series = [...configs].reverse().map((config) => ({ name: config.name, color: config.color }));

  return (
    <Stack gap='xs'>
      <Title order={3} ta='center'>
        Capex(設備投資)の推移
      </Title>
      <BarChart
        h={400}
        data={rows}
        dataKey='year'
        type='stacked'
        series={series}
        yAxisLabel='USD bn'
        gridAxis='x'
        withLegend
        legendProps={{ verticalAlign: 'top', height: 30 }}
        valueFormatter={(value) => `${value}`}
        yAxisProps={{ width: 44 }}
        tooltipProps={{
          content: ({ label, payload }) => (
            <CapexTooltip label={label} payload={payload} valuesByYear={valuesByYear} />
          ),
        }}
      />
    </Stack>
  );
};
