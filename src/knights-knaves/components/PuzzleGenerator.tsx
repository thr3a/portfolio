import { Alert, Button, Group, Paper, Select, Stack, Text, ThemeIcon } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';
import { useState } from 'react';
import { usePuzzleGenerate } from '../hooks/usePuzzleGenerate';
import type { Level, PuzzleResponse } from '../types';
import { PuzzleBoard } from './PuzzleBoard';

const LEVEL_OPTIONS = [
  { value: 'easy', label: 'かんたん' },
  { value: 'normal', label: 'ふつう' },
  { value: 'hard', label: 'むずかしい' }
];

export const PuzzleGenerator = () => {
  const [numPersons, setNumPersons] = useState<number>(3);
  const [level, setLevel] = useState<Level>('easy');
  const [puzzle, setPuzzle] = useState<PuzzleResponse | null>(null);
  const { generate, loading, error } = usePuzzleGenerate();

  const maxPersons = level === 'easy' ? 9 : 50;
  const numPersonsOptions = Array.from({ length: maxPersons - 2 }, (_, i) => ({
    value: String(i + 3),
    label: `${i + 3}人`
  }));

  const handleLevelChange = (v: string | null) => {
    const newLevel = (v ?? 'easy') as Level;
    setLevel(newLevel);
    if (newLevel === 'easy' && numPersons > 9) {
      setNumPersons(3);
    }
  };

  const handleGenerate = async () => {
    const result = await generate({ num_persons: numPersons, level });
    if (result) {
      setPuzzle(result);

      const solutionLines = Object.entries(result.solution)
        .map(([name, type]) => `${name}: ${type === 'knight' ? '正直者' : '嘘つき者'}`)
        .join('\n');

      console.log(
        [
          '=== Knights and Knaves パズル ===',
          '【問題】',
          'この島には正直者（Knight）と嘘つき者（Knave）が住んでいます。',
          '以下の発言から、誰が正直者で誰が嘘つきかを当ててください。',
          '',
          '登場人物:',
          result.persons.map((p) => `- ${p}`).join('\n'),
          '',
          '発言:',
          result.statements_text.map((s) => `- ${s}`).join('\n'),
          '',
          '出力形式:',
          'Aさん: 嘘つき者',
          'Bさん: 正直者',
          '.....',
          '',
          '【正解】',
          solutionLines
        ].join('\n')
      );
    }
  };

  const handleReset = () => {
    setPuzzle(null);
  };

  if (puzzle) {
    return <PuzzleBoard puzzle={puzzle} onReset={handleReset} />;
  }

  return (
    <Stack gap='md'>
      <Paper withBorder p='md' bg='gray.0' style={{ borderLeft: '3px solid var(--mantine-color-yellow-5)' }}>
        <Stack gap='xs'>
          <Group gap='xs'>
            <ThemeIcon color='yellow.6' variant='transparent' size='sm'>
              <IconInfoCircle size={16} />
            </ThemeIcon>
            <Text size='sm' fw='bold' c='dark.6'>
              ルール
            </Text>
          </Group>
          <Text size='sm' c='dimmed'>
            この島には正直者と嘘つき者が住んでいます。正直者は常に真実を語り、嘘つき者は常に嘘をつきます。
            彼らの発言から、誰が正直者かを見抜いてください。
          </Text>
        </Stack>
      </Paper>

      <Select
        label='難易度'
        description='難しいほど発言の種類や数が増えます'
        data={LEVEL_OPTIONS}
        value={level}
        onChange={handleLevelChange}
      />

      <Select
        label='登場人物の数'
        data={numPersonsOptions}
        value={String(numPersons)}
        onChange={(v) => setNumPersons(v ? Number(v) : 3)}
      />

      <Button onClick={handleGenerate} loading={loading} color='blue' size='md'>
        挑戦する
      </Button>

      {error && (
        <Alert color='red' title='エラー'>
          {error}
        </Alert>
      )}
    </Stack>
  );
};
