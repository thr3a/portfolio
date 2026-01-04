import fs from 'node:fs';

type BigMacRow = {
  date: string;
  year: number;
  localPrice: number;
};

type WageRow = {
  year: number;
  wage: number;
};

const parseBigMac = (csv: string): BigMacRow[] => {
  const lines = csv.trim().split('\n');
  if (lines.length <= 1) {
    return [];
  }

  const header = lines[0].split(',');
  const dateIndex = header.indexOf('date');
  const isoIndex = header.indexOf('iso_a3');
  const localPriceIndex = header.indexOf('local_price');

  if (dateIndex === -1 || isoIndex === -1 || localPriceIndex === -1) {
    return [];
  }

  const result: BigMacRow[] = [];

  for (let i = 1; i < lines.length; i += 1) {
    const line = lines[i].trim();
    if (line === '') {
      continue;
    }

    if (!line.includes(',JPN,')) {
      continue;
    }

    const columns = line.split(',');
    const iso = columns[isoIndex];

    if (iso !== 'JPN') {
      continue;
    }

    const date = columns[dateIndex];
    if (date.length < 4) {
      continue;
    }

    const year = Number.parseInt(date.slice(0, 4), 10);
    if (Number.isNaN(year)) {
      continue;
    }

    const localPrice = Number(columns[localPriceIndex]);
    if (Number.isNaN(localPrice)) {
      continue;
    }

    result.push({
      date,
      year,
      localPrice
    });
  }

  return result;
};

const parseWage = (csv: string): WageRow[] => {
  const lines = csv.trim().split('\n');
  if (lines.length <= 1) {
    return [];
  }

  const header = lines[0].split(',');
  const yearIndex = header.indexOf('year');
  const moneyIndex = header.indexOf('money');

  if (yearIndex === -1 || moneyIndex === -1) {
    return [];
  }

  const result: WageRow[] = [];

  for (let i = 1; i < lines.length; i += 1) {
    const line = lines[i].trim();
    if (line === '') {
      continue;
    }

    const columns = line.split(',');
    const yearValue = Number.parseInt(columns[yearIndex], 10);
    if (Number.isNaN(yearValue)) {
      continue;
    }

    const wageValue = Number(columns[moneyIndex]);
    if (Number.isNaN(wageValue)) {
      continue;
    }

    result.push({
      year: yearValue,
      wage: wageValue
    });
  }

  return result;
};

const buildLatestBigMacByYear = (rows: BigMacRow[]): Record<number, BigMacRow> => {
  const latestByYear: Record<number, BigMacRow> = {};

  rows.forEach((row) => {
    const current = latestByYear[row.year];
    if (!current) {
      latestByYear[row.year] = row;
      return;
    }

    if (row.date > current.date) {
      latestByYear[row.year] = row;
    }
  });

  return latestByYear;
};

const buildWageByYear = (rows: WageRow[], startYear: number): Record<number, number> => {
  if (rows.length === 0) {
    return {};
  }

  const sorted = [...rows].sort((a, b) => a.year - b.year);
  const maxYear = sorted[sorted.length - 1]?.year;

  const wageByYear: Record<number, number> = {};
  let currentWage: number | undefined;
  let index = 0;

  for (let year = startYear; year <= maxYear; year += 1) {
    while (index < sorted.length && sorted[index]?.year <= year) {
      currentWage = sorted[index]?.wage;
      index += 1;
    }

    if (currentWage !== undefined) {
      wageByYear[year] = currentWage;
    }
  }

  return wageByYear;
};

const main = (): void => {
  const bigMacCsv = fs.readFileSync(new URL('./big-mac-full-index-jul-25.csv', import.meta.url), 'utf8');
  const wageCsv = fs.readFileSync(new URL('./tokyo_min_wage_history.csv', import.meta.url), 'utf8');

  const bigMacRows = parseBigMac(bigMacCsv);
  const wageRows = parseWage(wageCsv);

  if (bigMacRows.length === 0 || wageRows.length === 0) {
    // データが取得できない場合は何も出力しない
    return;
  }

  const startYear = 2000;
  const latestBigMacByYear = buildLatestBigMacByYear(bigMacRows);

  const bigMacYears = Object.keys(latestBigMacByYear).map((value) => Number.parseInt(value, 10));
  const maxBigMacYear = bigMacYears.length > 0 ? Math.max(...bigMacYears) : startYear;

  const wageByYear = buildWageByYear(wageRows, startYear);
  const wageYears = Object.keys(wageByYear).map((value) => Number.parseInt(value, 10));
  const maxWageYear = wageYears.length > 0 ? Math.max(...wageYears) : startYear;

  const endYear = Math.max(maxBigMacYear, maxWageYear);

  const lines: string[] = [];
  lines.push('year,big_mac_price_jpy,tokyo_minimum_wage_jpy');

  for (let year = startYear; year <= endYear; year += 1) {
    const bigMac = latestBigMacByYear[year];
    const wage = wageByYear[year];

    const priceValue = bigMac ? bigMac.localPrice.toString() : '';
    const wageValue = wage !== undefined ? wage.toString() : '';

    lines.push(`${year},${priceValue},${wageValue}`);
  }

  // 標準出力にCSVとして出力
  // 例: node --import tsx ./src/scripts/hoge2.ts > output.csv
  // でファイルとして保存可能
  // eslint-disable-next-line no-console
  console.log(lines.join('\n'));
};

main();
