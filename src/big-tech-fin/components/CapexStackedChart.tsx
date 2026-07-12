import { BarChart } from '@mantine/charts';
import { Stack, Title } from '@mantine/core';
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
        gridAxis='y'
        withLegend
        legendProps={{ verticalAlign: 'top', height: 30 }}
        valueFormatter={(value) => `${value}`}
        yAxisProps={{ width: 44 }}
      />
    </Stack>
  );
};
