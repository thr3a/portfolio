import dayjs from 'dayjs';
import type { QuarterOut } from '../types';

// 単一四半期Capexの前年同期比(%)。prevGrowthは1つ前の四半期の伸び率で、加速/減速の判定に使う
export type GrowthRow = {
  quarterEnd: string;
  growth: number | null;
  prevGrowth: number | null;
};

// 決算期末を暦四半期の末月(03/06/09/12)に寄せたキー(YYYY-MM)にする。
// Oracle(2/5/8/11月末決算)を他社と同じ四半期に並べるため、1ヶ月後ろの暦四半期に割り当てる
export const toCalendarQuarterKey = (quarterEnd: string): string => {
  const d = dayjs(quarterEnd);
  const month = Math.ceil((d.month() + 1) / 3) * 3;
  return `${d.year()}-${String(month).padStart(2, '0')}`;
};

// 同じ暦四半期の1年前のキー
const prevYearKey = (key: string): string => {
  const [year, month] = key.split('-');
  return `${Number(year) - 1}-${month}`;
};

// 伸び率(%)。比較対象が無い・0以下の場合はnull
const growthRate = (value: number, prev: number | undefined): number | null => {
  if (prev == null || prev <= 0) return null;
  return (value / prev - 1) * 100;
};

// キー -> Capex のMapから、キー順に伸び率の行を作る。
// Capexが欠けた四半期も行として残し、prevGrowthが常に直前の四半期を指すようにする
const buildRows = (
  keys: string[],
  capexByKey: Map<string, number>,
  toQuarterEnd: (key: string) => string
): GrowthRow[] => {
  const rows: GrowthRow[] = [];
  for (const key of [...keys].sort()) {
    const capex = capexByKey.get(key);
    const growth = capex == null ? null : growthRate(capex, capexByKey.get(prevYearKey(key)));
    rows.push({ quarterEnd: toQuarterEnd(key), growth, prevGrowth: rows.at(-1)?.growth ?? null });
  }
  return rows;
};

// 1社ぶん。quarterEndは元の決算期末のまま返す(各社グラフのX軸と揃えるため)
export const buildQuarterlyCapexGrowth = (quarters: QuarterOut[]): GrowthRow[] => {
  const capexByKey = new Map<string, number>();
  const quarterEndByKey = new Map<string, string>();
  for (const q of quarters) {
    const key = toCalendarQuarterKey(q.quarterEnd);
    quarterEndByKey.set(key, q.quarterEnd);
    if (q.capex != null) capexByKey.set(key, q.capex);
  }
  return buildRows([...quarterEndByKey.keys()], capexByKey, (key) => quarterEndByKey.get(key) ?? key);
};

// 伸び率を「+12%」形式に整形する。nullは「—」
export const formatGrowthPct = (growth: number | null): string => {
  if (growth == null) return '—';
  return `${growth >= 0 ? '+' : ''}${Math.round(growth)}%`;
};
