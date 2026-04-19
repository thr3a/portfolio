import { TextInput } from '@mantine/core';
import { useSearchFormContext } from '../form-context';

export const DateInput = () => {
  const form = useSearchFormContext();
  return <TextInput type='date' label='この日より昔(当日を含まない)' {...form.getInputProps('endDate')} />;
};
