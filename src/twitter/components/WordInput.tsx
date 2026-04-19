import { TextInput } from '@mantine/core';
import { useSearchFormContext } from '../form-context';

export const WordInput = () => {
  const form = useSearchFormContext();
  return <TextInput label='検索ワード' {...form.getInputProps('word')} />;
};
