// パスワード生成用定数
const LOWER = 'abcdefghijklmnopqrstuvwxyz';
const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const NUMBER = '0123456789';
const SYMBOL = '!@#$%^&*';
const SIMILAR = /[1lI0Oo]/g;

export type PasswordOptions = {
  length: number;
  lower: boolean;
  upper: boolean;
  number: boolean;
  symbol: boolean;
  excludeSimilar: boolean;
};

// 暗号学的に安全な乱数を生成する関数
function getRandomValues(array: Uint8Array): Uint8Array {
  // ブラウザ環境
  if (typeof window !== 'undefined' && window.crypto) {
    window.crypto.getRandomValues(array);
    return array;
  }
  // Node.js環境
  if (typeof global !== 'undefined' && global.crypto) {
    global.crypto.getRandomValues(array);
    return array;
  }
  // Node.jsのcryptoモジュールを使用
  try {
    const nodeCrypto = require('node:crypto');
    return nodeCrypto.getRandomValues(array);
  } catch (e) {
    throw new Error('Crypto.getRandomValues is not supported in this environment');
  }
}

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
export function generatePassword(options: PasswordOptions): string {
  const charset = getCharset(options);
  if (charset.length === 0) {
    return '';
  }

  const charsetLength = charset.length;
  const randomBytes = new Uint8Array(options.length);
  getRandomValues(randomBytes);

  let password = '';
  for (let i = 0; i < options.length; i++) {
    const randomIndex = randomBytes[i] % charsetLength;
    password += charset[randomIndex];
  }
  return password;
}
