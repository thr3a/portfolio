import fs from 'node:fs/promises';
import { google } from 'googleapis';

type ServiceAccountKey = {
  client_email: string;
  private_key: string;
};

// Record<string, unknown> に変換するために必要な型アサーション
const isServiceAccountKey = (value: unknown): value is ServiceAccountKey => {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const record = value as Record<string, unknown>;

  return typeof record.client_email === 'string' && typeof record.private_key === 'string';
};

const loadServiceAccountKey = async (): Promise<ServiceAccountKey> => {
  const json = await fs.readFile('./gcp_credentials.json', 'utf8');
  const parsed: unknown = JSON.parse(json);

  if (!isServiceAccountKey(parsed)) {
    throw new Error('gcp_credentials.json の形式が不正です');
  }

  return parsed;
};

const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

const extractUrlsFromFeed = (xml: string): string[] => {
  const itemMatches = xml.match(/<item[\s\S]*?<\/item>/g);

  if (itemMatches === null) {
    throw new Error('フィードから item 要素を検出できませんでした');
  }

  const urls: string[] = [];

  for (const item of itemMatches) {
    const linkMatch = item.match(/<link>([^<]+)<\/link>/i);

    if (linkMatch === null || linkMatch[1] === undefined) {
      continue;
    }

    const rawUrl = linkMatch[1].trim();

    // Hatena Blog の RSS ではクエリパラメータに utm_source=feed が付与されるため、
    // 検索インデックス登録時には不要なトラッキングパラメータを取り除く
    const normalizedUrl = rawUrl.replace(/\?utm_source=feed$/, '');

    urls.push(normalizedUrl);
  }

  if (urls.length === 0) {
    throw new Error('フィードから URL を抽出できませんでした');
  }

  return urls;
};

const fetchFeedUrls = async (): Promise<string[]> => {
  const response = await fetch('https://blog.turai.work/rss');

  if (!response.ok) {
    throw new Error(`フィードの取得に失敗しました: ${response.status} ${response.statusText}`);
  }

  const xml = await response.text();
  const urls = extractUrlsFromFeed(xml);

  return urls;
};

const publishToIndexingApi = async (accessToken: string, url: string): Promise<void> => {
  const endpoint = 'https://indexing.googleapis.com/v3/urlNotifications:publish';

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`
    },
    body: JSON.stringify({
      url,
      type: 'URL_UPDATED'
    })
  });

  // リクエストごとに結果を出力
  console.log({
    url,
    status: response.status,
    ok: response.ok
  });
};

const main = async (): Promise<void> => {
  const key = await loadServiceAccountKey();

  const jwtClient = new google.auth.JWT({
    email: key.client_email,
    key: key.private_key,
    scopes: ['https://www.googleapis.com/auth/indexing']
  });

  const tokens = await jwtClient.authorize();

  if (tokens.access_token === undefined || tokens.access_token === null) {
    throw new Error('Google Indexing API 用のアクセストークン取得に失敗しました');
  }

  const urls = await fetchFeedUrls();

  for (const url of urls) {
    await publishToIndexingApi(tokens.access_token, url);
    await sleep(500);
  }
};

void main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
