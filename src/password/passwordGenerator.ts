// パスワード生成用定数
const LOWER = 'abcdefghijklmnopqrstuvwxyz';
const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const NUMBER = '0123456789';
const SYMBOL = '!@#$%^&*';
const SIMILAR = /[1lI0O]/g;

export type PasswordOptions = {
  length: number;
  lower: boolean;
  upper: boolean;
  number: boolean;
  symbol: boolean;
  excludeSimilar: boolean;
};

// 指定されたオプションから文字セットを生成
export function getCharset(options: PasswordOptions): string {
  let chars = '';
  if (options.lower) chars += LOWER;
  if (options.upper) chars += UPPER;
  if (options.number) chars += NUMBER;
  if (options.symbol) chars += SYMBOL;
  if (options.excludeSimilar) chars = chars.replace(SIMILAR, '');
  return chars;
}

// 指定された長さと文字セットでパスワードを生成
export function generatePassword(length: number, charset: string): string {
  if (!charset) return '';
  const arr = new Uint32Array(length);
  // ブラウザ/Node両対応
  if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
    crypto.getRandomValues(arr);
  } else {
    // Node.js用フォールバック
    // biome-ignore lint/suspicious/noExplicitAny: Node.js用
    const nodeCrypto: any = require('node:crypto');
    nodeCrypto.randomFillSync(arr);
  }
  return Array.from(arr)
    .map((v) => charset[v % charset.length])
    .join('');
}
