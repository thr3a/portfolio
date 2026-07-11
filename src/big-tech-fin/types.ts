// fetchUsBigtechCashflow.ts が出力する public/USBigtechCashflow.json の型

export type QuarterOut = {
  quarterEnd: string;
  ocf: number | null;
  capex: number | null; // 正の支出額(絶対値)
  fcf: number | null; // ocf - capex
  ocfTTM: number | null;
  capexTTM: number | null;
  fcfTTM: number | null;
};

export type CompanyOut = {
  ticker: string;
  cik: string;
  entityName: string;
  ocfTag: string;
  capexTag: string;
  quarters: QuarterOut[];
};

export type CashflowData = {
  generatedAt: string;
  source: string;
  unit: string;
  note: string;
  companies: CompanyOut[];
};

// チャート描画用に整形した1四半期ぶんの行(単位はUSD bn = 10億ドル)
export type ChartRow = {
  quarterEnd: string;
  ocf: number;
  fcf: number;
  capex: number;
};

// 会社ごとの表示設定
export type CompanyConfig = {
  ticker: string;
  name: string;
  color: string; // 企業ブランドカラー(HEX)
};
