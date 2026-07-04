import { Group, Text } from '@mantine/core';
import { COLORS } from '../theme';

type SectionKeyProps = {
  name: string;
  comment?: string;
  level?: 1 | 2;
};

export const SectionKey = ({ name, comment, level = 2 }: SectionKeyProps) => {
  return (
    <Group gap='sm' align='baseline'>
      <Text ff='monospace' fw='bold' fz={level === 1 ? '1.75rem' : '1.25rem'} c={COLORS.ink} lh={1.2}>
        <Text component='span' inherit c={COLORS.shu}>
          {'#'.repeat(level)}
        </Text>
        &nbsp;{name}
      </Text>
      {comment && (
        <Text ff='monospace' fz='sm' c='dimmed'>
          {comment}
        </Text>
      )}
    </Group>
  );
};
