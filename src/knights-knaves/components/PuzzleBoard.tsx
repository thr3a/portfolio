import { Alert, Button, Divider, Group, Stack, Text, ThemeIcon, Title } from '@mantine/core';
import { IconMessages } from '@tabler/icons-react';
import { useState } from 'react';
import type { PersonType, PuzzleResponse, UserAnswers } from '../types';
import { PersonToggle } from './PersonToggle';
import { StatementListTestimony } from './StatementList';

type Props = {
  puzzle: PuzzleResponse;
  onReset: () => void;
};

export const PuzzleBoard = ({ puzzle, onReset }: Props) => {
  const [answers, setAnswers] = useState<UserAnswers>(Object.fromEntries(puzzle.persons.map((p) => [p, null])));
  const [showResult, setShowResult] = useState(false);

  const allAnswered = puzzle.persons.every((p) => answers[p] !== null);

  const handleSelect = (name: string, type: PersonType) => {
    setAnswers((prev) => ({ ...prev, [name]: type }));
  };

  const handleCheck = () => {
    setShowResult(true);
  };

  const correctCount = showResult ? puzzle.persons.filter((p) => answers[p] === puzzle.solution[p]).length : 0;
  const isAllCorrect = correctCount === puzzle.persons.length;

  return (
    <Stack gap='lg'>
      <Stack gap='xs'>
        <Group gap='xs'>
          <ThemeIcon color='indigo.6' variant='transparent' size='sm'>
            <IconMessages size={18} />
          </ThemeIcon>
          <Title order={4}>発言一覧</Title>
        </Group>

        <StatementListTestimony statements={puzzle.statements} statementsText={puzzle.statements_text} />
      </Stack>

      <Divider />

      <Stack gap='xs'>
        <Title order={4}>あなたの回答</Title>
        <Text size='sm' c='dimmed'>
          各人物が正直者（常に真実を言う）か嘘つき者（常に嘘をつく）かを選んでください。
        </Text>
        <Stack gap='sm'>
          {puzzle.persons.map((name) => (
            <PersonToggle
              key={name}
              name={name}
              selected={answers[name]}
              result={showResult ? puzzle.solution[name] : null}
              showResult={showResult}
              onSelect={(type) => handleSelect(name, type)}
            />
          ))}
        </Stack>
      </Stack>

      {!showResult ? (
        <Button color='green' disabled={!allAnswered} onClick={handleCheck}>
          答え合わせ
        </Button>
      ) : (
        <Stack gap='sm'>
          <Alert color={isAllCorrect ? 'green' : 'orange'} title={isAllCorrect ? '正解！' : '残念...'}>
            {puzzle.persons.length}人中{correctCount}人正解
            {isAllCorrect && ' 全問正解です！'}
          </Alert>
          <Group>
            <Button variant='outline' onClick={onReset} flex={1}>
              再挑戦！
            </Button>
          </Group>
        </Stack>
      )}
    </Stack>
  );
};
