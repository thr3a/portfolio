import fs from 'node:fs';
import path from 'node:path';

// 型定義
type BigMacPrice = {
  year: number;
  big_mac_price_jpy: number;
};

type MinimumWage = {
  prefecture: string;
  prefecture_en: string;
  year: number;
  minimum_wage: number;
};

// CSVファイルを読み込む関数
const readCsv = <T>(filePath: string): T[] => {
  const fullPath = path.join(process.cwd(), filePath);
  const content = fs.readFileSync(fullPath, 'utf-8');
  const lines = content.trim().split('\n');
  const headers = lines[0].split(',');

  return lines.slice(1).map((line) => {
    const values = line.split(',');
    const obj = {} as T;
    headers.forEach((header, index) => {
      const key = header.trim();
      const value = values[index]?.trim();
      // 数値に変換可能なら変換
      if (value && !Number.isNaN(Number(value))) {
        (obj as Record<string, unknown>)[key] = Number(value);
      } else {
        (obj as Record<string, unknown>)[key] = value;
      }
    });
    return obj;
  });
};

// ビッグマック価格を取得
const getBigMacPrice = (year: number, bigMacPrices: BigMacPrice[]): number | null => {
  const data = bigMacPrices.find((item) => item.year === year);
  return data?.big_mac_price_jpy ?? null;
};

// 最低賃金を取得
const getMinimumWage = (prefecture: string, year: number, minimumWages: MinimumWage[]): number | null => {
  const data = minimumWages.find((item) => item.prefecture === prefecture && item.year === year);
  return data?.minimum_wage ?? null;
};

// ビッグマックを買うために必要な労働時間（分）を計算
const calculateWorkMinutes = (bigMacPrice: number, minimumWage: number): number => {
  // 時給（円/時）でビッグマックの価格を割り、60倍して分に変換
  return (bigMacPrice / minimumWage) * 60;
};

// メイン関数
const main = () => {
  // CSVデータを読み込み
  const bigMacPrices = readCsv<BigMacPrice>('public/data/bigmac_price.csv');
  const minimumWages = readCsv<MinimumWage>('public/data/minimum_wage.csv');

  // コマンドライン引数から都道府県と年を取得
  const args = process.argv.slice(2);
  if (args.length < 2) {
    console.error('使用方法: node --import tsx ./src/scripts/calcBigMacWorkTime.ts <都道府県> <年>');
    console.error('例: node --import tsx ./src/scripts/calcBigMacWorkTime.ts 東京 2024');
    process.exit(1);
  }

  const prefecture = args[0];
  const year = Number.parseInt(args[1], 10);

  if (Number.isNaN(year)) {
    console.error('エラー: 年は数値で指定してください');
    process.exit(1);
  }

  // データを取得
  const bigMacPrice = getBigMacPrice(year, bigMacPrices);
  const minimumWage = getMinimumWage(prefecture, year, minimumWages);

  // バリデーション
  if (bigMacPrice === null) {
    console.error(`エラー: ${year}年のビッグマック価格データが見つかりません`);
    process.exit(1);
  }

  if (minimumWage === null) {
    console.error(`エラー: ${prefecture}の${year}年の最低賃金データが見つかりません`);
    process.exit(1);
  }

  // 計算
  const workMinutes = calculateWorkMinutes(bigMacPrice, minimumWage);

  // 結果を表示
  console.log('='.repeat(50));
  console.log(`都道府県: ${prefecture}`);
  console.log(`年: ${year}`);
  console.log(`ビッグマック価格: ${bigMacPrice}円`);
  console.log(`最低賃金: ${minimumWage}円/時`);
  console.log('-'.repeat(50));
  console.log(`ビッグマック1つを買うために必要な労働時間: ${workMinutes.toFixed(2)}分`);
  console.log('='.repeat(50));
};

main();
