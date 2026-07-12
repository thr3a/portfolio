import { mkdirSync, writeFileSync } from 'node:fs';

// ============================================================
// fetchUsBigtechCashflow.ts が生成した public/USBigtechCashflow.json を
// パースし、ティッカー別の CSV(MSFT.csv など)を出力する。
//   - 値は TTM(直近4四半期合計)を 10億ドル単位・小数1桁 に変換
//   - 期間は四半期末を YY/MM 表記(例: 2020-03-31 -> 20/03)
//   - 横持ち: 1列目に指標名、以降の列が各期間
//   実行: node --import tsx src/scripts/buildUsBigtechCashflowCsv.ts
// ============================================================

// この四半期末(暦ベース)以降のみ出力
const SINCE = '2020-01-01';

const INPUT = 'public/USBigtechCashflow.json';
const OUTPUT_DIR = 'public/cashflow';

type QuarterOut = {
  quarterEnd: string;
  ocf: number | null;
  capex: number | null;
  fcf: number | null;
  ocfTTM: number | null;
  capexTTM: number | null;
  fcfTTM: number | null;
};

type CompanyOut = {
  ticker: string;
  cik: string;
  entityName: string;
  ocfTag: string;
  capexTag: string;
  quarters: QuarterOut[];
};

type CashflowJson = {
  companies: CompanyOut[];
};

// 2020-03-31 -> 20/03
const toPeriodLabel = (quarterEnd: string): string => {
  const [year, month] = quarterEnd.split('-');
  return `${year.slice(2)}/${month}`;
};

// USD -> 10億ドル単位・小数1桁。null は空文字
const toBillion = (val: number | null): string => {
  if (val == null) return '';
  return (val / 1e9).toFixed(1);
};

// CSV セルのエスケープ(指標名にカンマ等は無いが一応)
const escapeCell = (cell: string): string => {
  if (/[",\n]/.test(cell)) return `"${cell.replace(/"/g, '""')}"`;
  return cell;
};

const toCsvLine = (cells: string[]): string => cells.map(escapeCell).join(',');

const buildCsv = (company: CompanyOut): string => {
  // TTM が揃っている 2020年以降の四半期のみ採用
  const rows = company.quarters.filter((q) => q.quarterEnd >= SINCE && q.ocfTTM != null);

  const header = ['期間', ...rows.map((q) => toPeriodLabel(q.quarterEnd))];
  const ocf = ['OCF', ...rows.map((q) => toBillion(q.ocfTTM))];
  const capex = ['Capex', ...rows.map((q) => toBillion(q.capexTTM))];
  const fcf = ['FCF', ...rows.map((q) => toBillion(q.fcfTTM))];

  return [header, ocf, capex, fcf].map(toCsvLine).join('\n');
};

const main = async () => {
  const { readFile } = await import('node:fs/promises');
  const data: CashflowJson = JSON.parse(await readFile(INPUT, 'utf-8'));

  mkdirSync(OUTPUT_DIR, { recursive: true });

  for (const company of data.companies) {
    const csv = buildCsv(company);
    const path = `${OUTPUT_DIR}/${company.ticker}.csv`;
    writeFileSync(path, `${csv}\n`);
    const cols = csv.split('\n')[0].split(',').length - 1;
    console.log(`${company.ticker.padEnd(5)} -> ${path}  (${cols}期間)`);
  }

  console.log(`\n-> ${OUTPUT_DIR}/ にティッカー別 CSV を保存しました`);
};

main().catch((err) => {
  console.error(err.message ?? err);
  process.exit(1);
});
