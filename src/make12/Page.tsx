import { Alert, Box, Button, Center, Container, Group, MantineProvider, Stack, Title } from '@mantine/core';
import { useListState, useLongPress, useTimeout } from '@mantine/hooks';
import { useEffect, useMemo, useState } from 'react';
import { theme } from '../theme';
import generateMake12Problem, { type OperatorSymbol, evaluateExpression, formatExpression } from './make12';

// UI用のサイズ（スマホで2段に崩れないよう clamp で可変）
const NUM_SIZE = 'clamp(40px, 11vw, 72px)'; // 数字ブロック
const SLOT_SIZE = 'clamp(32px, 9vw, 56px)'; // 演算子スロット
const NUM_FONT = 'clamp(20px, 8vw, 36px)';
const OP_FONT = 'clamp(16px, 7vw, 28px)';

export default function Make12Page() {
  useEffect(() => {
    document.title = 'Make12';
  }, []);

  const initial = useMemo(() => generateMake12Problem(), []);
  const [numbers, setNumbers] = useState<[number, number, number, number]>(initial.numbers);

  console.log(initial.solution.expression);

  // 3つの演算子スロット（nullは未選択）
  const [operators, operatorsHandlers] = useListState<OperatorSymbol | null>([null, null, null]);

  // 選択中スロット index（0,1,2）/ 未選択は null
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // 正解メッセージ表示制御
  const [isCorrect, setIsCorrect] = useState(false);

  // 「別の問題にする」連打デバウンス（一定時間押下無効化）
  const [regenDisabled, setRegenDisabled] = useState(false);
  const regenTimeout = useTimeout(() => setRegenDisabled(false), 500);

  // 現在の評価値（3つ揃っていなければ null）
  const currentResult = useMemo(() => {
    if (operators.every((o): o is OperatorSymbol => o !== null)) {
      return evaluateExpression(numbers, operators as [OperatorSymbol, OperatorSymbol, OperatorSymbol]);
    }
    return null;
  }, [numbers, operators]);

  // デバッグログと正解判定
  useEffect(() => {
    // デバッグ: 評価値は常にログ出力（未完成は null）
    // 可能なら式文字列も出力
    if (operators.every((o): o is OperatorSymbol => o !== null)) {
      const ops = operators as [OperatorSymbol, OperatorSymbol, OperatorSymbol];
      console.log('expr:', formatExpression(numbers, ops));
      console.log('value:', currentResult);
    } else {
      console.log('value:', null);
    }

    setIsCorrect(currentResult === 12);
  }, [numbers, operators, currentResult]);

  // スロットへ演算子を設定
  const setOpToSelected = (op: OperatorSymbol) => {
    if (selectedIndex === null) return;
    operatorsHandlers.setItem(selectedIndex, op);
  };

  // 別の問題にする（デバウンス込み）
  const handleRegenerate = () => {
    if (regenDisabled) return;
    setRegenDisabled(true);
    regenTimeout.start();

    const next = generateMake12Problem();
    console.log(next.solution.expression);
    setNumbers(next.numbers);
    operatorsHandlers.setState([null, null, null]);
    setSelectedIndex(null);
    setIsCorrect(false);
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
  const OpSlot = ({ index }: { index: number }) => {
    const value = operators[index];
    const isSelected = selectedIndex === index;
    const bg = isSelected ? 'var(--mantine-color-orange-6)' : 'var(--mantine-color-gray-1)';
    const color = isSelected ? 'white' : 'var(--mantine-color-dark-7)';
    const handlers = useLongPress(() => operatorsHandlers.setItem(index, null), { threshold: 500 });

    return (
      <Button
        type='button'
        onClick={() => setSelectedIndex(index)}
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
            // transition: 'background 120ms ease, border-color 120ms ease, box-shadow 120ms ease'
          }
        }}
        variant='filled'
      >
        {value ?? ''}
      </Button>
    );
  };

  const palette: OperatorSymbol[] = ['+', '-', '×', '÷'];

  return (
    <MantineProvider theme={theme}>
      <Container id='container' maw={560}>
        <Stack gap='xs'>
          {/* ヘッダー */}
          <Title mt={'sm'} order={2}>
            Make12
          </Title>
          <Title order={6} mb={'sm'} c={'dimmed'}>
            四則演算を駆使して12をつくろう！
            <div>(例: 9,4,6,8 → 9 + 4 × 6 ÷ 8)</div>
          </Title>

          {/* 正解フィードバック */}
          {isCorrect && (
            <Alert color='green' variant='light'>
              正解です
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
              <OpSlot index={0} />
              <NumberCard value={numbers[1]} />
              <OpSlot index={1} />
              <NumberCard value={numbers[2]} />
              <OpSlot index={2} />
              <NumberCard value={numbers[3]} />
            </Group>
          </Box>

          {/* 下部固定パレット + アクションエリア */}
          <Box
            style={{
              position: 'sticky',
              bottom: 0,
              padding: '12px',
              background: 'var(--mantine-color-body)',
              borderTop: '1px solid var(--mantine-color-gray-3)',
              zIndex: 10
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
            <Group justify='center' mt='sm'>
              <Button variant='light' color='gray' onClick={handleRegenerate} disabled={regenDisabled}>
                別の問題にする
              </Button>
            </Group>
          </Box>
        </Stack>
      </Container>
    </MantineProvider>
  );
}
