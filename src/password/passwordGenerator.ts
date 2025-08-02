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
    return window.crypto.getRandomValues(array);
  }
  // Node.js環境 (グローバルスコープ)
  if (typeof global !== 'undefined' && global.crypto) {
    return global.crypto.getRandomValues(array);
  }
  // Node.js環境 (モジュール)
  try {
    const nodeCrypto = require('node:crypto');
    return nodeCrypto.getRandomValues(array);
  } catch (e) {
    throw new Error('Crypto.getRandomValues is not supported in this environment');
  }
}

// 暗号学的に安全な方法で、0からmax-1までのランダムな整数を生成する
function secureRandomIndex(max: number): number {
  // 剰余バイアスを避けるための閾値
  const threshold = 256 - (256 % max);
  while (true) {
    const randomBytes = new Uint8Array(1);
    getRandomValues(randomBytes);
    const randomValue = randomBytes[0];

    if (randomValue < threshold) {
      return randomValue % max;
    }
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

export function generatePassword(options: PasswordOptions): string {
  const charset = getCharset(options);
  if (charset.length === 0) {
    return '';
  }

  // excludeSimilarオプションを考慮した各文字セットを定義
  const lowerCharset = options.excludeSimilar ? LOWER.replace(SIMILAR, '') : LOWER;
  const upperCharset = options.excludeSimilar ? UPPER.replace(SIMILAR, '') : UPPER;
  const numberCharset = options.excludeSimilar ? NUMBER.replace(SIMILAR, '') : NUMBER;
  const symbolCharset = SYMBOL; // SYMBOLには紛らわしい文字がない想定

  const requiredChars: string[] = [];

  // 各文字種から安全な乱数で1文字を必ず選ぶ
  if (options.lower && lowerCharset.length > 0) {
    const randomIndex = secureRandomIndex(lowerCharset.length);
    requiredChars.push(lowerCharset[randomIndex]);
  }
  if (options.upper && upperCharset.length > 0) {
    const randomIndex = secureRandomIndex(upperCharset.length);
    requiredChars.push(upperCharset[randomIndex]);
  }
  if (options.number && numberCharset.length > 0) {
    const randomIndex = secureRandomIndex(numberCharset.length);
    requiredChars.push(numberCharset[randomIndex]);
  }
  if (options.symbol && symbolCharset.length > 0) {
    const randomIndex = secureRandomIndex(symbolCharset.length);
    requiredChars.push(symbolCharset[randomIndex]);
  }

  // 必須文字数が要求された長さより多い場合は、必須文字のみでパスワードを生成
  if (requiredChars.length >= options.length) {
    // パスワードを安全な方法でシャッフル
    for (let i = requiredChars.length - 1; i > 0; i--) {
      const j = secureRandomIndex(i + 1);
      [requiredChars[i], requiredChars[j]] = [requiredChars[j], requiredChars[i]];
    }
    return requiredChars.slice(0, options.length).join('');
  }

  // 必須文字をパスワードに追加
  let password = requiredChars.join('');

  // 残りの文字数分をcharsetからランダムに選ぶ (この部分は元から安全)
  while (password.length < options.length) {
    const randomIndex = secureRandomIndex(charset.length);
    password += charset[randomIndex];
  }

  // パスワードを安全な方法でシャッフル
  const passwordArray = password.split('');
  for (let i = passwordArray.length - 1; i > 0; i--) {
    const j = secureRandomIndex(i + 1);
    [passwordArray[i], passwordArray[j]] = [passwordArray[j], passwordArray[i]];
  }

  return passwordArray.join('');
}
