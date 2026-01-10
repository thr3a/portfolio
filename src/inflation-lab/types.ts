export type BigMacData = {
  year: number;
  big_mac_price_jpy: number;
};

export type MinimumWageData = {
  prefecture: string;
  prefecture_en: string;
  year: number;
  minimum_wage: number;
};

export type InflationResult = {
  userItemRatio: number;
  bigMacRatio: number;
  minimumWageRatio: number;
  userItemPastPrice: number;
  userItemCurrentPrice: number;
  bigMacPastPrice: number;
  bigMacCurrentPrice: number;
  minimumWagePastPrice: number;
  minimumWageCurrentPrice: number;
  pastYear: number;
  currentYear: number;
};
