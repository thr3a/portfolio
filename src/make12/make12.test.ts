import { describe, expect, test } from 'vitest';
import {
  type OperatorSymbol,
  evaluateExpression,
  findAnySolution,
  formatExpression,
  generateMake12Problem,
  randomNumbers
} from './make12';

describe('evaluateExpression: 通常の優先順位(×・÷を先に, +・-を後に)で評価する', () => {
  test('例: 9 − 1 × 4 − 3 = 2', () => {
    const nums: [number, number, number, number] = [9, 1, 4, 3];
    const ops: [OperatorSymbol, OperatorSymbol, OperatorSymbol] = ['-', '×', '-'];
    expect(evaluateExpression(nums, ops)).toBe(2);
  });

  test('例: 2 + 3 × 4 + 5 = 19（乗算が先）', () => {
    const nums: [number, number, number, number] = [2, 3, 4, 5];
    const ops: [OperatorSymbol, OperatorSymbol, OperatorSymbol] = ['+', '×', '+'];
    expect(evaluateExpression(nums, ops)).toBe(19);
  });

  test('整数除算が成立するケース: 8 ÷ 2 ÷ 2 + 2 = 4', () => {
    const nums: [number, number, number, number] = [8, 2, 2, 2];
    const ops: [OperatorSymbol, OperatorSymbol, OperatorSymbol] = ['÷', '÷', '+'];
    expect(evaluateExpression(nums, ops)).toBe(4);
  });

  test('割り切れない除算は不正（null）: 9 ÷ 2 + 3 + 1', () => {
    const nums: [number, number, number, number] = [9, 2, 3, 1];
    const ops: [OperatorSymbol, OperatorSymbol, OperatorSymbol] = ['÷', '+', '+'];
    expect(evaluateExpression(nums, ops)).toBeNull();
  });

  test('すべて加算: 6 + 3 + 2 + 1 = 12', () => {
    const nums: [number, number, number, number] = [6, 3, 2, 1];
    const ops: [OperatorSymbol, OperatorSymbol, OperatorSymbol] = ['+', '+', '+'];
    expect(evaluateExpression(nums, ops)).toBe(12);
  });

  test('引き算を含む: 7 - 5 × 2 + 5 = 2', () => {
    const nums: [number, number, number, number] = [7, 5, 2, 5];
    const ops: [OperatorSymbol, OperatorSymbol, OperatorSymbol] = ['-', '×', '+'];
    expect(evaluateExpression(nums, ops)).toBe(2);
  });

  test('バリデーション: 不正な引数（演算子数が足りない）は null', () => {
    const nums: [number, number, number, number] = [6, 3, 2, 1];
    // @ts-expect-error テストのために不正な引数を渡す
    const ops = ['+'] as [OperatorSymbol, OperatorSymbol, OperatorSymbol];
    expect(evaluateExpression(nums, ops)).toBeNull();
  });
});

describe('formatExpression', () => {
  test('見やすい式文字列を生成', () => {
    const nums: [number, number, number, number] = [9, 1, 4, 3];
    const ops: [OperatorSymbol, OperatorSymbol, OperatorSymbol] = ['-', '×', '-'];
    expect(formatExpression(nums, ops)).toBe('9 - 1 × 4 - 3');
  });
});

describe('findAnySolution: 指定の4数字の順序で目標値を作れる演算子組み合わせを1つ返す', () => {
  test('12を作る: 解が存在するケース（6,3,2,1 は + + + で 12）', () => {
    const nums: [number, number, number, number] = [6, 3, 2, 1];
    const solution = findAnySolution(nums, 12);
    expect(solution).not.toBeNull();
    if (solution) {
      const val = evaluateExpression(nums, solution.operators);
      expect(val).toBe(12);
    }
  });

  test('10を作る: 解が存在するケース（1,2,3,4 は 1+2+3+4=10）', () => {
    const nums: [number, number, number, number] = [1, 2, 3, 4];
    const solution = findAnySolution(nums, 10);
    expect(solution).not.toBeNull();
    if (solution) {
      const val = evaluateExpression(nums, solution.operators);
      expect(val).toBe(10);
    }
  });

  test('12を作る: 解が存在しないケース（1,1,1,1）', () => {
    const nums: [number, number, number, number] = [1, 1, 1, 1];
    const solution = findAnySolution(nums, 12);
    expect(solution).toBeNull();
  });
});

describe('randomNumbers: 1..9 の4つを返す', () => {
  test('範囲チェック', () => {
    const nums = randomNumbers();
    expect(nums).toHaveLength(4);
    nums.forEach((n) => {
      expect(Number.isInteger(n)).toBe(true);
      expect(n).toBeGreaterThanOrEqual(1);
      expect(n).toBeLessThanOrEqual(9);
    });
  });
});

describe('generateMake12Problem: 4つの数字と、その数字で作れる回答例を1つ返す', () => {
  test('12を作る: deterministic 戦略（テストで再現性重視）', () => {
    const { numbers, solution } = generateMake12Problem({ target: 12, strategy: 'deterministic' });
    // 数字は 1..9 の4つ
    expect(numbers).toHaveLength(4);
    numbers.forEach((n) => {
      expect(Number.isInteger(n)).toBe(true);
      expect(n).toBeGreaterThanOrEqual(1);
      expect(n).toBeLessThanOrEqual(9);
    });

    // 解の検証: 評価して12
    const val = evaluateExpression(numbers, solution.operators);
    expect(val).toBe(12);

    // 表示用式文字列も一致形式で生成されている
    expect(solution.expression).toBe(
      `${numbers[0]} ${solution.operators[0]} ${numbers[1]} ${solution.operators[1]} ${numbers[2]} ${solution.operators[2]} ${numbers[3]}`
    );
  });

  test('10を作る: random-first 戦略', () => {
    const { numbers, solution } = generateMake12Problem({ target: 10, strategy: 'random-first', maxAttempts: 5000 });
    const val = evaluateExpression(numbers, solution.operators);
    expect(val).toBe(10);
  });
});
