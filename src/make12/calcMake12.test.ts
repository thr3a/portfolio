import { describe, expect, it } from 'vitest';
import { canMake12, evalExpression, findMake12Expressions } from './calcMake12';

describe('make12ロジック', () => {
  it('2,3,5,1で12が作れる', () => {
    const nums = [2, 3, 5, 1];
    const exprs = findMake12Expressions(nums);
    expect(exprs.length).toBeGreaterThan(0);
    expect(exprs.some((e) => Math.abs(evalExpression(e) - 12) < 1e-6)).toBe(true);
  });

  it('1,1,1,1では12は作れない', () => {
    const nums = [1, 1, 1, 1];
    const exprs = findMake12Expressions(nums);
    expect(exprs.length).toBe(0);
    expect(canMake12(nums)).toBe(false);
  });

  it('evalExpressionで式が正しく評価される', () => {
    expect(evalExpression('2*3+(5+1)')).toBe(12);
    expect(evalExpression('(2+3)*(1+1)')).toBe(10);
  });
});
