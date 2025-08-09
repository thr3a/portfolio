import { Alert, Box, Button, Center, Container, Group, List, MantineProvider, Stack, Title } from '@mantine/core';
import { useListState, useLongPress } from '@mantine/hooks';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { theme } from '../theme';
import { type OperatorSymbol, evaluateExpression, formatExpression, generateMake12Problem } from './make12';

// UI用のサイズ（スマホで2段に崩れないよう clamp で可変）
const NUM_SIZE = 'clamp(40px, 11vw, 72px)'; // 数字ブロック
const SLOT_SIZE = 'clamp(32px, 9vw, 56px)'; // 演算子スロット
const NUM_FONT = 'clamp(20px, 8vw, 36px)';
const OP_FONT = 'clamp(16px, 7vw, 28px)';

const useMake12Game = () => {
  const [problem, setProblem] = useState(() => generateMake12Problem());
  const { numbers, solution } = problem;

  console.log(problem.solution.expression);

  // 3つの演算子スロット（nullは未選択）
  const [operators, operatorsHandlers] = useListState<OperatorSymbol | null>([null, null, null]);

  // 選択中スロット index（0,1,2）/ 未選択は null
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // 判定結果の表示制御（null: 未判定, true: 正解, false: 間違い）
  const [judged, setJudged] = useState<null | boolean>(null);

  // 現在の評価値（3つ揃っていなければ null）
  const currentResult = useMemo(() => {
    if (operators.every((o): o is OperatorSymbol => o !== null)) {
      return evaluateExpression(numbers, operators as [OperatorSymbol, OperatorSymbol, OperatorSymbol]);
    }
    return null;
  }, [numbers, operators]);

  // デバッグログ
  useEffect(() => {
    if (operators.every((o): o is OperatorSymbol => o !== null)) {
      const ops = operators as [OperatorSymbol, OperatorSymbol, OperatorSymbol];
      console.log('expr:', formatExpression(numbers, ops));
      console.log('value:', currentResult);
    } else {
      console.log('value:', null);
    }
  }, [numbers, operators, currentResult]);

  // スロットへ演算子を設定
  const setOpToSelected = useCallback(
    (op: OperatorSymbol) => {
      if (selectedIndex === null) return;
      operatorsHandlers.setItem(selectedIndex, op);
      setJudged(null); // 演算子を変更したら判定結果をリセット
    },
    [selectedIndex, operatorsHandlers]
  );

  // スロットの演算子をクリア
  const clearOpSlot = useCallback(
    (index: number) => {
      operatorsHandlers.setItem(index, null);
      setJudged(null);
    },
    [operatorsHandlers]
  );

  // 解答をチェック
  const check = useCallback(() => {
    setJudged(currentResult === 12);
  }, [currentResult]);

  // 別の問題にする
  const regenerate = useCallback(() => {
    const nextProblem = generateMake12Problem();
    console.log(nextProblem.solution.expression);
    setProblem(nextProblem);
    operatorsHandlers.setState([null, null, null]);
    setSelectedIndex(null);
    setJudged(null);
  }, [operatorsHandlers]);

  // 解答表示
  const revealSolution = useCallback(() => {
    operatorsHandlers.setState([...solution.operators]);
    setSelectedIndex(null);
    setJudged(null);
  }, [solution, operatorsHandlers]);

  return {
    numbers,
    operators,
    selectedIndex,
    judged,
    currentResult,
    setSelectedIndex,
    setOpToSelected,
    clearOpSlot,
    check,
    regenerate,
    revealSolution
  };
};

// 表示用コンポーネント: 数字ブロック（タップ不可）
const NumberCard = ({ value }: { value: number }) => (
  <Center
    style={{
      width: NUM_SIZE,
      height: NUM_SIZE,
      borderRadius: 12,
      background: 'var(--mantine-color-gray-0)',
      border: '1px solid var(--mantine-color-gray-4)',
      fontSize: NUM_FONT,
      fontWeight: 700,
      userSelect: 'none',
      touchAction: 'manipulation'
    }}
  >
    {value}
  </Center>
);

