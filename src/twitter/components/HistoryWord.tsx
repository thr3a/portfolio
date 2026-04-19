import { ActionIcon, Group } from '@mantine/core';
import { IconX } from '@tabler/icons-react';
import { useSearchFormContext } from '../form-context';

type Props = {
  word: string;
  onDelete: (word: string) => void;
};

export const HistoryWord = ({ word, onDelete }: Props) => {
  const form = useSearchFormContext();
  return (
    <Group gap={2}>
      <ActionIcon
        variant='default'
        size='md'
        onClick={() => form.setFieldValue('word', word)}
        style={{
          fontWeight: 'normal',
          fontSize: 'var(--mantine-font-size-sm)',
          minWidth: 'auto',
          padding: '0 8px',
          width: 'auto'
        }}
        w='auto'
        px='sm'
      >
        {word}
      </ActionIcon>
      <ActionIcon variant='subtle' color='gray' size='md' onClick={() => onDelete(word)}>
        <IconX size={12} />
      </ActionIcon>
    </Group>
  );
};
