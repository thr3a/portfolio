import { TextInput } from '@mantine/core';
import { IconAt } from '@tabler/icons-react';
import { useSearchFormContext } from '../form-context';

export const UsernameInput = () => {
  const form = useSearchFormContext();
  return (
    <TextInput
      maw={400}
      label='特定ユーザーからのみ'
      leftSection={<IconAt size={14} />}
      {...form.getInputProps('username')}
    />
  );
};
