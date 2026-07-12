import { writeFileSync } from 'node:fs';

// ============================================================
// SEC EDGAR からキャッシュフロー(OCF/Capex/FCF)を四半期ごとに取得する
//   - 10-Q は期首からの累計(YTD)で報告されるため、単一四半期(3ヶ月)に分解する
//   - さらに直近4四半期を合計した TTM も算出する
//   実行: node --import tsx src/scripts/fetchUsBigtechCashflow.ts
// ============================================================

// SEC はコンタクト先付きの User-Agent を必須とする(無いと403)
const USER_AGENT = 'kabu-research mail@turai.work';

// 取得対象。Google は持株会社 Alphabet。ティッカーから CIK を自動解決する
const TICKERS = ['MSFT', 'AAPL', 'GOOGL', 'AMZN', 'ORCL', 'META'];

// この期末日以降のデータのみ採用(暦ベース)
const SINCE = '2017-03-01';

// OCF のタグ(会社差はほぼ無いが一応フォールバックを用意)
const OCF_TAGS = [
  'NetCashProvidedByUsedInOperatingActivities',
  'NetCashProvidedByUsedInOperatingActivitiesContinuingOperations'
];

// Capex のタグ。会社によって使うタグが異なるため優先順にフォールバック
const CAPEX_TAGS = [
  'PaymentsToAcquirePropertyPlantAndEquipment',
  'PaymentsToAcquireProductiveAssets',
  'PaymentsForCapitalImprovements'
];

type RawFact = {
  start?: string;
  end: string;
  val: number;
  fy: number;
  fp: string; // Q1/Q2/Q3/Q4/FY
  form: string; // 10-Q/10-K
  frame?: string;
};

// 一意な(会計期間)キー。同じ期間の重複報告(修正再提出など)を畳む用
function periodKey(f: RawFact): string {
  return `${f.start ?? ''}_${f.end}`;
}

// 期間の長さ(月数, おおよそ)
function months(start: string, end: string): number {
  const s = new Date(start);
  const e = new Date(end);
  return Math.round((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24 * 30.4));
}

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });
  if (!res.ok) {
    throw new Error(`fetch failed ${res.status} ${res.statusText}: ${url}`);
  }
  return (await res.json()) as T;
}

// ティッカー -> CIK(10桁ゼロ埋め) の対応表を SEC から取得
async function loadCikMap(): Promise<Map<string, string>> {
  const data = await fetchJson<Record<string, { cik_str: number; ticker: string }>>(
    'https://www.sec.gov/files/company_tickers.json'
  );
  const map = new Map<string, string>();
  for (const { cik_str, ticker } of Object.values(data)) {
    map.set(ticker.toUpperCase(), String(cik_str).padStart(10, '0'));
  }
  return map;
}

// 指定タグ群を全て取得してマージした USD 建て fact 配列を返す
// (Amazon のように期の途中で報告タグを乗り換える会社があるため、単一タグでは
//  期間が欠落する。優先順の低いタグから順に積み、同一期間は優先順の高いタグで上書きする)
async function fetchConcept(cik: string, tags: string[]): Promise<{ tag: string; facts: RawFact[] } | null> {
  const hitTags: string[] = [];
  const facts: RawFact[] = [];
  // 優先順の低いものから積むことで、後勝ち(toQuarterly の重複排除)で高優先タグが勝つ
  for (const tag of [...tags].reverse()) {
    const url = `https://data.sec.gov/api/xbrl/companyconcept/CIK${cik}/us-gaap/${tag}.json`;
    try {
      const data = await fetchJson<{ units: { USD?: RawFact[] } }>(url);
      const tagFacts = data.units?.USD;
      if (tagFacts && tagFacts.length > 0) {
        hitTags.unshift(tag);
        facts.push(...tagFacts);
      }
    } catch {
      // タグ未使用の会社は404。次の候補へ
    }
  }
  if (facts.length === 0) return null;
  return { tag: hitTags.join('+'), facts };
}

// YTD累計(3/6/9/12ヶ月混在)を、単一四半期(3ヶ月)の値に分解する
// 返り値: key = 四半期末(YYYY-MM-DD), value = その3ヶ月の値
//
// アルゴリズム: SEC の期間フローは「同一 start 日を共有する累計ラダー」で報告される。
//   例) 期首=10/1 なら [3M:12/31, 6M:3/31, 9M:6/30, 12M:9/30] が同じ start を持つ。
//   同一 start でグルーピングし end 昇順に隣接差分を取れば、各四半期(3ヶ月)値が得られる。
//   これは会計年度(fy/fp)フィールドに依存しないため、決算月が異なる各社で安定する。
type FactWithStart = RawFact & { start: string };

