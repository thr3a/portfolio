import { Paper, Stack, Text } from '@mantine/core';
import type { Statement } from '../types';

type Props = {
  statements: Statement[];
  statementsText: string[];
};

const parseQuote = (text: string): string => {
  const match = text.match(/「(.+)」/);
  return match ? match[1] : text;
};

export const StatementListTestimony = ({ statements, statementsText }: Props) => (
  <Stack gap='xs'>
    {statementsText.map((text, i) => {
      const speaker = statements[i]?.speaker ?? '';
      const quote = parseQuote(text);
      return (
        <Paper
          key={i}
          p='md'
          bg='dark.7'
          style={{
            borderLeft: '3px solid var(--mantine-color-yellow-5)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Text size='xs' c='yellow.5' fw='bold' tt='uppercase' mb={4}>
            {speaker}
          </Text>
          <Text size='sm' fs='italic' c='gray.2'>
            「{quote}」
          </Text>
        </Paper>
      );
    })}
  </Stack>
);