// 表示用コンポーネント: 演算子スロット
const OpSlot = ({
  value,
  isSelected,
  onClick,
  onClear
}: {
  value: OperatorSymbol | null;
  isSelected: boolean;
  onClick: () => void;
  onClear: () => void;
}) => {
  const bg = isSelected ? 'var(--mantine-color-orange-6)' : 'var(--mantine-color-gray-1)';
  const color = isSelected ? 'white' : 'var(--mantine-color-dark-7)';
  const handlers = useLongPress(onClear, { threshold: 500 });

  return (
    <Button
      type='button'
      onClick={onClick}
      {...handlers}
      styles={{
        root: {
          width: SLOT_SIZE,
          height: SLOT_SIZE,
          padding: 0,
          borderRadius: 10,
          background: bg,
          color,
          border: isSelected ? '2px solid var(--mantine-color-orange-7)' : '1px solid var(--mantine-color-gray-4)',
          fontSize: OP_FONT,
          fontWeight: 700,
          boxShadow: isSelected ? '0 0 0 2px var(--mantine-color-orange-2) inset' : 'none',
          userSelect: 'none',
          touchAction: 'manipulation'
        }
      }}
      variant='filled'
    >
      {value ?? ''}
    </Button>
  );
};

const Rule = () => {
  return (
    <>
      <Alert color='green' variant='light'>
        <List>
          <List.Item>演算子を組み合わせて合計値12を作るゲームです。</List.Item>
          <List.Item>整数のみ、小数点、分数不可</List.Item>
          <List.Item>演算の評価順は×,÷が先で+,-が後</List.Item>
          <List.Item>例: 9,4,6,8 → 9 + 4 × 6 ÷ 8</List.Item>
        </List>
      </Alert>
    </>
  );
};

export default function Make12Page() {
  useEffect(() => {
    document.title = 'Make12';
  }, []);

  const {
    numbers,
    operators,
    selectedIndex,
    judged,
    currentResult,
    setSelectedIndex,
    setOpToSelected,
    clearOpSlot,
    check,
    regenerate,
    revealSolution
  } = useMake12Game();

  const palette: OperatorSymbol[] = ['+', '-', '×', '÷'];

  return (
    <MantineProvider theme={theme}>
      <Container id='container' maw={560}>
        <Title mt={'sm'} order={2}>
          Make12
        </Title>
        <Title order={6} mb={'sm'} c={'dimmed'}>
          四則演算を駆使して12をつくろう！
        </Title>

        <Stack gap='xs'>
          {/* 判定結果 */}
          {judged === true && (
            <Alert color='green' variant='light'>
              おめでとう！🎉🎉 正解です！
            </Alert>
          )}
          {judged === false && (
            <Alert color='red' variant='light'>
              残念、{currentResult}なので違います。
            </Alert>
          )}

          {/* 問題表示（1行固定、折り返さない） */}
          <Box
            style={{
              width: '100%',
              overflowX: 'auto',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            <Group gap='sm' justify='center' wrap='nowrap'>
              <NumberCard value={numbers[0]} />
              <OpSlot
                value={operators[0]}
                isSelected={selectedIndex === 0}
                onClick={() => setSelectedIndex(0)}
                onClear={() => clearOpSlot(0)}
              />
              <NumberCard value={numbers[1]} />
              <OpSlot
                value={operators[1]}
                isSelected={selectedIndex === 1}
                onClick={() => setSelectedIndex(1)}
                onClear={() => clearOpSlot(1)}
              />
              <NumberCard value={numbers[2]} />
              <OpSlot
                value={operators[2]}
                isSelected={selectedIndex === 2}
                onClick={() => setSelectedIndex(2)}
                onClear={() => clearOpSlot(2)}
              />
              <NumberCard value={numbers[3]} />
            </Group>
          </Box>

          {/* 下部固定パレット + アクションエリア */}
          <Box
            style={{
              position: 'sticky',
              bottom: 0,
              padding: '12px',
              borderTop: '1px solid var(--mantine-color-gray-3)'
            }}
          >
            {/* 演算子パレット */}
            <Group justify='center' gap='md'>
              {palette.map((op) => (
                <Button
                  key={op}
                  size='lg'
                  radius='md'
                  onClick={() => setOpToSelected(op)}
                  disabled={selectedIndex === null}
                  variant='filled'
                  color='blue'
                  styles={{
                    root: {
                      minWidth: 64
                    }
                  }}
                >
                  {op}
                </Button>
              ))}
            </Group>

            {/* アクションエリア */}
            <Stack justify='center' gap='md' mt={'xl'}>
              <Button onClick={check}>☑️ チェック！</Button>
              <Button variant='outline' onClick={regenerate}>
                ♻️ 別の問題にする
              </Button>
              <Button variant='outline' color='red' onClick={revealSolution}>
                解答表示
              </Button>
              <Rule />
            </Stack>
          </Box>
        </Stack>
      </Container>
    </MantineProvider>
  );
}
