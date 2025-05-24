import {
  Box,
  Button,
  Center,
  Container,
  Group,
  MantineProvider,
  Paper,
  Radio,
  Stack,
  Text,
  Title
} from '@mantine/core';
import { useMemo, useState } from 'react';
import { theme } from '../theme';
import { type Operator, evalExpression, findMake12Expressions, operators } from './calcMake12';

// 1~9の4つの数字で12が作れる組み合わせをランダムに出題
function generateQuestion(): number[] {
  while (true) {
    const nums = Array.from({ length: 4 }, () => Math.floor(Math.random() * 9) + 1);
    if (findMake12Expressions(nums).length > 0) return nums;
  }
}

export default function Make12Page() {
  const [question, setQuestion] = useState<number[]>(() => generateQuestion());
  const [ops, setOps] = useState<[Operator, Operator, Operator]>(['+', '+', '+']);
  const [answer, setAnswer] = useState<string | null>(null);
  const [result, setResult] = useState<null | { correct: boolean; model: string }>(null);

  // 模範解答
  const modelAnswers = useMemo(() => findMake12Expressions(question), [question]);

  // 数字と演算子から式を組み立て
  function buildUserExpr(): string {
    const [a, b, c, d] = question;
    const [o1, o2, o3] = ops;
    // デフォルトは (a o1 b) o2 (c o3 d)
    return `(${a}${o1}${b})${o2}(${c}${o3}${d})`;
  }

  function handleSubmit() {
    const expr = buildUserExpr();
    setAnswer(expr);
    const val = evalExpression(expr);
    // 12に一致するか
    const correct = Math.abs(val - 12) < 1e-6;
    // 模範解答にも同じ式が含まれるか
    const model = modelAnswers[0] || '';
    setResult({ correct, model });
  }

  function handleReset() {
    setQuestion(generateQuestion());
    setOps(['+', '+', '+']);
    setAnswer(null);
    setResult(null);
  }

  return (
    <MantineProvider theme={theme}>
      <Container maw={400}>
        <Title mt={'sm'} order={2}>
          パスワード一括生成ツール
        </Title>
        <Title order={6} mb={'sm'} c={'dimmed'}>
          安全なパスワードを一括で作成します。
        </Title>
        <Paper shadow='md' p='xl' maw={400} w='100%'>
          <Stack gap='md'>
            <Text size='lg' ta='center' fw={700} mb='xs'>
              make12 - 四則演算で12を作ろう
            </Text>
            <Group justify='center' gap='lg' mb='xs'>
              {question.map((n, i) => (
                <Box
                  key={i}
                  p='md'
                  bg='blue.0'
                  c='blue.8'
                  fz='xl'
                  fw={700}
                  style={{ borderRadius: 8, minWidth: 40, textAlign: 'center' }}
                >
                  {n}
                </Box>
              ))}
            </Group>
            {/* 3行の演算子選択 */}
            {[0, 1, 2].map((idx) => (
              <Radio.Group
                key={idx}
                value={ops[idx]}
                onChange={(v) =>
                  setOps((prev) => {
                    const next = [...prev] as [Operator, Operator, Operator];
                    next[idx] = v as Operator;
                    return next;
                  })
                }
                name={`op${idx}`}
                label={`演算子${idx + 1}`}
                withAsterisk
                mt={idx === 0 ? 'md' : 0}
              >
                <Group gap='md'>
                  {operators.map((op) => (
                    <Radio key={op} value={op} label={op} />
                  ))}
                </Group>
              </Radio.Group>
            ))}
            <Center>
              <Button color='blue' size='md' onClick={handleSubmit} disabled={!!result}>
                解答
              </Button>
              <Button variant='light' ml='md' onClick={handleReset}>
                リセット
              </Button>
            </Center>
            {/* 判定表示 */}
            {result && (
              <Box mt='md' ta='center'>
                {result.correct ? (
                  <Text c='green.7' fw={700}>
                    正解！ {answer} = 12
                  </Text>
                ) : (
                  <>
                    <Text c='red.7' fw={700}>
                      不正解… あなたの式: {answer} = {evalExpression(answer ?? '')}
                    </Text>
                    <Text c='gray.7' mt='xs'>
                      模範解答例: {result.model} = 12
                    </Text>
                  </>
                )}
              </Box>
            )}
          </Stack>
        </Paper>
      </Container>
    </MantineProvider>
  );
}
