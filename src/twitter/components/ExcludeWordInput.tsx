import { TextInput } from '@mantine/core';
import { useSearchFormContext } from '../form-context';

export const ExcludeWordInput = () => {
  const form = useSearchFormContext();
  return <TextInput label='除外ワード' {...form.getInputProps('excludeWord')} />;
};
