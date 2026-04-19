import { DateInput } from '@mantine/dates';
import { useSearchFormContext } from '../form-context';

export const EndDateInput = () => {
  const form = useSearchFormContext();
  return <DateInput label='この日より昔(当日を含まない)' {...form.getInputProps('endDate')} />;
};
