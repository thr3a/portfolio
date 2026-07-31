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

// 直近12ヶ月(LTM)バーのX軸ラベル
const LTM_LABEL = '直近12ヶ月';

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

// 直近12ヶ月(LTM)のCapex。値・比較対象(1年前のLTM)・集計期間の末四半期を持つ。
type LtmEntry = {
  value: number;
  prev: number | null;
  quarterEnd: string;
};

// 会社ごとに直近12ヶ月Capexを求める。JSONに入っている capexTTM をそのまま使うため、
// 未完了年でも常に4四半期ぶんの値になり、年次バーと高さを比較できる。
const buildLtmCapex = (quarters: CompanyOut['quarters']): LtmEntry | null => {
  const withTTM = quarters.filter((q) => q.capexTTM != null);
  const latest = withTTM.at(-1);
  if (!latest || latest.capexTTM == null) return null;
  // 4四半期前のTTM = 前年同期。前年比の分母に使う。
  const prev = withTTM.at(-5);
  return {
    value: latest.capexTTM / 1e9,
    prev: prev?.capexTTM != null ? prev.capexTTM / 1e9 : null,
    quarterEnd: latest.quarterEnd
  };
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
  // X軸ラベル -> 会社名 -> 1年前のCapex(USD bn)。前年比の算出に使う。
  prevByLabel: Map<string, Map<string, number>>;
  // X軸ラベル -> 会社名 -> 集計期間の末月(直近12ヶ月バーのみ。各社で最大1期ずれるため明示する)
  periodsByLabel: Map<string, Map<string, string>>;
};

// 各社の値・前年比、そして全社合計とその前年比を表示するカスタムツールチップ。
const CapexTooltip = ({ label, payload, prevByLabel, periodsByLabel }: CapexTooltipProps) => {
  if (!payload || payload.length === 0 || label == null) return null;

  const prevMap = prevByLabel.get(String(label));
  const periods = periodsByLabel.get(String(label));

  const total = payload.reduce((sum, item) => sum + Number(item.value ?? 0), 0);
  // 1社でも比較対象を欠く場合は合計の前年比を出さない(比較対象がそろわないため)
  const prevValues = payload.map((item) => prevMap?.get(String(item.name)));
  const prevTotal = prevValues.every((v) => v != null) ? prevValues.reduce((sum, v) => sum + Number(v), 0) : null;
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
                <Text fz='sm'>
                  {name}
                  {periods?.get(name) && (
                    <Text span fz='xs' c='dimmed' ml={4}>
                      〜{periods.get(name)}
                    </Text>
                  )}
                </Text>
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
  // 会社ごとの年次Capex / 直近12ヶ月Capexを算出
  const yearlyByTicker = new Map<string, Map<number, number>>();
  const ltmByTicker = new Map<string, LtmEntry>();
  for (const config of configs) {
    const company = companies.find((c) => c.ticker === config.ticker);
    if (!company) continue;
    yearlyByTicker.set(config.ticker, buildYearlyCapex(company.quarters));
    const ltm = buildLtmCapex(company.quarters);
    if (ltm) ltmByTicker.set(config.ticker, ltm);
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

  // X軸ラベル -> 会社名 -> 前年の値。ツールチップの前年比算出に使う。
  const prevByLabel = new Map<string, Map<string, number>>();
  for (const year of years) {
    const prevMap = new Map<string, number>();
    for (const config of configs) {
      const prev = yearlyByTicker.get(config.ticker)?.get(year - 1);
      if (prev != null) prevMap.set(config.name, Math.round(prev));
    }
    prevByLabel.set(String(year), prevMap);
  }

  // 未完了年は年次バーにせず、末尾に「直近12ヶ月」バーとして足す。
  // こうすると全バーが4四半期ぶんになり、決算発表の早い遅いで高さが変わらない。
  const periodsByLabel = new Map<string, Map<string, string>>();
  if (configs.every((config) => ltmByTicker.has(config.ticker))) {
    const ltmRow: Record<string, number | string> = { year: LTM_LABEL };
    const ltmPrev = new Map<string, number>();
    const ltmPeriods = new Map<string, string>();
    for (const config of configs) {
      const ltm = ltmByTicker.get(config.ticker);
      if (!ltm) continue;
      ltmRow[config.name] = Math.round(ltm.value);
      if (ltm.prev != null) ltmPrev.set(config.name, Math.round(ltm.prev));
      ltmPeriods.set(config.name, dayjs(ltm.quarterEnd).format('YYYY/MM'));
    }
    rows.push(ltmRow);
    prevByLabel.set(LTM_LABEL, ltmPrev);
    periodsByLabel.set(LTM_LABEL, ltmPeriods);
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
            <CapexTooltip label={label} payload={payload} prevByLabel={prevByLabel} periodsByLabel={periodsByLabel} />
          )
        }}
      />
      <Text fz='xs' c='dimmed' ta='right'>
        右端は各社の直近12ヶ月累計
      </Text>
    </Stack>
  );
};
