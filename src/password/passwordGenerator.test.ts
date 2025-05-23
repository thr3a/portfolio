import { describe, expect, it } from 'vitest';
import { type PasswordOptions, generatePassword, getCharset } from './passwordGenerator';

describe('getCharset', () => {
  it('小文字のみ', () => {
    const opt: PasswordOptions = {
      length: 100,
      lower: true,
      upper: false,
      number: false,
      symbol: false,
      excludeSimilar: false
    };
    expect(getCharset(opt)).toBe('abcdefghijklmnopqrstuvwxyz');
  });

  it('大文字・数字・記号含む', () => {
    const opt: PasswordOptions = {
      length: 100,
      lower: false,
      upper: true,
      number: true,
      symbol: true,
      excludeSimilar: false
    };
    expect(getCharset(opt)).toBe('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*');
  });

  it('似た文字を除外', () => {
    const opt: PasswordOptions = {
      length: 100,
      lower: true,
      upper: true,
      number: true,
      symbol: false,
      excludeSimilar: true
    };
    // 1, l, I, 0, Oが除外されていること
    expect(getCharset(opt)).not.toMatch(/[1lI0O]/);
  });
});

describe('generatePassword', () => {
  it('指定長・文字セットで生成される', () => {
    const charset = 'abc123';
    const pw = generatePassword(12, charset);
    expect(pw).toHaveLength(12);
    expect([...pw].every((c) => charset.includes(c))).toBe(true);
  });

  it('文字セットが空なら空文字', () => {
    expect(generatePassword(10, '')).toBe('');
  });

  it('長さ0なら空文字', () => {
    expect(generatePassword(0, 'abc')).toBe('');
  });

  it('全パターンで一意性が高い', () => {
    const charset = 'abcdef';
    const results = new Set(Array.from({ length: 20 }, () => generatePassword(8, charset)));
    expect(results.size).toBeGreaterThan(15);
  });
});