function toQuarterly(facts: RawFact[]): Map<string, number> {
  // 期間ごとに重複排除(同一 start_end は最後の報告値を採用)
  const byPeriod = new Map<string, FactWithStart>();
  for (const f of facts) {
    if (!f.start) continue; // 期間フローには start が必須
    byPeriod.set(periodKey(f), { ...f, start: f.start });
  }
  const all = [...byPeriod.values()];

  const quarterly = new Map<string, number>();
  const setIfAbsent = (end: string, val: number) => {
    if (!quarterly.has(end)) quarterly.set(end, val);
  };

  // パス1: 3ヶ月ちょうどの fact は最も信頼できる単一Q値。優先採用
  for (const f of all) {
    if (months(f.start, f.end) <= 4) setIfAbsent(f.end, f.val);
  }

  // パス2: start でグルーピングし、累計ラダーの隣接差分で残りの四半期を埋める
  const byStart = new Map<string, FactWithStart[]>();
  for (const f of all) {
    const arr = byStart.get(f.start) ?? [];
    arr.push(f);
    byStart.set(f.start, arr);
  }

  for (const [, group] of byStart) {
    const sorted = group.sort((a, b) => a.end.localeCompare(b.end));
    let prev: FactWithStart | null = null;
    for (const f of sorted) {
      if (prev === null) {
        // ラダー先頭。3ヶ月ぶんならそれ自体が四半期値
        if (months(f.start, f.end) <= 4) setIfAbsent(f.end, f.val);
      } else if (months(prev.end, f.end) <= 4) {
        // 隣接する累計の差分 = ちょうど1四半期ぶん
        setIfAbsent(f.end, f.val - prev.val);
      }
      prev = f;
    }
  }

  return quarterly;
}

type QuarterOut = {
  quarterEnd: string;
  ocf: number | null;
  capex: number | null; // 正の支出額(絶対値)
  fcf: number | null; // ocf - capex
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

function buildQuarters(ocfQ: Map<string, number>, capexQ: Map<string, number>): QuarterOut[] {
  // 四半期末の和集合を昇順に
  const ends = [...new Set([...ocfQ.keys(), ...capexQ.keys()])].filter((e) => e >= SINCE).sort();

  const rows: QuarterOut[] = ends.map((end) => {
    const ocf = ocfQ.get(end) ?? null;
    // Capex は SEC 上マイナス値なので絶対値に正規化
    const capexRaw = capexQ.get(end);
    const capex = capexRaw == null ? null : Math.abs(capexRaw);
    const fcf = ocf != null && capex != null ? ocf - capex : null;
    return {
      quarterEnd: end,
      ocf,
      capex,
      fcf,
      ocfTTM: null,
      capexTTM: null,
      fcfTTM: null
    };
  });

  // TTM = 直近4四半期の合計(4本揃っている場合のみ)
  for (let i = 3; i < rows.length; i++) {
    const window = rows.slice(i - 3, i + 1);
    const sum = (pick: (r: QuarterOut) => number | null): number | null =>
      window.every((r) => pick(r) != null) ? window.reduce((s, r) => s + (pick(r) as number), 0) : null;
    rows[i].ocfTTM = sum((r) => r.ocf);
    rows[i].capexTTM = sum((r) => r.capex);
    rows[i].fcfTTM = sum((r) => r.fcf);
  }

  return rows;
}

async function main() {
  const cikMap = await loadCikMap();
  const companies: CompanyOut[] = [];

  for (const ticker of TICKERS) {
    const cik = cikMap.get(ticker);
    if (!cik) {
      console.error(`CIK not found for ${ticker}`);
      continue;
    }

    const [ocf, capex] = await Promise.all([fetchConcept(cik, OCF_TAGS), fetchConcept(cik, CAPEX_TAGS)]);

    if (!ocf || !capex) {
      console.error(`${ticker}: missing data (ocf=${!!ocf} capex=${!!capex})`);
      continue;
    }

    const ocfQ = toQuarterly(ocf.facts);
    const capexQ = toQuarterly(capex.facts);
    const quarters = buildQuarters(ocfQ, capexQ);

    // entityName は companyconcept レスポンスに含まれる
    const entityName = (ocf.facts as unknown as { entityName?: string }[])[0]?.entityName ?? '';

    companies.push({
      ticker,
      cik,
      entityName,
      ocfTag: ocf.tag,
      capexTag: capex.tag,
      quarters
    });

    console.log(
      `${ticker.padEnd(5)} ${cik}  ${quarters.length}四半期  ` +
        `(${quarters[0]?.quarterEnd} 〜 ${quarters[quarters.length - 1]?.quarterEnd})  ` +
        `capexTag=${capex.tag}`
    );

    // SEC のレート制限(10 req/s)に配慮して軽くウェイト
    await new Promise((r) => setTimeout(r, 300));
  }

  const output = {
    generatedAt: new Date().toISOString(),
    source: 'SEC EDGAR (data.sec.gov XBRL companyconcept API)',
    unit: 'USD',
    note: 'ocf/capex/fcf は単一四半期(3ヶ月)。*TTM は直近4四半期合計。capex は支出額の絶対値。fcf = ocf - capex。',
    companies
  };

  writeFileSync('public/USBigtechCashflow.json', JSON.stringify(output, null, 2));
  console.log('\n-> public/USBigtechCashflow.json に保存しました');
}

main().catch((err) => {
  console.error(err.message ?? err);
  process.exit(1);
});
