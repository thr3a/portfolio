/**
 * make12ゲーム用の計算ロジック
 * 4つの数字と3つの演算子（+ - * /）と括弧を使い、12を作れるか判定・式生成
 * テストはvitestで行う
 */

/**
 * 使用可能な演算子
 */
export const operators = ['+', '-', '*', '/'] as const;
export type Operator = (typeof operators)[number];

/**
 * 4つの数字から12を作れるか判定
 * @param nums 1~9の4つの数字
 * @returns 12を作れる場合true
 */
export function canMake12(nums: number[]): boolean {
  return findMake12Expressions(nums).length > 0;
}

/**
 * 4つの数字から12を作る全ての式（文字列）を返す
 * @param nums 1~9の4つの数字
 * @returns 12になる式の配列（例: ["2*3+(5+1)"]）
 */
export function findMake12Expressions(nums: number[]): string[] {
  // 数字の順列
  function permute(arr: number[]): number[][] {
    if (arr.length === 1) return [arr];
    const result: number[][] = [];
    for (let i = 0; i < arr.length; i++) {
      const rest = arr.slice(0, i).concat(arr.slice(i + 1));
      for (const p of permute(rest)) {
        result.push([arr[i], ...p]);
      }
    }
    return result;
  }

  // 演算子の全組み合わせ
  function opComb(): [Operator, Operator, Operator][] {
    const result: [Operator, Operator, Operator][] = [];
    for (const o1 of operators) for (const o2 of operators) for (const o3 of operators) result.push([o1, o2, o3]);
    return result;
  }

  // 括弧のパターン
  function buildExprs(a: number, b: number, c: number, d: number, ops: [Operator, Operator, Operator]): string[] {
    const [o1, o2, o3] = ops;
    return [
      `(${a}${o1}${b})${o2}(${c}${o3}${d})`,
      `(((${a}${o1}${b})${o2}${c})${o3}${d})`,
      `(${a}${o1}(${b}${o2}${c}))${o3}${d}`,
      `${a}${o1}((${b}${o2}${c})${o3}${d})`,
      `${a}${o1}(${b}${o2}(${c}${o3}${d}))`
    ];
  }

  const exprSet = new Set<string>();
  for (const perm of permute(nums)) {
    for (const ops of opComb()) {
      for (const expr of buildExprs(perm[0], perm[1], perm[2], perm[3], ops)) {
        try {
          const val = evalExpression(expr);
          if (Math.abs(val - 12) < 1e-6 && Number.isFinite(val)) {
            exprSet.add(expr);
          }
        } catch {
          // 0除算などは無視
        }
      }
    }
  }
  return Array.from(exprSet);
}

/**
 * 数式文字列を評価し、値を返す
 * @param expr 数式（例: "2*3+(5+1)"）
 * @returns 計算結果
 */
export function evalExpression(expr: string): number {
  // 安全のためnew Functionで評価
  // eslint-disable-next-line no-new-func
  return Function(`"use strict";return (${expr})`)();
}
