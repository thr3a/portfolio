// 利用できる演算子（表示用）
export type OperatorSymbol = '+' | '-' | '×' | '÷';

const OPS: readonly OperatorSymbol[] = ['+', '-', '×', '÷'] as const;

/**
 * 与えられた4つの整数と演算子3つで構成される式を「×・÷を先に、+・-を後に」の通常優先順位で評価する
 * - evalは使わない
 * - 途中での割り算は「割り切れる整数除算」のみ許可（余りが出る場合は不正な式として null を返す）
 * - 演算は整数のみ
 */
export function evaluateExpression(
  nums: readonly [number, number, number, number],
  ops: readonly [OperatorSymbol, OperatorSymbol, OperatorSymbol]
): number | null {
  // バリデーション（整数であること）
  if (
    nums.length !== 4 ||
    ops.length !== 3 ||
    !nums.every((n) => Number.isInteger(n)) ||
    !ops.every((o) => OPS.includes(o))
  ) {
    return null;
  }

  // 1段階目: ×・÷ を先に処理
  const values: number[] = [nums[0], nums[1], nums[2], nums[3]];
  const operators: OperatorSymbol[] = [ops[0], ops[1], ops[2]];

  const reducedValues: number[] = [values[0]];
  const reducedOps: OperatorSymbol[] = [];

  for (let i = 0; i < operators.length; i++) {
    const op = operators[i];
    const right = values[i + 1];
    if (op === '×' || op === '÷') {
      const left = reducedValues.pop() as number;
      if (op === '×') {
        reducedValues.push(left * right);
      } else {
        // 整数除算のみ許可（割り切れない場合は不正）
        if (right === 0) return null; // 1〜9のみの仕様だが念のため
        if (left % right !== 0) return null;
        reducedValues.push(Math.trunc(left / right));
      }
    } else {
      // + または - は後段に回す
      reducedValues.push(right);
      reducedOps.push(op);
    }
  }

  // 2段階目: +・- を左から順に処理
  let acc = reducedValues[0] ?? 0;
  for (let i = 0; i < reducedOps.length; i++) {
    const op = reducedOps[i];
    const right = reducedValues[i + 1];
    if (op === '+') acc = acc + right;
    else if (op === '-') acc = acc - right;
  }

  return acc;
}

/**
 * 人に見せる式文字列を作成（例: "9 − 1 × 4 − 3"）
 */
export function formatExpression(
  nums: readonly [number, number, number, number],
  ops: readonly [OperatorSymbol, OperatorSymbol, OperatorSymbol]
): string {
  return `${nums[0]} ${ops[0]} ${nums[1]} ${ops[1]} ${nums[2]} ${ops[2]} ${nums[3]}`;
}

/**
 * 与えられた4つの数字で、評価結果がちょうど12になる演算子3つの組み合わせを1つ見つける
 * 見つからなければ null
 */
export function findAnySolution(
  nums: readonly [number, number, number, number]
): { operators: [OperatorSymbol, OperatorSymbol, OperatorSymbol]; expression: string } | null {
  for (const op1 of OPS) {
    for (const op2 of OPS) {
      for (const op3 of OPS) {
        const ops: [OperatorSymbol, OperatorSymbol, OperatorSymbol] = [op1, op2, op3];
        const result = evaluateExpression(nums, ops);
        if (result === 12) {
          return {
            operators: ops,
            expression: formatExpression(nums, ops)
          };
        }
      }
    }
  }
  return null;
}

/**
 * ランダムに 1〜9 の整数を4つ生成
 */
export function randomNumbers(): [number, number, number, number] {
  const r = () => 1 + Math.floor(Math.random() * 9);
  return [r(), r(), r(), r()];
}

/**
 * まずランダムに所定回数試し、見つからなければ全探索（1..9の4重ループ）で解があるものを返す
 * 仕様: 「使用数字は1〜9からランダムに4つ」だが、失敗時のフォールバックとして全探索を行い、必ず返す
 */
export function generateMake12Problem(options?: {
  strategy?: 'random-first' | 'deterministic';
  maxAttempts?: number;
}): {
  numbers: [number, number, number, number];
  solution: { operators: [OperatorSymbol, OperatorSymbol, OperatorSymbol]; expression: string };
} {
  const strategy = options?.strategy ?? 'random-first';
  const maxAttempts = options?.maxAttempts ?? 20000;

  // ランダム優先
  if (strategy === 'random-first') {
    for (let i = 0; i < maxAttempts; i++) {
      const nums = randomNumbers();
      const sol = findAnySolution(nums);
      if (sol) {
        return { numbers: nums, solution: sol };
      }
    }
    // フォールバック: 全探索
  }

  // 全探索（必ず見つかるまで回す）
  for (let a = 1; a <= 9; a++) {
    for (let b = 1; b <= 9; b++) {
      for (let c = 1; c <= 9; c++) {
        for (let d = 1; d <= 9; d++) {
          const nums: [number, number, number, number] = [a, b, c, d];
          const sol = findAnySolution(nums);
          if (sol) {
            return { numbers: nums, solution: sol };
          }
        }
      }
    }
  }

  // 理論上ここには到達しない（12を作れる組み合わせは存在する）が、型の都合で最後に例外
  throw new Error('解のある問題を生成できませんでした');
}

// Webアプリから使いやすいエクスポート（デフォルト）
// - 4つの数字と、その数字で作れる回答例を1つ返す
export default generateMake12Problem;
