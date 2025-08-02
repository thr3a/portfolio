import { describe, expect, it } from 'vitest';
import { generatePassword, getCharset } from './passwordGenerator';
import type { PasswordOptions } from './passwordGenerator';

describe('passwordGenerator', () => {
  const defaultOptions: PasswordOptions = {
    length: 8,
    lower: true,
    upper: true,
    number: true,
    symbol: true,
    excludeSimilar: false
  };

  it('指定された長さのパスワードを生成する', () => {
    const password = generatePassword(defaultOptions);
    expect(password).toHaveLength(8);
  });

  it('小文字のみのパスワードを生成する', () => {
    const options: PasswordOptions = {
      length: 8,
      lower: true,
      upper: false,
      number: false,
      symbol: false,
      excludeSimilar: false
    };
    const password = generatePassword(options);
    expect(password).toMatch(/^[a-z]+$/);
  });

  it('大文字のみのパスワードを生成する', () => {
    const options: PasswordOptions = {
      length: 8,
      lower: false,
      upper: true,
      number: false,
      symbol: false,
      excludeSimilar: false
    };
    const password = generatePassword(options);
    expect(password).toMatch(/^[A-Z]+$/);
  });

  it('数字のみのパスワードを生成する', () => {
    const options: PasswordOptions = {
      length: 8,
      lower: false,
      upper: false,
      number: true,
      symbol: false,
      excludeSimilar: false
    };
    const password = generatePassword(options);
    expect(password).toMatch(/^[0-9]+$/);
  });

  it('記号のみのパスワードを生成する', () => {
    const options: PasswordOptions = {
      length: 8,
      lower: false,
      upper: false,
      number: false,
      symbol: true,
      excludeSimilar: false
    };
    const password = generatePassword(options);
    expect(password).toMatch(/^[!@#$%^&*]+$/);
  });

  it('似た文字を除外したパスワードを生成する', () => {
    const options: PasswordOptions = {
      length: 100, // 長めのパスワードを生成して確実に含まれるか確認
      lower: true,
      upper: true,
      number: true,
      symbol: true,
      excludeSimilar: true
    };
    const password = generatePassword(options);
    expect(password).not.toMatch(/[1lI0O]/);
  });

  it('すべてのオプションが無効な場合、空文字列を返す', () => {
    const options: PasswordOptions = {
      length: 8,
      lower: false,
      upper: false,
      number: false,
      symbol: false,
      excludeSimilar: false
    };
    const password = generatePassword(options);
    expect(password).toBe('');
  });

  // getCharsetのテスト
  it('getCharsetで正しい文字セットを生成する', () => {
    const options: PasswordOptions = {
      length: 8,
      lower: true,
      upper: false,
      number: true,
      symbol: false,
      excludeSimilar: false
    };
    const charset = getCharset(options);
    expect(charset).toBe('abcdefghijklmnopqrstuvwxyz0123456789');
  });

  it('getCharsetで似た文字を除外した文字セットを生成する', () => {
    const options: PasswordOptions = {
      length: 8,
      lower: true,
      upper: true,
      number: true,
      symbol: false,
      excludeSimilar: true
    };
    const charset = getCharset(options);
    expect(charset).not.toMatch(/[1lI0O]/);
  });
});
